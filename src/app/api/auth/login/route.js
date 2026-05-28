import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    await dbConnect();
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'BuyResearchChems-secret-key',
        { expiresIn: '30d' }
      );
      
      // Send real-time notification to admin
      try {
        const io = global.io;
        if (io) {
          io.to('admin-room').emit('user-login', {
            type: 'user-login',
            email: user.email,
            name: user.name,
            timestamp: new Date().toISOString(),
            message: `🔔 User ${user.email} logged in`,
          });
        }
      } catch (err) {
        console.error('Error sending login notification:', err);
      }
      
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
    } else {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}
