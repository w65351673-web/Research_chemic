import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';
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

// POST - Update order status
export async function POST(request, { params }) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const orderId = params.id;
    
    // Validate ObjectId
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }
    
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Find and update order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Update status and timestamps
    order.status = status;
    order.updatedAt = new Date();
    
    // Set additional fields based on status
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
    
    if (status === 'completed') {
      order.isPaid = true;
      if (!order.paidAt) {
        order.paidAt = new Date();
      }
      order.isDelivered = true;
      if (!order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }
    
    await order.save();
    
    return NextResponse.json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        status: order.status,
        updatedAt: order.updatedAt,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        isPaid: order.isPaid,
        paidAt: order.paidAt
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
