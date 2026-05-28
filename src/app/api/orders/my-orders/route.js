import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';
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
    
    return decoded.id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

export async function GET(request) {
  try {
    const userId = await verifyToken(request);
    
    if (!userId) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Get all orders for the user, sorted by most recent first
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name images')
      .lean();
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { message: 'Failed to get orders' },
      { status: 500 }
    );
  }
}
