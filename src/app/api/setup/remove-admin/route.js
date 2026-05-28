import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// This is a utility route to remove admin privileges from a user
export async function GET(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Get the email from the query parameter
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ 
        message: 'Email parameter is required',
        example: '/api/setup/remove-admin?email=admin@buyresearchchems.com'
      }, { status: 400 });
    }
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        message: 'User not found with the provided email',
      }, { status: 404 });
    }
    
    // Update the user's role to regular user
    user.role = 'user';
    await user.save();
    
    return NextResponse.json({ 
      message: 'Admin privileges removed successfully',
      email: user.email,
      role: user.role
    });
    
  } catch (error) {
    console.error('Error removing admin privileges:', error);
    return NextResponse.json({ 
      message: 'Error removing admin privileges', 
      error: error.message 
    }, { status: 500 });
  }
}
