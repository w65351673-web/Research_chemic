'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import OrderSummary from '@/components/checkout/OrderSummary';
import { FaLock } from 'react-icons/fa';

export default function CheckoutPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }
    
    // Process cart items
    const processCart = async () => {
      try {
        if (cart.length === 0) {
          // Redirect to cart if empty
          router.push('/cart');
          return;
        }
        
        // Calculate order details
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
        const tax = subtotal * 0.07; // 7% tax
        const total = subtotal + shipping + tax;
        
        setOrderDetails({
          subtotal,
          shipping,
          tax,
          total
        });
      } catch (error) {
        console.error('Error processing checkout:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading && isAuthenticated) {
      processCart();
    }
  }, [authLoading, isAuthenticated, router, cart]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  const steps = [
    {
      n: 1,
      title: 'Contact Us',
      body: (
        <>
          <p className="text-gray-900 text-sm mb-3">Send your order details to:</p>
          <a href="mailto:info@buyresearchchems.com" className="text-sky-400 hover:text-sky-300 font-semibold text-base transition-colors">
            info@buyresearchchems.com
          </a>
          <p className="text-gray-900 text-xs mt-2">Include your preferred payment method in the message.</p>
        </>
      ),
    },
    {
      n: 2,
      title: 'Receive Payment Instructions',
      body: <p className="text-gray-900 text-sm">We&apos;ll respond within 24 hours with detailed, secure payment instructions for your chosen method.</p>,
    },
    {
      n: 3,
      title: 'Complete Payment',
      body: <p className="text-gray-900 text-sm">Follow the provided instructions to transfer payment securely via bank transfer or cryptocurrency.</p>,
    },
    {
      n: 4,
      title: 'Order Dispatched',
      body: <p className="text-gray-900 text-sm">Once payment is confirmed we process and dispatch your order within 24â€“48 business hours.</p>,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb + secure badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-900">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-gray-900">Cart</Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
            <FaLock className="text-xs" />
            Secure Checkout
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Complete Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps */}
          <div className="lg:col-span-2 space-y-4">
            {/* Notice banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-3">
              <span className="text-amber-400 text-lg flex-shrink-0">âš ï¸</span>
              <div>
                <p className="text-amber-300 font-semibold text-sm mb-1">Manual payment required</p>
                <p className="text-gray-900 text-sm">We accept bank transfer, Bitcoin, Ethereum, and other secure methods. Follow the steps below to finalise your order.</p>
              </div>
            </div>

            {/* Step cards */}
            {steps.map(({ n, title, body }) => (
              <div key={n} className="bg-gray-50/60 border border-gray-700/50 rounded-2xl p-5 flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-sm">
                  {n}
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm mb-2">{title}</h3>
                  {body}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <OrderSummary cartItems={cart} orderDetails={orderDetails} />

            <div className="bg-gray-50/60 border border-gray-700/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Need help?</h3>
              <p className="text-gray-900 text-xs mb-4 leading-relaxed">
                Questions about your order? Our team is here to assist.
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
                Contact Support â†’
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
