/**
 * Track Visitor API
 * Sends real-time notification and saves to database with location
 */

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Activity from '@/models/Activity';
import { getClientIP, getLocationFromIP, parseUserAgent } from '@/lib/utils/geolocation';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { page, userAgent, timestamp } = body;

    // Get visitor IP and location
    const ip = getClientIP(request);
    const location = await getLocationFromIP(ip);
    const device = parseUserAgent(userAgent);

    const message = `🔔 New visitor from ${location.city}, ${location.country} on ${page || '/'}`;

    // Save to database
    const activity = await Activity.create({
      type: 'visitor',
      message,
      page: page || '/',
      location,
      userAgent,
      device,
      read: false,
    });

    // Send real-time notification via Socket.io
    const io = global.io;
    if (io) {
      io.to('admin-room').emit('new-visitor', {
        _id: activity._id.toString(),
        type: 'visitor',
        page: page || '/',
        location,
        device,
        userAgent: userAgent || 'Unknown',
        timestamp: activity.createdAt.toISOString(),
        message,
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Visitor tracked',
      activityId: activity._id,
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
