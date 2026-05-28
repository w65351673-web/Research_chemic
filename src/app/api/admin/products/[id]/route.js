import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/utils/cloudinary';

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

// Helper to extract cloudinary ID from URL
function getCloudinaryId(url) {
  if (!url || typeof url !== 'string') return null;
  const parts = url.split('/');
  const filenamePart = parts[parts.length - 1];
  return filenamePart.split('.')[0];
}

// GET - Fetch a single product by ID
export async function GET(request, { params: paramsPromise }) {
  // Await the params as required by Next.js
  const params = await paramsPromise;
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a product by ID
export async function PUT(request, { params: paramsPromise }) {
  // Await the params as required by Next.js
  const params = await paramsPromise;
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    const { id } = params;
    
    // Check if product exists
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Parse JSON data
    const productData = await request.json();
    
    // Extract product data
    const { 
      name, 
      description, 
      price, 
      category: submittedCategory, 
      countInStock, 
      featured, 
      rating,
      numReviews,
      images 
    } = productData;
    
    // Validate required fields
    if (!name || !description || isNaN(price) || !submittedCategory || isNaN(countInStock)) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process the category - preserve the original category if the submitted one is invalid
    let category = submittedCategory.toLowerCase();
    
    // Validate against allowed categories
    const validCategories = ['cannabinoids', 'opioids', 'nitazenes', 'etomidate', 'research chemicals'];
    if (!validCategories.includes(category)) {
      console.warn(`Invalid category submitted during edit: ${category}. Preserving original category: ${product.category}`);
      category = product.category; // Keep the original category if the new one is invalid
    }
    
    // Handle images
    let updatedImages = images || [];
    
    // If we're using the old image upload approach, handle it
    // This is just for backward compatibility
    if (productData.existingImages) {
      try {
        updatedImages = productData.existingImages;
      } catch (error) {
        console.error('Error handling existing images:', error);
      }
    }
    
    // Update product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        category,
        countInStock,
        featured,
        rating: rating || product.rating,
        numReviews: numReviews !== undefined ? numReviews : product.numReviews,
        images: updatedImages
      },
      { new: true }
    );
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a product by ID
export async function DELETE(request, { params: paramsPromise }) {
  try {
    // Check admin authorization
    if (!await checkAdminAuth()) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    await dbConnect();
    
    // Await params before using them (required in Next.js 15.3.2+)
    const params = await paramsPromise;
    const { id } = params;
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        for (const imageUrl of product.images) {
          const publicId = getCloudinaryId(imageUrl);
          if (publicId) {
            // Don't await each deletion - we'll continue even if some fail
            deleteFromCloudinary(publicId)
              .catch(err => console.warn(`Failed to delete image ${publicId}:`, err));
          }
        }
      } catch (error) {
        // Log but continue with product deletion even if image deletion fails
        console.error('Error processing product images for deletion:', error);
      }
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
