import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Clearing cart');
    
    // For a real implementation, you would clear the cart from your database or session
    // Since we're using client-side cart management with localStorage, we'll just return a success response
    // The actual cart clearing will happen on the client side
    
    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
