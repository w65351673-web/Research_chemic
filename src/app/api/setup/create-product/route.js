import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

// This is a setup route to create a product directly in the database
export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Parse the request body
    const productData = await request.json();
    
    // Create a new product
    const newProduct = new Product(productData);
    await newProduct.save();
    
    return NextResponse.json({ 
      message: 'Product created successfully',
      product: newProduct
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      message: 'Error creating product', 
      error: error.message 
    }, { status: 500 });
  }
}
