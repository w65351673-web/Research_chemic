/**
 * Track User Login API
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
    const { email, name, userId, timestamp } = body;

    // Get visitor IP and location
    const ip = getClientIP(request);
    const location = await getLocationFromIP(ip);
    const device = parseUserAgent(request.headers.get('user-agent'));

    const message = `🔔 User ${email || name || 'Unknown'} logged in from ${location.city}, ${location.country}`;

    // Save to database
    const activity = await Activity.create({
      type: 'user-login',
      message,
      user: {
        email: email || 'Unknown',
        name: name || 'Unknown User',
        id: userId,
      },
      location,
      userAgent: request.headers.get('user-agent'),
      device,
      read: false,
    });

    // Send real-time notification via Socket.io
    const io = global.io;
    if (io) {
      io.to('admin-room').emit('user-login', {
        _id: activity._id.toString(),
        type: 'user-login',
        email: email || 'Unknown',
        name: name || 'Unknown User',
        location,
        device,
        timestamp: activity.createdAt.toISOString(),
        message,
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'User login tracked',
      activityId: activity._id,
    });
  } catch (error) {
    console.error('Error tracking user login:', error);
    return NextResponse.json(
      { error: 'Failed to track user login' },
      { status: 500 }
    );
  }
}
