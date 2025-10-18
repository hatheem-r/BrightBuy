// models/cartModel.js
const db = require("../config/db");

class CartModel {
  // Get cart details with all items for a customer
  static async getCartDetails(customerId) {
    try {
      const sql = `CALL GetCustomerCart(?)`;
      const [rows] = await db.query(sql, [customerId]);
      return rows[0]; // First result set contains the items
    } catch (error) {
      throw error;
    }
  }

  // Get cart summary for a customer
  static async getCartSummary(customerId) {
    try {
      const sql = `CALL GetCustomerCartSummary(?)`;
      const [rows] = await db.query(sql, [customerId]);
      return rows[0][0]; // First row of first result set
    } catch (error) {
      throw error;
    }
  }

  // Add item to customer's cart
  static async addToCart(customerId, variantId, quantity) {
    try {
      const sql = `CALL AddToCart(?, ?, ?)`;
      await db.query(sql, [customerId, variantId, quantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item quantity for a customer
  static async updateCartItemQuantity(customerId, variantId, newQuantity) {
    try {
      const sql = `CALL UpdateCartItemQuantity(?, ?, ?)`;
      await db.query(sql, [customerId, variantId, newQuantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove item from customer's cart
  static async removeCartItem(customerId, variantId) {
    try {
      const sql = `CALL RemoveFromCart(?, ?)`;
      await db.query(sql, [customerId, variantId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Clear entire cart for a customer
  static async clearCart(customerId) {
    try {
      const sql = `CALL ClearCustomerCart(?)`;
      await db.query(sql, [customerId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get cart item count for a customer
  static async getCartItemCount(customerId) {
    try {
      const sql = `CALL GetCustomerCartCount(?)`;
      const [rows] = await db.query(sql, [customerId]);
      return rows[0][0]; // First row of first result set
    } catch (error) {
      throw error;
    }
  }

  // Check if item exists in customer's cart
  static async isItemInCart(customerId, variantId) {
    const sql = `
      SELECT EXISTS(
        SELECT 1 
        FROM Cart_item 
        WHERE customer_id = ? AND variant_id = ?
      ) as exists_flag
    `;

    try {
      const [rows] = await db.query(sql, [customerId, variantId]);
      return rows[0].exists_flag === 1;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartModel;
