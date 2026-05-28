import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/utils/db';
import Order from '@/models/Order';

// GET - Fetch a single order by ID
export async function GET(request, { params }) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { id } = params;
    
    // Find the order
    const order = await Order.findById(id)
      .populate('user', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Check if user is admin or the order owner
    const isAdmin = session.user.role === 'admin';
    const isOwner = order.user._id.toString() === session.user.id;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
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

// PUT - Update an order (admin only)
export async function PUT(request, { params }) {
  try {
    // Verify user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { id } = params;
    const updates = await request.json();
    
    // Find the order
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'status', 
      'isDelivered', 
      'deliveredAt', 
      'isPaid', 
      'paidAt',
      'shippingAddress',
      'paymentResult'
    ];
    
    for (const key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        order[key] = updates[key];
      }
    }
    
    // Save the updated order
    await order.save();
    
    return NextResponse.json({ 
      message: 'Order updated',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an order (admin only)
export async function DELETE(request, { params }) {
  try {
    // Verify user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Not authorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { id } = params;
    
    // Find and delete the order
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
