import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function PUT(request) {
  try {
    const user = await verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update password' },
      { status: 500 }
    );
  }
}
