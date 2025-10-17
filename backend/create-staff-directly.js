// create-staff-directly.js
// This script creates the staff account directly using Node.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function createStaffAccount() {
  console.log('\n=== Creating Staff Account Directly ===\n');
  
  try {
    console.log('1. Connecting to database...');
    await db.query('SELECT 1');
    console.log('✓ Connected to database\n');
    
    // Delete existing staff if exists
    console.log('2. Cleaning up any existing staff account...');
    await db.query('DELETE FROM Staff WHERE email = ?', ['admin@brightbuy.com']);
    console.log('✓ Cleanup complete\n');
    
    // Hash the password
    console.log('3. Hashing password...');
    const password = '123456';
    const passwordHash = '$2b$10$45/QFPHQShGN9eNfqfkeUeTAwjaPoivJjVRuaOtDc9Hb2aiDvQVvu';
    console.log('✓ Password hash ready\n');
    
    // Insert into Staff table
    console.log('4. Creating staff member...');
    const [staffResult] = await db.query(
      'INSERT INTO Staff (user_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
      ['admin_brightbuy', 'admin@brightbuy.com', passwordHash, '1234567890', 'Level01']
    );
    const staffId = staffResult.insertId;
    console.log('✓ Staff created with ID:', staffId, '\n');
    
    // Insert into users table
    console.log('5. Creating user account...');
    const [userResult] = await db.query(
      'INSERT INTO users (email, password_hash, role, is_active, staff_id) VALUES (?, ?, ?, ?, ?)',
      ['admin@brightbuy.com', passwordHash, 'staff', 1, staffId]
    );
    const userId = userResult.insertId;
    console.log('✓ User created with ID:', userId, '\n');
    
    // Verify
    console.log('6. Verifying account...');
    const [verification] = await db.query(
      `SELECT 
        u.user_id,
        u.email,
        u.role AS user_role,
        u.is_active,
        s.staff_id,
        s.user_name,
        s.role AS staff_level
      FROM users u
      JOIN Staff s ON u.staff_id = s.staff_id
      WHERE u.email = ?`,
      ['admin@brightbuy.com']
    );
    
    if (verification.length > 0) {
      console.log('✅ SUCCESS! Staff account created!\n');
      console.log('Account Details:');
      console.log('  User ID:', verification[0].user_id);
      console.log('  Staff ID:', verification[0].staff_id);
      console.log('  Email:', verification[0].email);
      console.log('  Username:', verification[0].user_name);
      console.log('  User Role:', verification[0].user_role);
      console.log('  Staff Level:', verification[0].staff_level);
      console.log('  Active:', verification[0].is_active ? 'Yes' : 'No');
      console.log('\n📝 Login Credentials:');
      console.log('  Email: admin@brightbuy.com');
      console.log('  Password: 123456');
      console.log('\n🚀 You can now login at: http://localhost:3000/login\n');
    } else {
      console.log('❌ Verification failed!\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\nThe account already exists. Running cleanup and retry...\n');
    } else {
      console.error('Full error:', error);
    }
  } finally {
    await db.end();
    console.log('Database connection closed.');
  }
}

createStaffAccount();
