import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';

export async function POST(request, { params }) {
  try {
    console.log('Updating order status for order ID:', params.id);
    
    // TEMPORARY: Skip authentication for testing
    // In a production environment, you would want to properly authenticate users

    await dbConnect();
    
    const { id } = params;
    const { status, paymentIntentId } = await request.json();
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }
    
    // Find the order
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // TEMPORARY: Skip authorization check for testing
    // In a production environment, you would want to properly check authorization
    /*
    // Check if user is admin or the order owner
    const isAdmin = session.user.role === 'admin';
    const isOwner = order.user.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Regular users can only cancel their own orders
    if (!isAdmin && status !== 'cancelled') {
      return NextResponse.json(
        { message: 'Not authorized to change status' },
        { status: 403 }
      );
    }
    */
    
    // Update order status
    order.status = status;
    
    // If payment intent is provided, update it
    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId;
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    
    // If status is delivered, update delivery info
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    // Save the updated order
    await order.save();
    
    return NextResponse.json({ 
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
