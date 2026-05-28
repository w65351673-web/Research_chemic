import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// This is a one-time setup route to make an existing user an admin
// In production, you would want to secure this route or remove it after use
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
        example: '/api/setup/make-admin?email=your@email.com'
      }, { status: 400 });
    }
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ 
        message: 'User not found with the provided email',
      }, { status: 404 });
    }
    
    // Update the user's role to admin
    user.role = 'admin';
    await user.save();
    
    return NextResponse.json({ 
      message: 'User successfully updated to admin role',
      email: user.email
    });
    
  } catch (error) {
    console.error('Error updating user to admin:', error);
    return NextResponse.json({ 
      message: 'Error updating user to admin', 
      error: error.message 
    }, { status: 500 });
  }
}
