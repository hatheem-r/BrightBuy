const db = require("../config/db");

// Create a new order with order items
const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      customer_id,
      address_id,
      delivery_mode,
      delivery_zip,
      payment_method,
      items, // Array of { variant_id, quantity, unit_price }
      sub_total,
      delivery_fee,
      total,
    } = req.body;

    // Validate required fields
    if (
      !customer_id ||
      !delivery_mode ||
      !items ||
      items.length === 0 ||
      !sub_total ||
      !total
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: customer_id, delivery_mode, items, sub_total, total",
      });
    }

    // Validate delivery mode requirements
    if (delivery_mode === "Standard Delivery" && !address_id) {
      return res.status(400).json({
        error: "Standard Delivery requires an address_id",
      });
    }

    if (delivery_mode === "Standard Delivery" && !delivery_zip) {
      return res.status(400).json({
        error: "Standard Delivery requires a delivery_zip",
      });
    }

    await connection.beginTransaction();

    // 1. Insert the order
    const [orderResult] = await connection.execute(
      `INSERT INTO Orders (
        customer_id, 
        address_id, 
        delivery_mode, 
        delivery_zip, 
        status, 
        sub_total, 
        delivery_fee, 
        total
      ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        customer_id,
        address_id || null,
        delivery_mode,
        delivery_zip || null,
        sub_total,
        delivery_fee || 0,
        total,
      ]
    );

    const order_id = orderResult.insertId;

    // 2. Check stock status for all items (to determine delivery delay)
    let hasOutOfStockItems = false;
    for (const item of items) {
      if (!item.variant_id || !item.quantity || !item.unit_price) {
        throw new Error(
          "Each item must have variant_id, quantity, and unit_price"
        );
      }

      // Check current stock
      const [inventoryCheck] = await connection.execute(
        `SELECT quantity FROM Inventory WHERE variant_id = ?`,
        [item.variant_id]
      );

      if (inventoryCheck.length === 0) {
        throw new Error(`Variant ${item.variant_id} not found in inventory`);
      }

      // Check if any item is out of stock
      if (inventoryCheck[0].quantity < item.quantity) {
        hasOutOfStockItems = true;
      }
    }

    // 3. Insert order items and update inventory
    for (const item of items) {
      await connection.execute(
        `INSERT INTO Order_item (order_id, variant_id, quantity, unit_price) 
         VALUES (?, ?, ?, ?)`,
        [order_id, item.variant_id, item.quantity, item.unit_price]
      );

      // Deduct from inventory (allow negative stock for backorders)
      await connection.execute(
        `UPDATE Inventory 
         SET quantity = quantity - ? 
         WHERE variant_id = ?`,
        [item.quantity, item.variant_id]
      );
    }

    // 4. Create payment record
    // Card payments are marked as 'paid' directly, Cash on Delivery is 'pending'
    const paymentStatus =
      payment_method === "Card Payment" ? "paid" : "pending";

    const [paymentResult] = await connection.execute(
      `INSERT INTO Payment (order_id, method, amount, status) 
       VALUES (?, ?, ?, ?)`,
      [order_id, payment_method || "Cash on Delivery", total, paymentStatus]
    );

    const payment_id = paymentResult.insertId;

    // 5. Update order with payment_id (done automatically by trigger, but we can also do it explicitly)
    await connection.execute(
      `UPDATE Orders SET payment_id = ? WHERE order_id = ?`,
      [payment_id, order_id]
    );

    // 6. Calculate estimated delivery days based on stock and location
    if (delivery_mode === "Standard Delivery" && delivery_zip) {
      const [deliveryInfo] = await connection.execute(
        `SELECT base_days FROM ZipDeliveryZone WHERE zip_code = ?`,
        [delivery_zip]
      );

      let estimatedDays = 7; // Default 7 days if zip not found
      if (deliveryInfo.length > 0) {
        estimatedDays = deliveryInfo[0].base_days; // 5 days for main cities, 7 for others
      }

      // Add 3 days if any item is out of stock at time of order
      if (hasOutOfStockItems) {
        estimatedDays += 3;
      }

      await connection.execute(
        `UPDATE Orders SET estimated_delivery_days = ? WHERE order_id = ?`,
        [estimatedDays, order_id]
      );
    } else if (delivery_mode === "Store Pickup") {
      // Store pickup doesn't need delivery days
      await connection.execute(
        `UPDATE Orders SET estimated_delivery_days = NULL WHERE order_id = ?`,
        [order_id]
      );
    }

    await connection.commit();

    // Fetch the complete order details
    const [orderDetails] = await connection.execute(
      `SELECT o.*, p.method as payment_method, p.status as payment_status
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       WHERE o.order_id = ?`,
      [order_id]
    );

    const [orderItems] = await connection.execute(
      `SELECT oi.*, pv.sku, p.name as product_name, p.brand
       FROM Order_item oi
       JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
       JOIN Product p ON pv.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.status(201).json({
      message: "Order created successfully",
      order: {
        ...orderDetails[0],
        items: orderItems,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating order:", error);
    res.status(500).json({
      error: "Failed to create order",
      details: error.message,
    });
  } finally {
    connection.release();
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;

    const [orders] = await db.execute(
      `SELECT o.*, 
              p.method as payment_method, 
              p.status as payment_status,
              p.transaction_id,
              a.line1, a.line2, a.city, a.state, a.zip_code,
              CONCAT(c.first_name, ' ', c.last_name) as customer_name,
              c.email as customer_email,
              c.phone as customer_phone
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       LEFT JOIN Address a ON o.address_id = a.address_id
       LEFT JOIN Customer c ON o.customer_id = c.customer_id
       WHERE o.order_id = ?`,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [orderItems] = await db.execute(
      `SELECT oi.*, 
              pv.sku, 
              pv.color,
              pv.size,
              p.name as product_name, 
              p.brand
       FROM Order_item oi
       JOIN ProductVariant pv ON oi.variant_id = pv.variant_id
       JOIN Product p ON pv.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.json({
      order: orders[0],
      items: orderItems,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      error: "Failed to fetch order",
      details: error.message,
    });
  }
};

// Get orders by customer ID
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Get orders with full details
    const [orders] = await db.execute(
      `SELECT o.order_id,
              o.customer_id,
              o.address_id,
              o.payment_id,
              o.delivery_mode,
              o.delivery_zip,
              o.status,
              o.sub_total,
              o.delivery_fee,
              o.total,
              o.estimated_delivery_days,
              o.created_at,
              o.updated_at,
              p.method as payment_method, 
              p.status as payment_status,
              p.amount as payment_amount,
              p.transaction_id,
              COUNT(DISTINCT oi.order_item_id) as item_count,
              SUM(oi.quantity * oi.unit_price) as items_total
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       LEFT JOIN Order_item oi ON o.order_id = oi.order_id
       WHERE o.customer_id = ?
       GROUP BY o.order_id, o.customer_id, o.address_id, o.payment_id, 
                o.delivery_mode, o.delivery_zip, o.status, o.sub_total, 
                o.delivery_fee, o.total, o.estimated_delivery_days, 
                o.created_at, o.updated_at, p.method, p.status, 
                p.amount, p.transaction_id
       ORDER BY o.created_at DESC`,
      [customer_id]
    );

    console.log(`Found ${orders.length} orders for customer ${customer_id}`);

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        validStatuses,
      });
    }

    await db.execute(`UPDATE Orders SET status = ? WHERE order_id = ?`, [
      status,
      order_id,
    ]);

    res.json({
      message: "Order status updated successfully",
      order_id,
      status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      error: "Failed to update order status",
      details: error.message,
    });
  }
};

// Get all orders (for staff)
const getAllOrders = async (req, res) => {
  try {
    // Get all orders with full details including shipment information
    const [orders] = await db.execute(
      `SELECT o.order_id,
              o.customer_id,
              o.address_id,
              o.payment_id,
              o.shipment_id,
              o.delivery_mode,
              o.delivery_zip,
              o.status,
              o.sub_total,
              o.delivery_fee,
              o.total,
              o.estimated_delivery_days,
              o.created_at,
              o.updated_at,
              p.method as payment_method, 
              p.status as payment_status,
              p.amount as payment_amount,
              p.transaction_id,
              s.shipment_provider,
              s.tracking_number,
              s.shipped_date,
              s.delivered_date,
              s.notes as shipment_notes,
              COUNT(DISTINCT oi.order_item_id) as item_count,
              SUM(oi.quantity * oi.unit_price) as items_total
       FROM Orders o
       LEFT JOIN Payment p ON o.payment_id = p.payment_id
       LEFT JOIN Shipment s ON o.shipment_id = s.shipment_id
       LEFT JOIN Order_item oi ON o.order_id = oi.order_id
       GROUP BY o.order_id
       ORDER BY o.created_at DESC`
    );

    console.log(`Found ${orders.length} total orders`);

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};

// Update shipment information (for staff)
const updateShipmentInfo = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { shipment_provider, tracking_number, notes } = req.body;

    // First, check if order exists and get its shipment_id
    const [orders] = await db.execute(
      `SELECT shipment_id FROM Orders WHERE order_id = ?`,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    if (order.shipment_id) {
      // Update existing shipment record
      await db.execute(
        `UPDATE Shipment 
         SET shipment_provider = ?, 
             tracking_number = ?, 
             notes = ?,
             shipped_date = CASE WHEN shipped_date IS NULL AND ? IS NOT NULL THEN NOW() ELSE shipped_date END
         WHERE shipment_id = ?`,
        [
          shipment_provider,
          tracking_number,
          notes,
          tracking_number,
          order.shipment_id,
        ]
      );

      res.json({
        message: "Shipment information updated successfully",
        order_id,
        shipment_id: order.shipment_id,
      });
    } else {
      // Create new shipment record
      const [result] = await db.execute(
        `INSERT INTO Shipment (shipment_provider, tracking_number, notes, shipped_date)
         VALUES (?, ?, ?, ?)`,
        [
          shipment_provider,
          tracking_number,
          notes,
          tracking_number ? new Date() : null,
        ]
      );

      const shipment_id = result.insertId;

      // Link shipment to order
      await db.execute(`UPDATE Orders SET shipment_id = ? WHERE order_id = ?`, [
        shipment_id,
        order_id,
      ]);

      res.json({
        message: "Shipment information created successfully",
        order_id,
        shipment_id,
      });
    }
  } catch (error) {
    console.error("Error updating shipment information:", error);
    res.status(500).json({
      error: "Failed to update shipment information",
      details: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByCustomer,
  updateOrderStatus,
  getAllOrders,
  updateShipmentInfo,
};
