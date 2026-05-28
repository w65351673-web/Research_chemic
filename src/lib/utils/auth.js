/**
 * Authentication Utilities
 * Helper functions for verifying admin access
 */

import jwt from 'jsonwebtoken';
import dbConnect from './db';
import User from '@/models/User';

/**
 * Verify if the request is from an admin user
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} - Admin user object or null
 */
export async function verifyAdmin(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header found');
      return null;
    }
    
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      console.log('No token found');
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BuyResearchChems-secret-key');
    console.log('Token decoded:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Invalid decoded token');
      return null;
    }

    // Connect to database
    await dbConnect();

    // Find user and check if admin
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user ? user.email : 'none', 'isAdmin:', user?.isAdmin);

    if (!user || !user.isAdmin) {
      console.log('User not found or not admin');
      return null;
    }

    console.log('Admin verified successfully');
    return user;
  } catch (error) {
    console.error('Error verifying admin:', error.message);
    return null;
  }
}

/**
 * Verify if the request is from an authenticated user
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} - User object or null
 */
export async function verifyUser(request) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'BuyResearchChems-secret-key');

    if (!decoded || !decoded.id) {
      return null;
    }

    // Connect to database
    await dbConnect();

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error verifying user:', error);
    return null;
  }
}

/**
 * Get user from request (if authenticated)
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object|null>} - User object or null
 */
export async function getUserFromRequest(request) {
  return await verifyUser(request);
}
