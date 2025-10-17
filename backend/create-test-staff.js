// create-test-staff.js
// Creates multiple Level01 and Level02 staff members for testing
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const testStaff = [
  // Level01 Staff (Can add both Level01 and Level02)
  {
    userName: 'admin_brightbuy',
    email: 'admin@brightbuy.com',
    password: '123456',
    phone: '1234567890',
    role: 'Level01'
  },
  {
    userName: 'manager_john',
    email: 'john@brightbuy.com',
    password: '123456',
    phone: '1234567891',
    role: 'Level01'
  },
  {
    userName: 'manager_sarah',
    email: 'sarah@brightbuy.com',
    password: '123456',
    phone: '1234567892',
    role: 'Level01'
  },
  
  // Level02 Staff (Normal staff - cannot add staff)
  {
    userName: 'staff_mike',
    email: 'mike@brightbuy.com',
    password: '123456',
    phone: '1234567893',
    role: 'Level02'
  },
  {
    userName: 'staff_emily',
    email: 'emily@brightbuy.com',
    password: '123456',
    phone: '1234567894',
    role: 'Level02'
  },
  {
    userName: 'staff_david',
    email: 'david@brightbuy.com',
    password: '123456',
    phone: '1234567895',
    role: 'Level02'
  }
];

async function createTestStaff() {
  console.log('\n=== Creating Test Staff Members ===\n');
  
  try {
    console.log('1. Connecting to database...');
    await db.query('SELECT 1');
    console.log('✓ Connected to database\n');
    
    // Generate password hash once (same for all test accounts)
    const passwordHash = await bcrypt.hash('123456', 10);
    console.log('✓ Password hash generated\n');
    
    // Clear existing test staff
    console.log('2. Cleaning up existing test staff...');
    await db.query('DELETE FROM Staff WHERE email IN (?, ?, ?, ?, ?, ?)', [
      'admin@brightbuy.com',
      'john@brightbuy.com',
      'sarah@brightbuy.com',
      'mike@brightbuy.com',
      'emily@brightbuy.com',
      'david@brightbuy.com'
    ]);
    console.log('✓ Cleanup complete\n');
    
    console.log('3. Creating staff members...\n');
    
    const createdStaff = [];
    
    for (const staff of testStaff) {
      try {
        // Insert into Staff table
        const [staffResult] = await db.query(
          'INSERT INTO Staff (user_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
          [staff.userName, staff.email, passwordHash, staff.phone, staff.role]
        );
        const staffId = staffResult.insertId;
        
        // Insert into users table
        const [userResult] = await db.query(
          'INSERT INTO users (email, password_hash, role, is_active, staff_id) VALUES (?, ?, ?, ?, ?)',
          [staff.email, passwordHash, 'staff', 1, staffId]
        );
        const userId = userResult.insertId;
        
        createdStaff.push({
          ...staff,
          userId,
          staffId
        });
        
        console.log(`✓ Created ${staff.role} staff: ${staff.userName} (${staff.email})`);
      } catch (error) {
        console.error(`✗ Failed to create ${staff.userName}:`, error.message);
      }
    }
    
    console.log('\n4. Verifying created accounts...\n');
    
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
      WHERE u.role = 'staff'
      ORDER BY s.role, s.user_name`
    );
    
    console.log('✅ SUCCESS! All staff accounts created!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    STAFF ACCOUNTS CREATED');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('📊 LEVEL01 STAFF (Can add Level01 & Level02 staff):');
    console.log('───────────────────────────────────────────────────────────');
    verification.filter(s => s.staff_level === 'Level01').forEach(staff => {
      console.log(`  • ${staff.user_name.padEnd(20)} | ${staff.email.padEnd(25)} | ID: ${staff.user_id}`);
    });
    
    console.log('\n📊 LEVEL02 STAFF (Normal staff - no staff creation):');
    console.log('───────────────────────────────────────────────────────────');
    verification.filter(s => s.staff_level === 'Level02').forEach(staff => {
      console.log(`  • ${staff.user_name.padEnd(20)} | ${staff.email.padEnd(25)} | ID: ${staff.user_id}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📝 ALL ACCOUNTS USE PASSWORD: 123456');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    console.log('🚀 You can now login at: http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.end();
    console.log('Database connection closed.');
  }
}

createTestStaff();
