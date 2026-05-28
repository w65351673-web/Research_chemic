import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

// GET - Fetch all users with pagination and search
export async function GET(request) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = search 
      ? { 
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ] 
        } 
      : {};
    
    // Get users with pagination
    const users = await User.find(searchQuery)
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);
    
    return NextResponse.json({
      users,
      currentPage: page,
      totalPages,
      totalUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // This will be hashed by the User model pre-save hook
      role: userData.role || 'user'
    });
    
    await newUser.save();
    
    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
