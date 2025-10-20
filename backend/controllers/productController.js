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

// @desc    Upload product image
// @route   POST /api/products/upload-image
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file path that can be used as image_url
    const imageUrl = `/images/products/${req.file.filename}`;

    res.json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create new product with variants
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, brand, category_id, description, variants } = req.body;

    if (!name || !brand) {
      return res.status(400).json({ message: "Name and brand are required" });
    }

    // Create product (description is not stored in Product table, it goes to ProductVariant)
    const productData = {
      name,
      brand,
      category_id: category_id || null,
    };

    const productId = await ProductModel.createProduct(productData);

    // If variants are provided, create them
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        const variantData = {
          product_id: productId,
          sku: variant.sku,
          price: variant.price,
          size: variant.size || null,
          color: variant.color || null,
          description: variant.description || null,
          image_url: variant.image_url || null,
          is_default: variant.is_default || false,
        };

        await ProductModel.createVariant(variantData);
      }
    }

    res.status(201).json({
      message: "Product created successfully",
      productId: productId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update product variant image
// @route   PUT /api/products/variants/:variantId/image
const updateVariantImage = async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: "image_url is required" });
    }

    await ProductModel.updateVariantImage(variantId, image_url);

    res.json({ message: "Image updated successfully" });
  } catch (error) {
    console.error("Error updating variant image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getProductNames,
  uploadProductImage,
  createProduct,
  updateVariantImage,
};
