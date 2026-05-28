import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
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

// GET - Fetch a single order by ID
export async function GET(request, { params: paramsPromise }) {
  // Await the params as required by Next.js
  const params = await paramsPromise;
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
    
    // Ensure models are properly registered before using populate
    // This helps prevent the "Schema hasn't been registered for model" error
    const userModel = mongoose.models.User || User;
    const productModel = mongoose.models.Product || Product;
    
    // Find order
    const order = await Order.findById(orderId)
      .populate({
        path: 'user',
        select: 'name email',
        model: userModel
      })
      .populate({
        path: 'orderItems.product',
        select: 'name price images',
        model: productModel
      })
      .lean();
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an order
export async function PUT(request, { params: paramsPromise }) {
  // Await the params as required by Next.js
  const params = await paramsPromise;
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
    
    const updateData = await request.json();
    
    // Find order to update
    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Update allowed fields
    if (updateData.status) order.status = updateData.status;
    if (updateData.isPaid !== undefined) order.isPaid = updateData.isPaid;
    if (updateData.isDelivered !== undefined) order.isDelivered = updateData.isDelivered;
    if (updateData.deliveredAt) order.deliveredAt = new Date(updateData.deliveredAt);
    if (updateData.notes) order.notes = updateData.notes;
    
    // Update shipping address if provided
    if (updateData.shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...updateData.shippingAddress
      };
    }
    
    // Set updated timestamp
    order.updatedAt = new Date();
    
    await order.save();
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an order
export async function DELETE(request, { params }) {
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
    
    // Find and delete order
    const result = await Order.findByIdAndDelete(orderId);
    
    if (!result) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
