'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { FaCheckCircle, FaBox, FaHome, FaClipboardList } from 'react-icons/fa';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const orderId = searchParams.get('order_id');
  
  // Use a ref to track if we've already cleared the cart
  const [cartCleared, setCartCleared] = useState(false);
  
  useEffect(() => {
    // Only clear the cart once
    if (!cartCleared) {
      clearCart();
      setCartCleared(true);
    }
    
    if (!orderId) {
      router.push('/');
      return;
    }
    
    const mockOrder = {
      _id: orderId,
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      totalPrice: 79.99,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    
    setOrder(mockOrder);
    setLoading(false);
  }, [orderId, router, cartCleared]); // Remove clearCart from dependencies
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success card */}
        <div className="bg-gray-50/60 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
          {/* Green banner */}
          <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Order Confirmed!</h1>
            <p className="text-sky-100 text-sm">Thank you for your order. We&apos;ve received it and will be in touch shortly.</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Order details */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Order Details</h2>
              <div className="bg-gray-100/60 border border-gray-700/50 rounded-xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-900 mb-0.5">Order Number</p>
                  <p className="text-gray-900 font-semibold text-sm">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-900 mb-0.5">Date</p>
                  <p className="text-gray-900 font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-900 mb-0.5">Total</p>
                  <p className="text-gray-900 font-semibold text-sm">â‚¬{order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-900 mb-0.5">Status</p>
                  <p className="text-sky-400 font-semibold text-sm capitalize">{order.status}</p>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">What&apos;s Next?</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <FaBox className="text-sky-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Order Processing</p>
                    <p className="text-gray-900 text-xs mt-0.5">Your order is being reviewed and will be dispatched shortly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <FaClipboardList className="text-sky-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email Updates</p>
                    <p className="text-gray-900 text-xs mt-0.5">You will receive status updates via email as your order progresses.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-700 border border-gray-700 text-gray-900 font-semibold py-3 px-5 rounded-xl transition-colors text-sm">
                <FaHome className="text-xs" /> Continue Shopping
              </Link>
              <Link href="/account/orders"
                className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-500 text-gray-900 font-semibold py-3 px-5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 text-sm">
                <FaClipboardList className="text-xs" /> View My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
