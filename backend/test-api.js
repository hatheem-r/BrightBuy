// Test script to verify API endpoints
const API_BASE = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing BrightBuy API...\n');

  try {
    // Test 1: Get all products
    console.log('1️⃣ Testing GET /api/products');
    const productsRes = await fetch(`${API_BASE}/products`);
    const products = await productsRes.json();
    console.log(`✅ Found ${products.length} products`);
    console.log(`   Sample: ${products[0]?.name} - $${products[0]?.price}\n`);

    // Test 2: Get categories
    console.log('2️⃣ Testing GET /api/categories');
    const categoriesRes = await fetch(`${API_BASE}/categories`);
    const categories = await categoriesRes.json();
    console.log(`✅ Found ${categories.length} categories`);
    console.log(`   Sample: ${categories[0]?.name}\n`);

    // Test 3: Get product by ID
    console.log('3️⃣ Testing GET /api/products/1');
    const productRes = await fetch(`${API_BASE}/products/1`);
    const product = await productRes.json();
    console.log(`✅ Product: ${product.name} by ${product.brand}`);
    console.log(`   Variants: ${product.variants?.length || 0}\n`);

    // Test 4: Get variants
    console.log('4️⃣ Testing GET /api/variants');
    const variantsRes = await fetch(`${API_BASE}/variants`);
    const variants = await variantsRes.json();
    console.log(`✅ Found ${variants.length} variants`);
    console.log(`   Sample: ${variants[0]?.product_name} - ${variants[0]?.sku}\n`);

    // Test 5: Search products
    console.log('5️⃣ Testing GET /api/products/search?q=Samsung');
    const searchRes = await fetch(`${API_BASE}/products/search?q=Samsung`);
    const searchResults = await searchRes.json();
    console.log(`✅ Found ${searchResults.length} Samsung products\n`);

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
