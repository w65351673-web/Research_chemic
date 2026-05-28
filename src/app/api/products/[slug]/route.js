import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

// Helper function to convert MongoDB documents to plain objects
function convertToPlainObject(doc) {
  // Convert _id to string
  const plainObject = { ...doc };
  if (plainObject._id) {
    plainObject._id = plainObject._id.toString();
  }
  
  // Handle nested objects and arrays
  Object.keys(plainObject).forEach(key => {
    if (plainObject[key] && typeof plainObject[key] === 'object') {
      if (Array.isArray(plainObject[key])) {
        plainObject[key] = plainObject[key].map(item => {
          if (item && typeof item === 'object' && item._id) {
            return convertToPlainObject(item);
          }
          return item;
        });
      } else if (plainObject[key]._id) {
        plainObject[key] = convertToPlainObject(plainObject[key]);
      }
    }
  });
  
  return plainObject;
}

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    await dbConnect();
    
    const product = await Product.findOne({ slug }).lean();
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Convert MongoDB document to plain object before returning
    const serializedProduct = convertToPlainObject(product);
    
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
