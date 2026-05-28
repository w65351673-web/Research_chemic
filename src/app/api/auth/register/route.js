import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    await dbConnect();
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'BuyResearchChems-secret-key',
      { expiresIn: '30d' }
    );
    
    // Return user data (without password) and token
    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
