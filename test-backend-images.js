// Test if backend is serving images correctly
const http = require('http');

const testImages = [
  '/assets/products/smartphones/iphone-15-pro-black.jpg',
  '/assets/products/smartphones/samsung-galaxy-s24-black.jpg',
  '/assets/products/laptops/macbook-pro-14-silver.jpg',
  '/assets/products/tablets/ipad-pro-11-silver.jpg',
  '/assets/products/accessories/headphones-black.jpg'
];

console.log('🧪 Testing BrightBuy Backend Image Serving...\n');

function testImage(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: path,
      method: 'HEAD'
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${path}`);
        console.log(`   Status: ${res.statusCode}, Type: ${res.headers['content-type']}, Size: ${res.headers['content-length']} bytes\n`);
        resolve(true);
      } else {
        console.log(`❌ ${path}`);
        console.log(`   Status: ${res.statusCode}\n`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log(`❌ ${path}`);
      console.log(`   Error: ${error.message}\n`);
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const imagePath of testImages) {
    const result = await testImage(imagePath);
    if (result) passed++;
    else failed++;
  }

  console.log('━'.repeat(60));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
  
  if (passed === testImages.length) {
    console.log('✨ All images are being served correctly!');
    console.log('\n🎯 Next steps:');
    console.log('   1. Run the SQL script: update_image_urls.sql');
    console.log('   2. Start frontend: cd frontend && npm run dev');
    console.log('   3. Visit: http://localhost:3000/products');
  } else {
    console.log('⚠️  Some images failed to load. Check backend configuration.');
  }
}

runTests();
