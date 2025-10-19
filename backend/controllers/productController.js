// backend/controllers/productController.js
const pool = require('../config/db');

exports.addProduct = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Safely Parse JSON data from the FormData payload
        const name = req.body.name;
        const description = req.body.description;
        const sku = req.body.sku;
        
        // ⭐ FIX: Use safe JSON parsing with fallback to empty arrays/objects.
        // This prevents the "Cannot read properties of undefined" error.
        const categories = JSON.parse(req.body.categories || '[]'); 
        const variants = JSON.parse(req.body.variants || '[]'); 
        
        const uploadedFiles = req.files || {}; 

        // 2. Validation
        if (!name || !sku || !variants || variants.length === 0) {
             await connection.rollback(); 
             return res.status(400).json({ message: 'Missing core fields (Name, SKU) or variants.' });
        }

        // 3. Insert into products table
        const [productResult] = await connection.execute(
            `INSERT INTO products (name, description, sku) VALUES (?, ?, ?)`,
            [name, description, sku]
        );
        const productId = productResult.insertId;

        // 4. Process Categories (Find/Insert and Link)
         if (categories.length > 0) {
            for (const categoryName of categories) {
                
                // Trim whitespace and skip empty category names
                const trimmedCategory = categoryName.trim();
                if (trimmedCategory.length === 0) continue;

                // Find or Insert Category
                let [categoryResult] = await connection.execute(
                    `SELECT id FROM categories WHERE name = ?`,
                    [trimmedCategory]
                );
                
                let categoryId;
                if (categoryResult.length === 0) {
                    const [insertCatResult] = await connection.execute(
                        `INSERT INTO categories (name) VALUES (?)`,
                        [trimmedCategory]
                    );
                    categoryId = insertCatResult.insertId;
                } else {
                    categoryId = categoryResult[0].id;
                }

                // Link Product and Category
                await connection.execute(
                    `INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)`,
                    [productId, categoryId]
                );
            }
        }

        // 5. Insert Variants and Cloudinary URL
        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            
            // Basic validation for essential variant fields
            if (!variant.name || !variant.price || variant.stock === undefined) continue; 

            // Find the corresponding uploaded file using the dynamic name
            const fieldName = `variant_image_${i}`;
            const fileArray = uploadedFiles[fieldName]; 

            let imageUrl = null;
            if (fileArray && fileArray.length > 0) {
                // Get the secure_url provided by Cloudinary
                imageUrl = fileArray[0].path; 
            }

            await connection.execute(
                `INSERT INTO product_variants (product_id, variant_name, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)`,
                [productId, variant.name, variant.price, variant.stock, imageUrl]
            );
        }

        // 6. Commit and Respond
        await connection.commit();

        return res.status(201).json({
            message: 'Product, variants, and images created successfully!',
            productId: productId
        });

    } catch (error) {
        await connection.rollback();
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Product creation failed: SKU already exists.' });
        }

        console.error('Database Error in addProduct:', error);
        return res.status(500).json({ message: 'Internal Server Error during product creation.' });
    } finally {
        connection.release();
// controllers/productController.js
const ProductModel = require("../models/productModel");

// @desc    Fetch all products with default variants
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch single product by ID with all variants
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch products by category
// @route   GET /api/products/category/:categoryId
const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await ProductModel.getProductsByCategory(categoryId);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search?q=searchTerm
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const products = await ProductModel.searchProducts(searchTerm);
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all product names for autocomplete
// @route   GET /api/products/names
const getProductNames = async (req, res) => {
  try {
    const productNames = await ProductModel.getProductNames();
    res.json(productNames);
  } catch (error) {
    console.error("Error fetching product names:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// backend/controllers/productController.js (Add this function to the file)
// ... (keep the existing addProduct function above this)

// Controller function to handle fetching all products
// backend/controllers/productController.js (Updated getProducts)

exports.getProducts = async (req, res) => {
    try {
        // Updated SQL to include first variant image and total stock sum
        const [products] = await pool.execute(`
            SELECT
                p.id,
                p.name,
                p.sku,
                p.created_at,
                GROUP_CONCAT(DISTINCT c.name) AS categories,
                MIN(pv.price) AS min_price,
                -- Aggregate the total stock quantity across all variants for this product
                SUM(pv.stock_quantity) AS total_stock,
                -- Get the image URL of the first variant found (using a subquery or conditional aggregate)
                (
                    SELECT image_url 
                    FROM product_variants 
                    WHERE product_id = p.id 
                    ORDER BY id ASC 
                    LIMIT 1
                ) AS image_url
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            GROUP BY p.id, p.name, p.sku, p.created_at
            ORDER BY p.created_at DESC
        `); // Note: Ensure this query is all on one line or properly escaped in your .js file if needed

        return res.status(200).json({
            message: 'Product list retrieved successfully',
            products: products
        });

    } catch (error) {
        console.error('Database Error in getProducts:', error);
        return res.status(500).json({ message: 'Internal Server Error while fetching products.' });
    }
};

// backend/controllers/productController.js (Add this function)
// ... existing functions (addProduct, getProducts) ...

exports.getProductById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        // 1. Fetch Main Product Details
        const [productRows] = await pool.execute(
            `SELECT id, name, description, sku FROM products WHERE id = ?`,
            [id]
        );

        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        
        const product = productRows[0];

        // 2. Fetch all Variants for this product
        const [variantRows] = await pool.execute(
            `SELECT id, variant_name AS name, price, stock_quantity AS stock, image_url FROM product_variants WHERE product_id = ? ORDER BY id ASC`,
            [id]
        );
        product.variants = variantRows;

        // 3. Fetch all Categories for this product
        const [categoryRows] = await pool.execute(
            `SELECT c.name FROM categories c 
             JOIN product_categories pc ON c.id = pc.category_id 
             WHERE pc.product_id = ?`,
            [id]
        );
        // Format categories back into a comma-separated string for easy form population
        product.categories = categoryRows.map(row => row.name).join(', ');

        return res.status(200).json({ 
            message: 'Product details retrieved successfully',
            product: product 
        });

    } catch (error) {
        console.error('Database Error in getProductById:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

// backend/controllers/productController.js (Add this function)
// ... existing functions (addProduct, getProducts, getProductById) ...
const { cloudinary } = require('../config/cloudinaryConfig'); // Need Cloudinary SDK for deletion

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Parse Data
        const name = req.body.name;
        const description = req.body.description;
        const sku = req.body.sku;
        const categories = JSON.parse(req.body.categories || '[]'); 
        const variants = JSON.parse(req.body.variants || '[]'); 
        const uploadedFiles = req.files || {}; 

        // 2. Update Core Product Table
        await connection.execute(
            `UPDATE products SET name = ?, description = ?, sku = ? WHERE id = ?`,
            [name, description, sku, id]
        );

        // 3. Update Categories (Hard reset method for simplicity)
        // a. Delete all existing category links for this product
        await connection.execute(`DELETE FROM product_categories WHERE product_id = ?`, [id]);
        
        // b. Insert new/updated categories (Same logic as in addProduct)
        if (categories.length > 0) {
            // ... (Category find/insert and linking logic goes here) ...
            for (const categoryName of categories) {
                const trimmedCategory = String(categoryName).trim();
                if (trimmedCategory.length === 0) continue;

                let [categoryResult] = await connection.execute(
                    `SELECT id FROM categories WHERE name = ?`,
                    [trimmedCategory]
                );
                
                let categoryId;
                if (categoryResult.length === 0) {
                    const [insertCatResult] = await connection.execute(
                        `INSERT INTO categories (name) VALUES (?)`,
                        [trimmedCategory]
                    );
                    categoryId = insertCatResult.insertId;
                } else {
                    categoryId = categoryResult[0].id;
                }
                
                await connection.execute(
                    `INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)`,
                    [id, categoryId]
                );
            }
        }


        // 4. Update Variants
        // CRITICAL: Get IDs of all currently existing variants
        const [existingVariantIds] = await connection.execute(
            `SELECT id FROM product_variants WHERE product_id = ?`, [id]
        );
        const existingIdsSet = new Set(existingVariantIds.map(v => v.id));


        for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            if (!variant.name || !variant.price || variant.stock === undefined) continue;
            
            const priceValue = parseFloat(variant.price);
            const stockValue = parseInt(variant.stock, 10);
            const variantId = variant.id;

            // Determine image URL
            const fieldName = `variant_image_${i}`;
            const fileArray = uploadedFiles[fieldName]; 
            let imageUrl = null;
            let imageUpdated = false;

            if (fileArray && fileArray.length > 0) {
                // New image uploaded, set the new Cloudinary URL
                imageUrl = fileArray[0].path; 
                imageUpdated = true;
                
                // Optional: Delete old image from Cloudinary if one exists (requires fetching old image URL)
            }


            if (variantId && existingIdsSet.has(variantId)) {
                // a) EXISTING VARIANT: Perform UPDATE
                await connection.execute(
                    `UPDATE product_variants SET 
                        variant_name = ?, price = ?, stock_quantity = ?
                        ${imageUpdated ? ', image_url = ?' : ''}
                     WHERE id = ?`,
                    imageUpdated 
                        ? [variant.name, priceValue, stockValue, imageUrl, variantId]
                        : [variant.name, priceValue, stockValue, variantId]
                );
                // Remove ID from set so we know it was handled
                existingIdsSet.delete(variantId);

            } else {
                // b) NEW VARIANT: Perform INSERT
                await connection.execute(
                    `INSERT INTO product_variants (product_id, variant_name, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)`,
                    [id, variant.name, priceValue, stockValue, imageUrl]
                );
            }
        }
        
        // c) DELETED VARIANTS: Delete any IDs left in the existingIdsSet (they were not in the PUT request)
        if (existingIdsSet.size > 0) {
            const idsToDelete = [...existingIdsSet];
            await connection.execute(
                `DELETE FROM product_variants WHERE id IN (${idsToDelete.map(() => '?').join(',')})`,
                idsToDelete
            );
            // Optional: Add logic here to delete associated images from Cloudinary
        }
        

        // 5. Commit and Respond
        await connection.commit();
        return res.status(200).json({ message: 'Product updated successfully!', productId: id });

    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Product update failed: SKU already exists.' });
        }
        console.error('Database Error in updateProduct:', error);
        return res.status(500).json({ message: 'Internal Server Error during product update.' });
    } finally {
        connection.release();
    }
};
module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductNames,
};
