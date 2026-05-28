import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Get the admin token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { isAdmin: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'admin-jwt-secret');
      const { payload } = await jwtVerify(token, secret);
      
      // Check if the token payload indicates admin status
      if (!payload.isAdmin) {
        return NextResponse.json(
          { isAdmin: false, message: 'Not authorized' },
          { status: 403 }
        );
      }
      
      // User is authenticated and is an admin
      return NextResponse.json({ 
        isAdmin: true,
        username: payload.username || 'admin'
      });
    } catch (jwtError) {
      // Token is invalid
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { isAdmin: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { isAdmin: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
