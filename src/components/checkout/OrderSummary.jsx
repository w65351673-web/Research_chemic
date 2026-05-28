'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

export default function OrderSummary({ cartItems, orderDetails }) {
  return (
    <div className="bg-gray-50/60 border border-gray-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-700/50">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Order Summary</h2>

        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
          {cartItems.map((item) => (
            <div key={item.id || `${item.name}-${item.variant ? item.variant._id : 'default'}`} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={item.image || '/images/placeholder.png'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.name}</p>
                <div className="flex justify-between mt-0.5">
                  <p className="text-gray-900 text-xs">Qty: {item.quantity}</p>
                  <p className="text-gray-900 text-xs">â‚¬{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/cart" className="text-sky-400 hover:text-sky-300 flex items-center gap-1.5 text-xs font-medium transition-colors">
          <FaShoppingCart className="text-xs" /> Edit Cart
        </Link>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">Subtotal</span>
          <span className="text-white">â‚¬{orderDetails.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">Shipping</span>
          <span className="text-white">{orderDetails.shipping > 0 ? `â‚¬${orderDetails.shipping.toFixed(2)}` : 'Free'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-900">Tax</span>
          <span className="text-white">â‚¬{orderDetails.tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-700/50 pt-3 mt-1">
          <div className="flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="text-sky-400 text-lg">â‚¬{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
