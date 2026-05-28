/**
 * Make User Admin Script
 * Run this to make a user an admin
 */

const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function makeAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`✅ User ${email} is now an admin!`);
    console.log('User details:', {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node src/scripts/make-admin.js <email>');
  console.log('Example: node src/scripts/make-admin.js admin@buyresearchchems.com');
  process.exit(1);
}

makeAdmin(email);
