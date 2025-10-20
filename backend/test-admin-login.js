// Test login for admin_jvishula account
const axios = require('axios');

async function testLogin() {
  console.log('\n=== Testing Admin Login ===');
  console.log('Email: admin_jvishula@brightbuy.com');
  console.log('Password: 123456');
  console.log('Endpoint: POST http://localhost:5000/api/auth/login');
  console.log('');

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin_jvishula@brightbuy.com',
      password: '123456'
    });

    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('');
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('Token:', response.data.token ? '✓ Generated' : '✗ Missing');
    console.log('User Info:', response.data.user);
    console.log('');
    console.log('=========================\n');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ ERROR: Cannot connect to server');
      console.log('Make sure the backend server is running:');
      console.log('  cd backend');
      console.log('  npm start');
      console.log('');
    } else if (error.response) {
      console.log('❌ LOGIN FAILED');
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      console.log('');
    } else {
      console.log('❌ ERROR:', error.message);
    }
    console.log('=========================\n');
  }
}

testLogin();
