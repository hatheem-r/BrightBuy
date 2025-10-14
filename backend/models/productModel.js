// models/productModel.js
const db = require('../config/db');

class ProductModel {
  // Get all products with their default variants and categories
  static async getAllProducts() {
    const sql = `
      SELECT 
        p.product_id,
        p.name,
        p.brand,
        pv.variant_id,
        pv.price,
        pv.sku,
        pv.size,
        pv.color,
        pv.description,
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT c.category_id) as category_ids
      FROM Product p
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      LEFT JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN Category c ON pc.category_id = c.category_id
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description
      ORDER BY p.product_id DESC
    `;
    
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID with all variants
  static async getProductById(productId) {
    const sql = `
      SELECT 
        p.product_id,
        p.name,
        p.brand,
        p.created_at,
        p.updated_at
      FROM Product p
      WHERE p.product_id = ?
    `;
    
    try {
      const [rows] = await db.query(sql, [productId]);
      if (rows.length === 0) return null;
      
      const product = rows[0];
      
      // Get all variants for this product
      product.variants = await this.getVariantsByProductId(productId);
      
      // Get categories for this product
      product.categories = await this.getCategoriesByProductId(productId);
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Get all variants for a specific product
  static async getVariantsByProductId(productId) {
    const sql = `
      SELECT 
        variant_id,
        product_id,
        sku,
        price,
        size,
        color,
        description,
        is_default
      FROM ProductVariant
      WHERE product_id = ?
      ORDER BY is_default DESC, price ASC
    `;
    
    try {
      const [rows] = await db.query(sql, [productId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get categories for a specific product
  static async getCategoriesByProductId(productId) {
    const sql = `
      SELECT 
        c.category_id,
        c.name,
        c.parent_id
      FROM Category c
      INNER JOIN ProductCategory pc ON c.category_id = pc.category_id
      WHERE pc.product_id = ?
    `;
    
    try {
      const [rows] = await db.query(sql, [productId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId) {
    const sql = `
      SELECT 
        p.product_id,
        p.name,
        p.brand,
        pv.variant_id,
        pv.price,
        pv.sku,
        pv.size,
        pv.color,
        pv.description
      FROM Product p
      INNER JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      WHERE pc.category_id = ?
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description
      ORDER BY p.product_id DESC
    `;
    
    try {
      const [rows] = await db.query(sql, [categoryId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search products by name or brand
  static async searchProducts(searchTerm) {
    const sql = `
      SELECT 
        p.product_id,
        p.name,
        p.brand,
        pv.variant_id,
        pv.price,
        pv.sku,
        pv.size,
        pv.color,
        pv.description,
        GROUP_CONCAT(DISTINCT c.name) as categories
      FROM Product p
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      LEFT JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN Category c ON pc.category_id = c.category_id
      WHERE p.name LIKE ? OR p.brand LIKE ?
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description
      ORDER BY p.product_id DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    
    try {
      const [rows] = await db.query(sql, [searchPattern, searchPattern]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductModel;
