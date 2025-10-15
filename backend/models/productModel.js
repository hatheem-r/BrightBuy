// models/productModel.js
const db = require("../config/db");

class ProductModel {
  // Get all products with their default variants, inventory, and categories
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
        pv.image_url,
        
        COALESCE(i.quantity, 0) as stock_quantity,
        CASE 
          WHEN i.quantity > 10 THEN 'In Stock'
          WHEN i.quantity > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as stock_status,
        GROUP_CONCAT(DISTINCT c.name) as categories,
        GROUP_CONCAT(DISTINCT c.category_id) as category_ids
      FROM Product p
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      LEFT JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN Category c ON pc.category_id = c.category_id
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description, i.quantity, pv.image_url
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

  // Get all variants for a specific product with inventory
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
        pv.image_url,
        COALESCE(i.quantity, 0) as stock_quantity,
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

  // Get products by category with inventory
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
        pv.description,
        pv.image_url,
        COALESCE(i.quantity, 0) as stock_quantity,
        CASE 
          WHEN i.quantity > 10 THEN 'In Stock'
          WHEN i.quantity > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as stock_status
      FROM Product p
      INNER JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      WHERE pc.category_id = ?
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description, i.quantity, pv.image_url
      ORDER BY p.product_id DESC
    `;

    try {
      const [rows] = await db.query(sql, [categoryId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search products by name or brand with inventory
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
        pv.image_url,
        COALESCE(i.quantity, 0) as stock_quantity,
        CASE 
          WHEN i.quantity > 10 THEN 'In Stock'
          WHEN i.quantity > 0 THEN 'Low Stock'
          ELSE 'Out of Stock'
        END as stock_status,
        GROUP_CONCAT(DISTINCT c.name) as categories
      FROM Product p
      LEFT JOIN ProductVariant pv ON p.product_id = pv.product_id AND pv.is_default = 1
      LEFT JOIN Inventory i ON pv.variant_id = i.variant_id
      LEFT JOIN ProductCategory pc ON p.product_id = pc.product_id
      LEFT JOIN Category c ON pc.category_id = c.category_id
      WHERE p.name LIKE ? OR p.brand LIKE ?
      GROUP BY p.product_id, p.name, p.brand, pv.variant_id, pv.price, pv.sku, pv.size, pv.color, pv.description, i.quantity, pv.image_url
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

  // Get all product names for autocomplete
  static async getProductNames() {
    const sql = `
      SELECT DISTINCT
        p.product_id,
        p.name,
        p.brand
      FROM Product p
      ORDER BY p.name ASC
    `;

    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductModel;
