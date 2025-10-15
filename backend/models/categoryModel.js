// models/categoryModel.js
const db = require('../config/db');

class CategoryModel {
  // Get all categories
  static async getAllCategories() {
    const sql = `
      SELECT 
        category_id,
        name,
        parent_id
      FROM Category
      ORDER BY parent_id, name
    `;
    
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get category by ID
  static async getCategoryById(categoryId) {
    const sql = `
      SELECT 
        category_id,
        name,
        parent_id
      FROM Category
      WHERE category_id = ?
    `;
    
    try {
      const [rows] = await db.query(sql, [categoryId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get main categories (parent_id is NULL)
  static async getMainCategories() {
    const sql = `
      SELECT 
        category_id,
        name,
        parent_id
      FROM Category
      WHERE parent_id IS NULL
      ORDER BY name
    `;
    
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get subcategories of a parent category
  static async getSubcategories(parentId) {
    const sql = `
      SELECT 
        category_id,
        name,
        parent_id
      FROM Category
      WHERE parent_id = ?
      ORDER BY name
    `;
    
    try {
      const [rows] = await db.query(sql, [parentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get category hierarchy (with product counts)
  static async getCategoryHierarchy() {
    const sql = `
      SELECT 
        c.category_id,
        c.name,
        c.parent_id,
        COUNT(DISTINCT pc.product_id) as product_count
      FROM Category c
      LEFT JOIN ProductCategory pc ON c.category_id = pc.category_id
      GROUP BY c.category_id, c.name, c.parent_id
      ORDER BY c.parent_id, c.name
    `;
    
    try {
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryModel;
