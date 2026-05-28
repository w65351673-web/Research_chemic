import { NextResponse } from 'next/server';
import { deleteFile } from '@/lib/utils/multerUpload';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Helper function to check admin authorization
async function checkAdminAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin-token');
    
    if (!token) {
      return false;
    }
    
    // Verify the token
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'admin-jwt-secret');
    
    if (!decoded || !decoded.isAdmin) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Admin auth check error:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { filePath } = body;
    
    if (!filePath) {
      return NextResponse.json(
        { message: 'No file path provided' },
        { status: 400 }
      );
    }

    // Delete the file
    const result = deleteFile(filePath);
    
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { message: 'Error deleting file: ' + error.message },
      { status: 500 }
    );
  }
}
