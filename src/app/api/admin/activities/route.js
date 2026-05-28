/**
 * Activity History API
 * Get all activities with filtering and pagination
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Activity from '@/models/Activity';
import { verifyAdmin } from '@/lib/utils/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Verify admin
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type');
    const unreadOnly = searchParams.get('unread') === 'true';

    // Build query
    const query = {};
    if (type) {
      query.type = type;
    }
    if (unreadOnly) {
      query.read = false;
    }

    // Get total count
    const total = await Activity.countDocuments(query);

    // Get activities
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get unread count
    const unreadCount = await Activity.countDocuments({ read: false });

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { message: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// Mark activities as read
export async function PUT(request) {
  try {
    // Verify admin
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { activityIds, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all as read
      await Activity.updateMany({ read: false }, { read: true });
      return NextResponse.json({ 
        success: true,
        message: 'All activities marked as read' 
      });
    }

    if (activityIds && activityIds.length > 0) {
      // Mark specific activities as read
      await Activity.updateMany(
        { _id: { $in: activityIds } },
        { read: true }
      );
      return NextResponse.json({ 
        success: true,
        message: `${activityIds.length} activities marked as read` 
      });
    }

    return NextResponse.json(
      { message: 'No activities specified' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating activities:', error);
    return NextResponse.json(
      { message: 'Failed to update activities' },
      { status: 500 }
    );
  }
}
