import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Parse request body
    const { username, password } = await request.json();
    
    console.log('Login attempt with:', { username, passwordProvided: !!password });
    
    // Credentials loaded from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminUsername || !adminPassword) {
      console.error('ADMIN_USERNAME or ADMIN_PASSWORD not set in environment');
      return NextResponse.json({ message: 'Server misconfiguration' }, { status: 500 });
    }
    
    // Validate credentials
    if (username !== adminUsername || password !== adminPassword) {
      console.log('Credentials mismatch:', { 
        usernameMatch: username === adminUsername,
        passwordMatch: password === adminPassword 
      });
      
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    console.log('Authentication successful for:', username);
    
    // Create JWT token
    const token = jwt.sign(
      { 
        username: adminUsername,
        isAdmin: true 
      },
      process.env.JWT_SECRET || process.env.ADMIN_PASSWORD,
      { expiresIn: '1d' }
    );
    
    // Set cookie
    const cookieStore = cookies();
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });
    
    return NextResponse.json({ 
      message: 'Login successful',
      success: true
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
