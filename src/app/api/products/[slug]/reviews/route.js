import { NextResponse } from 'next/server';
import dbConnect from '@/lib/utils/db';
import Product from '@/models/Product';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const { name, rating, comment } = await request.json();

    if (!name || !rating || !comment) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const review = {
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ message: 'Review added successfully', review }, { status: 201 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ message: 'Failed to add review' }, { status: 500 });
  }
}
