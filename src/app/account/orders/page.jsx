'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { FaBox, FaClipboardList, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/account/orders');
      return;
    }

    // Fetch orders if authenticated
    const fetchOrders = async () => {
      try {
        setPageLoading(true);
        
        // For demo purposes, we'll create mock orders
        // In a real app, you would fetch orders from your API
        const mockOrders = [
          {
            _id: '682009d162cd32c2443bb6e9',
            orderNumber: 'ORD-123456',
            totalPrice: 79.99,
            status: 'processing',
            createdAt: new Date().toISOString(),
            items: [
              { name: 'Product 1', quantity: 2, price: 29.99 },
              { name: 'Product 2', quantity: 1, price: 19.99 }
            ]
          },
          {
            _id: '682009d162cd32c2443bb6e8',
            orderNumber: 'ORD-123455',
            totalPrice: 129.99,
            status: 'shipped',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              { name: 'Product 3', quantity: 1, price: 99.99 },
              { name: 'Product 4', quantity: 2, price: 14.99 }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setPageLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, loading, router]);

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-900 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-gray-900">Account</Link>
          <span>/</span>
          <span className="text-gray-900">My Orders</span>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-8">My Orders</h1>

        {error ? (
          <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm p-4 rounded-xl flex items-center gap-3">
            <FaExclamationTriangle className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50/60 border border-gray-700/50 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaClipboardList className="text-gray-900 text-xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-900 text-sm mb-6">You haven&apos;t placed any orders yet.</p>
            <Link href="/products"
              className="bg-sky-500 hover:bg-sky-500 text-white text-sm font-semibold py-2.5 px-6 rounded-xl inline-block transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-gray-50/60 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="bg-gray-100/60 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-700/50">
                  <div>
                    <p className="text-xs text-gray-900 mb-0.5">Order</p>
                    <p className="text-gray-900 font-mono font-semibold text-sm">{order.orderNumber}</p>
                  </div>
                  <div className="flex flex-wrap gap-5">
                    <div>
                      <p className="text-xs text-gray-900 mb-0.5">Date</p>
                      <p className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900 mb-0.5">Total</p>
                      <p className="text-white text-sm font-semibold">â‚¬{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-900 mb-0.5">Status</p>
                      <p className={`text-sm font-semibold capitalize ${
                        order.status === 'delivered' ? 'text-green-400' :
                        order.status === 'shipped' ? 'text-blue-400' :
                        order.status === 'processing' ? 'text-yellow-400' :
                        order.status === 'cancelled' ? 'text-sky-400' :
                        'text-sky-400'
                      }`}>{order.status}</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Items</p>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaBox className="text-gray-900 text-xs" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{item.name}</p>
                            <p className="text-gray-900 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-white text-sm">â‚¬{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-gray-700/50 flex justify-end">
                  <Link href={`/account/orders/${order._id}`}
                    className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
                    View Details â†’
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
