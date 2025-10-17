// create-staff-account.js
// Script to create a staff account with properly hashed password
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function createStaffAccount() {
  console.log('=== Creating Staff Account ===\n');
  
  const staffData = {
    userName: 'admin_brightbuy',
    email: 'admin@brightbuy.com',
    password: '123456',
    phone: '1234567890',
    role: 'Level01'
  };

  try {
    // Check if user already exists
    console.log('Checking if user already exists...');
    const [existingUsers] = await db.query(
      'SELECT user_id FROM users WHERE email = ?',
      [staffData.email]
    );

    if (existingUsers.length > 0) {
      console.log('❌ User already exists with email:', staffData.email);
      console.log('Deleting existing user first...');
      
      // Get staff_id before deletion
      const [userData] = await db.query(
        'SELECT staff_id FROM users WHERE email = ?',
        [staffData.email]
      );
      
      if (userData[0].staff_id) {
        await db.query('DELETE FROM Staff WHERE staff_id = ?', [userData[0].staff_id]);
        console.log('✓ Existing staff and user records deleted');
      } else {
        await db.query('DELETE FROM users WHERE email = ?', [staffData.email]);
        console.log('✓ Existing user record deleted');
      }
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(staffData.password, salt);
    console.log('✓ Password hashed successfully');

    // Start transaction
    console.log('Starting database transaction...');
    await db.query('START TRANSACTION');

    try {
      // Insert into Staff table first
      console.log('Inserting into Staff table...');
      const [staffResult] = await db.query(
        'INSERT INTO Staff (user_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        [staffData.userName, staffData.email, passwordHash, staffData.phone, staffData.role]
      );

      const staffId = staffResult.insertId;
      console.log('✓ Staff created with ID:', staffId);

      // Insert into users table linking to staff
      console.log('Inserting into users table...');
      const [userResult] = await db.query(
        'INSERT INTO users (email, password_hash, role, customer_id, staff_id) VALUES (?, ?, ?, ?, ?)',
        [staffData.email, passwordHash, 'staff', null, staffId]
      );

      console.log('✓ User created with ID:', userResult.insertId);

      // Commit transaction
      await db.query('COMMIT');
      console.log('✓ Transaction committed successfully\n');

      // Verify the insertion
      console.log('=== Verification ===');
      const [verification] = await db.query(
        `SELECT 
          u.user_id,
          u.email,
          u.role AS user_role,
          u.is_active,
          s.staff_id,
          s.user_name,
          s.role AS staff_role
        FROM users u
        JOIN Staff s ON u.staff_id = s.staff_id
        WHERE u.email = ?`,
        [staffData.email]
      );

      if (verification.length > 0) {
        console.log('✅ Staff account created successfully!');
        console.log('\nAccount Details:');
        console.log('  User ID:', verification[0].user_id);
        console.log('  Email:', verification[0].email);
        console.log('  Username:', verification[0].user_name);
        console.log('  User Role:', verification[0].user_role);
        console.log('  Staff Role:', verification[0].staff_role);
        console.log('  Staff ID:', verification[0].staff_id);
        console.log('  Active:', verification[0].is_active ? 'Yes' : 'No');
        console.log('\nLogin Credentials:');
        console.log('  Email: admin@brightbuy.com');
        console.log('  Password: 123456');
      } else {
        console.log('❌ Verification failed - account not found');
      }

    } catch (err) {
      // Rollback on error
      console.log('❌ Error during transaction, rolling back...');
      await db.query('ROLLBACK');
      throw err;
    }

  } catch (error) {
    console.error('❌ Error creating staff account:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await db.end();
    console.log('\n=== Database connection closed ===');
  }
}

// Run the script
createStaffAccount();
