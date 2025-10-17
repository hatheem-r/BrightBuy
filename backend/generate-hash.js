// generate-hash.js
// Simple script to generate a bcrypt hash for a password
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '123456';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\n=== Password Hash Generator ===');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your SQL INSERT statement.');
  console.log('================================\n');
}

generateHash();
