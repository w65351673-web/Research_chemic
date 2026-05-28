// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define User schema (simplified version of your actual User model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
}, {
  timestamps: true,
});

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@darkchemsite.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@darkchemsite.com',
      password: hashedPassword,
      role: 'admin',
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@darkchemsite.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdminUser();
