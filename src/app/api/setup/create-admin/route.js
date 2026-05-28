import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';

// This is a one-time setup route to create an admin user
// In production, you would want to secure this route or remove it after use
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@buyresearchchems.com' });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Admin user already exists',
        email: existingAdmin.email
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@buyresearchchems.com',
      password: hashedPassword,
      role: 'admin',
    });
    
    await adminUser.save();
    
    return NextResponse.json({ 
      message: 'Admin user created successfully',
      email: 'admin@buyresearchchems.com',
      password: 'admin123' // Only showing this for development purposes
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ 
      message: 'Error creating admin user', 
      error: error.message 
    }, { status: 500 });
  }
}
