import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with fallback values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnxyxgc1m',
  api_key: process.env.CLOUDINARY_API_KEY || '262695698328963',
  api_secret: process.env.CLOUDINARY_API_SECRET || '9EzxMjSzz71frqYAGhFunNe7xWo',
});

// Helper function to check admin authorization
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
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

// Helper function to upload to Cloudinary
async function uploadToCloudinary(file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'BuyResearchChems/products',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error preparing file for upload:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    console.log('Upload API called');
    
    // Check admin authorization
    if (!await checkAdminAuth()) {
      console.log('Authorization failed');
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    console.log('Admin authorized');

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.log('No file in request');
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('File received:', file.name, file.type, file.size);
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.' },
        { status: 400 }
      );
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { message: 'File size exceeds the 10MB limit.' },
        { status: 400 }
      );
    }

    console.log('Starting Cloudinary upload...');
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dnxyxgc1m',
      has_api_key: !!(process.env.CLOUDINARY_API_KEY || '262695698328963'),
      has_api_secret: !!(process.env.CLOUDINARY_API_SECRET || '9EzxMjSzz71frqYAGhFunNe7xWo')
    });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(file);
    
    console.log('Upload successful:', result.secure_url);

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      filename: result.original_filename,
      size: result.bytes
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { message: 'Error uploading file: ' + error.message },
      { status: 500 }
    );
  }
}
