import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

// Helper function to check admin authorization
async function checkAdminAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token');
    
    if (!token) {
      return false;
    }
    
    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'admin-jwt-secret');
    
    if (!decoded || !decoded.isAdmin) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Admin auth check error:', error);
    return false;
  }
}

// GET - Fetch a single user by ID
export async function GET(request, { params }) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const userId = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    // Find user
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a user
export async function PUT(request, { params }) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const userId = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    const updateData = await request.json();
    
    // Find user to update
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Prevent changing the role of the last admin
    if (user.role === 'admin' && updateData.role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { message: 'Cannot change role: This is the last admin user' },
          { status: 400 }
        );
      }
    }
    
    // Update user fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.role) user.role = updateData.role;
    
    // Only update password if provided
    if (updateData.password) {
      user.password = updateData.password;
    }
    
    await user.save();
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(request, { params }) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const userId = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    // Find user to delete
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { message: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      }
    }
    
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
