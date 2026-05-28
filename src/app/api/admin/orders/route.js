import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

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

// GET - Fetch all orders with pagination and search
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
    const status = searchParams.get('status') || '';
    
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
      searchQuery.status = status;
    }
    
    // Add search term if provided
    if (search) {
      // Try to match order ID if search looks like an ID
      if (ObjectId.isValid(search)) {
        searchQuery._id = new ObjectId(search);
      } else {
        // For searching by shipping address
        searchQuery = {
          ...searchQuery,
          'shippingAddress.fullName': { $regex: search, $options: 'i' }
        };
      }
    }
    
    // Get orders with pagination
    const orders = await Order.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name email',
        model: mongoose.models.User || User
      })
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalOrders / limit);
    
    return NextResponse.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Update order status in bulk
export async function POST(request) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const { orderIds, status } = await request.json();
    
    if (!orderIds || !Array.isArray(orderIds) || !status) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Validate order IDs
    const validOrderIds = orderIds.filter(id => ObjectId.isValid(id));
    
    if (validOrderIds.length === 0) {
      return NextResponse.json(
        { message: 'No valid order IDs provided' },
        { status: 400 }
      );
    }
    
    // Update orders
    const result = await Order.updateMany(
      { _id: { $in: validOrderIds.map(id => new ObjectId(id)) } },
      { $set: { status, updatedAt: new Date() } }
    );
    
    return NextResponse.json({
      message: `Updated ${result.modifiedCount} orders to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating orders:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
