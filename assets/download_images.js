/**
 * Image Download Helper
 * 
 * This script helps download product images from Unsplash
 * Usage: node download_images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Image sources from Unsplash
const imageList = [
  // Smartphones
  { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', path: 'smartphones/iphone-15-pro-black.jpg' },
  { url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', path: 'smartphones/samsung-galaxy-s24-black.jpg' },
  { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', path: 'smartphones/google-pixel-8-black.jpg' },
  
  // Laptops
  { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', path: 'laptops/macbook-pro-14-silver.jpg' },
  { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', path: 'laptops/dell-xps-15-silver.jpg' },
  
  // Tablets
  { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', path: 'tablets/ipad-pro-11-silver.jpg' },
  { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800', path: 'tablets/samsung-tab-s9-black.jpg' },
  
  // Accessories
  { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', path: 'accessories/headphones-black.jpg' },
  { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', path: 'accessories/smartwatch-black.jpg' },
  { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', path: 'accessories/wireless-earbuds-white.jpg' },
];

// Additional images you can add later
const additionalImages = [
  // More smartphones
  { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800', path: 'smartphones/iphone-blue.jpg' },
  { url: 'https://images.unsplash.com/photo-1603891219583-bee4f8f245d7?w=800', path: 'smartphones/smartphone-white.jpg' },
  
  // More laptops
  { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', path: 'laptops/laptop-open.jpg' },
  { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', path: 'laptops/lenovo-thinkpad.jpg' },
  
  // More accessories
  { url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800', path: 'accessories/keyboard-mouse.jpg' },
  { url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', path: 'accessories/phone-case.jpg' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, 'products', filepath);
    const file = fs.createWriteStream(fullPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('🚀 Starting image downloads...\n');
  
  let success = 0;
  let failed = 0;
  
  for (const image of imageList) {
    try {
      await downloadImage(image.url, image.path);
      success++;
    } catch (error) {
      console.error(`❌ Failed: ${image.path} - ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n✨ Download complete!`);
  console.log(`Success: ${success}, Failed: ${failed}`);
  console.log(`\n📁 Images saved to: ${path.join(__dirname, 'products')}`);
}

// Run if executed directly
if (require.main === module) {
  downloadAll().catch(console.error);
}

module.exports = { downloadImage, downloadAll };
