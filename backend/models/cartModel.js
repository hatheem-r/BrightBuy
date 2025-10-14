// models/cartModel.js
const db = require("../config/db");

class CartModel {
  // Get or create cart for customer
  static async getOrCreateCart(customerId) {
    const sql = `CALL GetOrCreateCart(?, @cart_id)`;

    try {
      await db.query(sql, [customerId]);
      const [rows] = await db.query("SELECT @cart_id as cart_id");
      return rows[0].cart_id;
    } catch (error) {
      throw error;
    }
  }

  // Get cart details with all items
  static async getCartDetails(cartId) {
    const sql = `CALL GetCartDetails(?)`;

    try {
      const [rows] = await db.query(sql, [cartId]);
      return rows[0]; // First result set contains the items
    } catch (error) {
      throw error;
    }
  }

  // Get cart summary
  static async getCartSummary(cartId) {
    const sql = `CALL GetCartSummary(?)`;

    try {
      const [rows] = await db.query(sql, [cartId]);
      return rows[0][0]; // First row of first result set
    } catch (error) {
      throw error;
    }
  }

  // Add item to cart
  static async addToCart(cartId, variantId, quantity) {
    const sql = `CALL AddToCart(?, ?, ?)`;

    try {
      await db.query(sql, [cartId, variantId, quantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item quantity
  static async updateCartItemQuantity(cartId, variantId, newQuantity) {
    const sql = `CALL UpdateCartItemQuantity(?, ?, ?)`;

    try {
      await db.query(sql, [cartId, variantId, newQuantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove item from cart
  static async removeCartItem(cartId, variantId) {
    const sql = `CALL RemoveCartItem(?, ?)`;

    try {
      await db.query(sql, [cartId, variantId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove quantity from cart
  static async removeFromCart(cartId, variantId, quantity) {
    const sql = `CALL RemoveFromCart(?, ?, ?)`;

    try {
      await db.query(sql, [cartId, variantId, quantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Clear entire cart
  static async clearCart(cartId) {
    const sql = `CALL ClearCart(?)`;

    try {
      await db.query(sql, [cartId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Validate cart before checkout
  static async validateCart(cartId) {
    const sql = `CALL ValidateCart(?)`;

    try {
      const [rows] = await db.query(sql, [cartId]);
      return rows[0]; // First result set contains validation results
    } catch (error) {
      throw error;
    }
  }

  // Merge guest cart to customer cart
  static async mergeGuestCart(guestCartId, customerCartId) {
    const sql = `CALL MergeGuestCart(?, ?)`;

    try {
      await db.query(sql, [guestCartId, customerCartId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get cart item count
  static async getCartItemCount(cartId) {
    const sql = `CALL GetCartItemCount(?, @item_count, @total_quantity)`;

    try {
      await db.query(sql, [cartId]);
      const [rows] = await db.query(
        "SELECT @item_count as item_count, @total_quantity as total_quantity"
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check if item exists in cart (using direct query since functions are complex with mysql2)
  static async isItemInCart(cartId, variantId) {
    const sql = `
      SELECT EXISTS(
        SELECT 1 
        FROM Cart_item 
        WHERE cart_id = ? AND variant_id = ?
      ) as exists_flag
    `;

    try {
      const [rows] = await db.query(sql, [cartId, variantId]);
      return rows[0].exists_flag === 1;
    } catch (error) {
      throw error;
    }
  }

  // Get cart by customer ID
  static async getCartByCustomerId(customerId) {
    const sql = `
      SELECT cart_id, customer_id, created_at, updated_at
      FROM Cart
      WHERE customer_id = ?
      LIMIT 1
    `;

    try {
      const [rows] = await db.query(sql, [customerId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Create a new cart
  static async createCart(customerId = null) {
    const sql = `
      INSERT INTO Cart (customer_id)
      VALUES (?)
    `;

    try {
      const [result] = await db.query(sql, [customerId]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartModel;
