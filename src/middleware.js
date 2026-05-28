import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  // Skip processing for the login page to prevent refresh loops
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Check if the request is for an admin route (excluding login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the admin token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    // If no token is present, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'admin-jwt-secret');
      await jwtVerify(token, secret);
      
      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, redirect to login
      console.error('Admin token verification error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Also protect admin API routes (excluding login)
  if (request.nextUrl.pathname.startsWith('/api/admin') && 
      !request.nextUrl.pathname.startsWith('/api/admin/login')) {
    
    // Get the admin token from cookies
    const token = request.cookies.get('admin-token')?.value;
    
    // If no token is present, return unauthorized
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'admin-jwt-secret');
      await jwtVerify(token, secret);
      
      // Token is valid, continue to the protected API route
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, return unauthorized
      console.error('Admin token verification error:', error);
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  // Continue for non-admin routes
  return NextResponse.next();
}

// Configure the middleware to run on specific paths but exclude login page
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
