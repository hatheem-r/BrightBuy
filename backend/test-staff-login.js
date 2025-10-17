// test-staff-login.js
// Quick test script for staff login
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function testStaffLogin() {
  console.log('\n=== Testing Staff Login ===\n');
  
  const email = 'admin@brightbuy.com';
  const password = '123456';
  
  try {
    console.log('1. Checking database connection...');
    await db.query('SELECT 1');
    console.log('✓ Database connected\n');
    
    console.log('2. Looking for staff user...');
    const [users] = await db.query(
      `SELECT 
        u.user_id, 
        u.email, 
        u.password_hash, 
        u.role, 
        u.is_active, 
        u.customer_id,
        u.staff_id,
        COALESCE(CONCAT(c.first_name, ' ', c.last_name), s.user_name) as name
       FROM users u
       LEFT JOIN Customer c ON u.customer_id = c.customer_id
       LEFT JOIN Staff s ON u.staff_id = s.staff_id
       WHERE u.email = ?`,
      [email]
    );
    
    if (users.length === 0) {
      console.log('❌ User not found in database!');
      console.log('\nPlease run the SQL script to create the staff account:');
      console.log('Execute: queries/create_staff_account.sql\n');
      process.exit(1);
    }
    
    const user = users[0];
    console.log('✓ User found:');
    console.log('  - Email:', user.email);
    console.log('  - Name:', user.name);
    console.log('  - Role:', user.role);
    console.log('  - Staff ID:', user.staff_id);
    console.log('  - Active:', user.is_active ? 'Yes' : 'No');
    console.log('  - Password Hash:', user.password_hash.substring(0, 20) + '...');
    
    if (!user.is_active) {
      console.log('\n❌ Account is inactive!\n');
      process.exit(1);
    }
    
    console.log('\n3. Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (isPasswordValid) {
      console.log('✓ Password is correct!\n');
      console.log('✅ Staff login should work!\n');
      console.log('Login credentials:');
      console.log('  Email: admin@brightbuy.com');
      console.log('  Password: 123456');
      console.log('\nYou can now login at: http://localhost:3000/login\n');
    } else {
      console.log('❌ Password verification failed!');
      console.log('\nThe password in the database does not match "123456"');
      console.log('You may need to update the password hash in the database.\n');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await db.end();
    console.log('Database connection closed.');
  }
}

testStaffLogin();
