// controllers/customerController.js
const db = require("../config/db");

// Get customer profile with addresses
const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Get customer basic info
    const [customerRows] = await db.query(
      `SELECT customer_id, first_name, last_name, user_name, email, phone, created_at
       FROM Customer 
       WHERE customer_id = ?`,
      [customerId]
    );

    if (customerRows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = customerRows[0];

    // Get customer addresses
    const [addresses] = await db.query(
      `SELECT address_id, line1, line2, city, state, zip_code, is_default
       FROM Address 
       WHERE customer_id = ?
       ORDER BY is_default DESC, address_id DESC`,
      [customerId]
    );

    res.json({
      ...customer,
      addresses: addresses || [],
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res
      .status(500)
      .json({
        message: "Error fetching customer profile",
        error: error.message,
      });
  }
};

// Update customer basic info (phone, name, etc.)
const updateCustomerInfo = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { first_name, last_name, phone } = req.body;

    // Validate phone number if provided
    if (phone !== undefined) {
      // Remove any non-digit characters for validation
      const cleanPhone = phone.replace(/\D/g, "");

      // Check if phone contains only digits
      if (!/^\d+$/.test(cleanPhone)) {
        return res.status(400).json({
          message: "Phone number must contain only digits",
        });
      }

      // Check phone length (10-15 digits)
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        return res.status(400).json({
          message: "Phone number must be between 10 and 15 digits",
        });
      }
    }

    const updateFields = [];
    const values = [];

    if (first_name !== undefined) {
      updateFields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      updateFields.push("last_name = ?");
      values.push(last_name);
    }
    if (phone !== undefined) {
      updateFields.push("phone = ?");
      // Store cleaned phone number (digits only)
      values.push(phone.replace(/\D/g, ""));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(customerId);

    const query = `UPDATE Customer SET ${updateFields.join(
      ", "
    )} WHERE customer_id = ?`;
    await db.query(query, values);

    // Return updated customer info
    const [updatedCustomer] = await db.query(
      `SELECT customer_id, first_name, last_name, user_name, email, phone, created_at
       FROM Customer 
       WHERE customer_id = ?`,
      [customerId]
    );

    res.json({
      message: "Customer info updated successfully",
      customer: updatedCustomer[0],
    });
  } catch (error) {
    console.error("Error updating customer info:", error);
    res
      .status(500)
      .json({ message: "Error updating customer info", error: error.message });
  }
};

// Add or update customer address
const saveCustomerAddress = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { address_id, line1, line2, city, state, zip_code, is_default } =
      req.body;

    // Validate required fields
    if (!line1 || !city || !state || !zip_code) {
      return res
        .status(400)
        .json({ message: "Missing required address fields" });
    }

    if (address_id) {
      // Update existing address
      await db.query(
        `UPDATE Address 
         SET line1 = ?, line2 = ?, city = ?, state = ?, zip_code = ?, is_default = ?
         WHERE address_id = ? AND customer_id = ?`,
        [
          line1,
          line2 || null,
          city,
          state,
          zip_code,
          is_default ? 1 : 0,
          address_id,
          customerId,
        ]
      );

      // If this is set as default, unset other defaults
      if (is_default) {
        await db.query(
          `UPDATE Address SET is_default = 0 WHERE customer_id = ? AND address_id != ?`,
          [customerId, address_id]
        );
      }

      res.json({ message: "Address updated successfully", address_id });
    } else {
      // Insert new address
      const [result] = await db.query(
        `INSERT INTO Address (customer_id, line1, line2, city, state, zip_code, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          line1,
          line2 || null,
          city,
          state,
          zip_code,
          is_default ? 1 : 0,
        ]
      );

      // If this is set as default, unset other defaults
      if (is_default) {
        await db.query(
          `UPDATE Address SET is_default = 0 WHERE customer_id = ? AND address_id != ?`,
          [customerId, result.insertId]
        );
      }

      res.json({
        message: "Address added successfully",
        address_id: result.insertId,
      });
    }
  } catch (error) {
    console.error("Error saving address:", error);
    res
      .status(500)
      .json({ message: "Error saving address", error: error.message });
  }
};

// Get customer's default or first address
const getCustomerDefaultAddress = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const [addresses] = await db.query(
      `SELECT address_id, line1, line2, city, state, zip_code, is_default
       FROM Address 
       WHERE customer_id = ?
       ORDER BY is_default DESC, address_id DESC
       LIMIT 1`,
      [customerId]
    );

    if (addresses.length === 0) {
      return res.json({ address: null });
    }

    res.json({ address: addresses[0] });
  } catch (error) {
    console.error("Error fetching default address:", error);
    res
      .status(500)
      .json({ message: "Error fetching address", error: error.message });
  }
};

// Delete an address
const deleteCustomerAddress = async (req, res) => {
  try {
    const { customerId, addressId } = req.params;

    await db.query(
      `DELETE FROM Address WHERE address_id = ? AND customer_id = ?`,
      [addressId, customerId]
    );

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};

module.exports = {
  getCustomerProfile,
  updateCustomerInfo,
  saveCustomerAddress,
  getCustomerDefaultAddress,
  deleteCustomerAddress,
};
