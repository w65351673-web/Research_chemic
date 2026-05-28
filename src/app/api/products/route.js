import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    await dbConnect();
    
    // Build query based on parameters
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Execute query with sorting
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .select('-reviews') // Exclude reviews for performance
      .lean();
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
