// Check if database has image URLs
require('dotenv').config();
const db = require('./config/db');

async function checkDatabase() {
  try {
    console.log('📊 Checking ProductVariant table for image URLs...\n');
    
    const [results] = await db.query('SELECT COUNT(*) as count FROM ProductVariant WHERE image_url IS NOT NULL');
    const count = results[0].count;
    
    console.log(`Variants with images: ${count}\n`);
    
    if (count === 0) {
      console.log('❌ No variants have image URLs yet!');
      console.log('\n🔧 You need to run the SQL script:');
      console.log('   1. Open MySQL Workbench');
      console.log('   2. Connect to "brightbuy" database');
      console.log('   3. Open file: d:\\BrightBuy\\BrightBuy\\assets\\update_image_urls.sql');
      console.log('   4. Execute the script\n');
    } else {
      console.log(`✅ ${count} variants have image URLs!`);
      
      // Show some examples
      const [examples] = await db.query(`
        SELECT pv.variant_id, p.name, pv.color, pv.image_url
        FROM ProductVariant pv
        JOIN Product p ON pv.product_id = p.product_id
        WHERE pv.image_url IS NOT NULL
        LIMIT 5
      `);
      
      console.log('\n📸 Sample variants with images:');
      examples.forEach(v => {
        console.log(`   ${v.name} (${v.color})`);
        console.log(`   → ${v.image_url}\n`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
