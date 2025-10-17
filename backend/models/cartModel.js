// models/cartModel.js
const db = require("../config/db");

class CartModel {
  // Helper method to get or create cart for customer
  static async getOrCreateCartId(customerId) {
    const [carts] = await db.query(
      `SELECT cart_id FROM Cart WHERE customer_id = ?`,
      [customerId]
    );

    if (carts.length === 0) {
      // Create a new cart for this customer
      const [result] = await db.query(
        `INSERT INTO Cart (customer_id) VALUES (?)`,
        [customerId]
      );
      return result.insertId;
    }

    return carts[0].cart_id;
  }

  // Get cart details with all items for a customer
  static async getCartDetails(customerId) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL GetCartDetails(?)`;
      const [rows] = await db.query(sql, [cartId]);
      return rows[0]; // First result set contains the items
    } catch (error) {
      throw error;
    }
  }

  // Get cart summary for a customer
  static async getCartSummary(customerId) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL GetCartSummary(?)`;
      const [rows] = await db.query(sql, [cartId]);
      return rows[0][0]; // First row of first result set
    } catch (error) {
      throw error;
    }
  }

  // Add item to customer's cart
  static async addToCart(customerId, variantId, quantity) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL AddToCart(?, ?, ?)`;
      await db.query(sql, [cartId, variantId, quantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item quantity for a customer
  static async updateCartItemQuantity(customerId, variantId, newQuantity) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL UpdateCartItemQuantity(?, ?, ?)`;
      await db.query(sql, [cartId, variantId, newQuantity]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Remove item from customer's cart
  static async removeCartItem(customerId, variantId) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL RemoveCartItem(?, ?)`;
      await db.query(sql, [cartId, variantId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Clear entire cart for a customer
  static async clearCart(customerId) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL ClearCart(?)`;
      await db.query(sql, [cartId]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get cart item count for a customer
  static async getCartItemCount(customerId) {
    try {
      const cartId = await this.getOrCreateCartId(customerId);
      const sql = `CALL GetCartItemCount(?)`;
      const [rows] = await db.query(sql, [cartId]);
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
