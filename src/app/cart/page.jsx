'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaTrash, FaArrowLeft, FaLock, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-sm mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50/60 border border-gray-700/50 flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-3xl text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
            <p className="text-gray-900 mb-8 text-sm">Browse our catalogue and add research compounds to get started.</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-500 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30">
              <FaArrowLeft className="text-xs" /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-900 mb-1">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span>/</span>
              <span className="text-gray-900">Cart</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          </div>
          <span className="text-sm text-gray-900">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-semibold text-gray-900 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map((item, index) => (
              <div key={`${item._id || item.id || index}`}
                className="bg-gray-50/60 border border-gray-700/50 rounded-2xl p-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-12 md:col-span-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-900 text-xs">N/A</div>
                        )}
                      </div>
                      <div>
                        <Link href={`/products/${item.slug || item.id}`} className="text-gray-900 hover:text-sky-400 font-semibold text-sm leading-snug">
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-gray-900 text-xs mt-0.5">
                            {item.variant.grams ? `${item.variant.grams}g` : item.variant.quantity ? `${item.variant.quantity}g` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4 md:col-span-2 text-gray-900 text-sm text-center">
                    &euro;{Number(item.price ?? item.variant?.price ?? 0).toFixed(2)}
                  </div>

                  <div className="col-span-5 md:col-span-2">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?._id)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-700 text-gray-900 flex items-center justify-center disabled:opacity-40 hover:bg-gray-700 transition-colors text-sm">
                        âˆ’
                      </button>
                      <input type="number" min="1" value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1, item.variant?._id)}
                        className="w-10 bg-transparent text-white text-center text-sm border-0 focus:outline-none" />
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?._id)}
                        className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-700 text-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors text-sm">
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-2 text-right flex items-center justify-end gap-3">
                    <span className="text-gray-900 font-semibold text-sm">&euro;{(Number(item.price ?? item.variant?.price ?? 0) * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id, item.variant?._id, item.variant?.grams)}
                      className="text-gray-900 hover:text-sky-400 transition-colors">
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button onClick={clearCart} className="text-sm text-gray-900 hover:text-sky-400 transition-colors">
                Clear all items
              </button>
              <Link href="/products" className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
                <FaArrowLeft className="text-xs" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50/60 border border-gray-700/50 rounded-2xl p-6 sticky top-28">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-900">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="text-gray-900 font-medium">&euro;{Number(cartTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>Shipping</span>
                  <span className="text-sky-400">-</span>
                </div>
                <div className="border-t border-gray-700/50 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Estimated Total</span>
                  <span className="font-bold text-white text-base">&euro;{Number(cartTotal).toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleCheckout}
                className="w-full bg-sky-500 hover:bg-sky-500 text-gray-900 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30">
                <FaLock className="text-xs" /> Proceed Order
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-gray-900 text-xs">
                <FaLock className="text-xs" />
                <span>Secure &amp; encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
