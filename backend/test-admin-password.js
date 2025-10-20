// Test password verification for admin_jvishula
const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = '123456';
  const storedHash = '$2b$10$FVKavkRNr22xFXs0wlrz1eGlUE.Vp1uQOydSoT/cotUwD8sKY1Jx.';
  
  console.log('\n=== Testing Password Verification ===');
  console.log('Email: admin_jvishula@brightbuy.com');
  console.log('Plain Password:', plainPassword);
  console.log('Stored Hash:', storedHash);
  console.log('\nVerifying...');
  
  try {
    const isMatch = await bcrypt.compare(plainPassword, storedHash);
    console.log('\n✓ Password Match Result:', isMatch);
    
    if (isMatch) {
      console.log('✓ SUCCESS: Password is correct!');
      console.log('✓ Account should work for login');
    } else {
      console.log('✗ FAILED: Password does not match hash!');
      console.log('✗ Need to regenerate hash');
    }
  } catch (error) {
    console.log('✗ ERROR:', error.message);
  }
  
  console.log('=====================================\n');
}

testPassword();
