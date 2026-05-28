/**
 * Track Page View API
 * Sends real-time notification and saves to database with location
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Activity from '@/models/Activity';
import { getClientIP, getLocationFromIP, parseUserAgent } from '@/lib/utils/geolocation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { page, user, userAgent, timestamp } = body;

    // Get visitor IP and location
    const ip = getClientIP(request);
    const location = await getLocationFromIP(ip);
    const device = parseUserAgent(userAgent || request.headers.get('user-agent'));

    const message = user 
      ? `🔔 User ${user} from ${location.city}, ${location.country} opened ${page || 'Homepage'}`
      : `🔔 Anonymous user from ${location.city}, ${location.country} viewing ${page || 'Homepage'}`;

    // Save to database
    const activity = await Activity.create({
      type: 'page-view',
      message,
      page: page || '/',
      user: user ? { email: user } : undefined,
      location,
      userAgent: userAgent || request.headers.get('user-agent'),
      device,
      read: false,
    });

    // Send real-time notification via Socket.io
    const io = global.io;
    if (io) {
      io.to('admin-room').emit('page-view', {
        _id: activity._id.toString(),
        type: 'page-view',
        page: page || '/',
        user: user || 'Anonymous',
        location,
        device,
        timestamp: activity.createdAt.toISOString(),
        message,
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Page view tracked',
      activityId: activity._id,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}
