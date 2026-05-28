import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get the admin token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'admin-jwt-secret');
      const { payload } = await jwtVerify(token, secret);
      
      // Check if the token payload indicates admin status
      if (!payload.isAdmin) {
        return NextResponse.json(
          { message: 'Not authorized' },
          { status: 403 }
        );
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Get counts and stats with error handling
    let totalProducts = 0;
    let totalOrders = 0;
    let totalUsers = 0;
    let totalRevenue = 0;
    let recentOrders = [];
    
    try {
      totalProducts = await Product.countDocuments();
    } catch (err) {
      console.error('Error counting products:', err);
    }
    
    try {
      totalOrders = await Order.countDocuments();
    } catch (err) {
      console.error('Error counting orders:', err);
    }
    
    try {
      totalUsers = await User.countDocuments();
    } catch (err) {
      console.error('Error counting users:', err);
    }
    
    try {
      // Calculate total revenue
      const orders = await Order.find({ status: 'completed' });
      totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.total || order.totalPrice || 0;
        return sum + (typeof orderTotal === 'number' ? orderTotal : 0);
      }, 0);
    } catch (err) {
      console.error('Error calculating revenue:', err);
    }
    
    try {
      // Get recent orders with user info
      recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .lean();
    } catch (err) {
      console.error('Error fetching recent orders:', err);
    }
    
    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
