// models/variantModel.js
const db = require('../config/db');

class VariantModel {
  // Get variant by ID with inventory
  static async getVariantById(variantId) {
    const sql = `
      SELECT 
        pv.variant_id,
        pv.product_id,
        pv.sku,
        pv.price,
        pv.size,
        pv.color,
        pv.description,
        pv.is_default,
        i.quantity as stock_quantity,
        p.name as product_name,
        p.brand
      FROM ProductVariant pv
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      LEFT JOIN Product p ON pv.product_id = p.product_id
      WHERE pv.variant_id = ?
    `;
    
    try {
      const [rows] = await db.query(sql, [variantId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all variants with inventory status
  static async getAllVariantsWithInventory() {
    const sql = `
      SELECT 
        pv.variant_id,
        pv.product_id,
        pv.sku,
        pv.price,
        pv.size,
        pv.color,
        pv.description,
        pv.is_default,
        i.quantity as stock_quantity,
        p.name as product_name,
        p.brand,
        CASE 
          WHEN i.quantity > 10 THEN 'In Stock'
          WHEN i.quantity > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as stock_status
      FROM ProductVariant pv
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      LEFT JOIN Product p ON pv.product_id = p.product_id
      ORDER BY p.product_id, pv.is_default DESC, pv.price ASC
    `;
    
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get variants by product ID with inventory
  static async getVariantsByProductId(productId) {
    const sql = `
      SELECT 
        pv.variant_id,
        pv.product_id,
        pv.sku,
        pv.price,
        pv.size,
        pv.color,
        pv.description,
        pv.is_default,
        i.quantity as stock_quantity,
        CASE 
          WHEN i.quantity > 10 THEN 'In Stock'
          WHEN i.quantity > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as stock_status
      FROM ProductVariant pv
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      WHERE pv.product_id = ?
      ORDER BY pv.is_default DESC, pv.price ASC
    `;
    
    try {
      const [rows] = await db.query(sql, [productId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Check variant availability
  static async checkAvailability(variantId, requestedQuantity) {
    const sql = `
      SELECT 
        i.quantity as available_quantity,
        pv.price
      FROM Inventory i
      INNER JOIN ProductVariant pv ON i.variant_id = pv.variant_id
      WHERE i.variant_id = ?
    `;
    
    try {
      const [rows] = await db.query(sql, [variantId]);
      if (rows.length === 0) return null;
      
      const result = rows[0];
      return {
        available_quantity: result.available_quantity,
        price: result.price,
        is_available: result.available_quantity >= requestedQuantity
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VariantModel;
