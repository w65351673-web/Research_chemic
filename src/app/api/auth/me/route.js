import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Middleware to verify JWT token
const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BuyResearchChems-secret-key');
    
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function GET(request) {
  try {
    const user = await verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { message: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const user = await verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { name, email, shippingAddress } = await request.json();
    
    // Update user data
    user.name = name || user.name;
    user.email = email || user.email;
    
    if (shippingAddress) {
      user.shippingAddress = {
        ...user.shippingAddress,
        ...shippingAddress
      };
    }
    
    await user.save();
    
    return NextResponse.json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress
      } 
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { message: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
