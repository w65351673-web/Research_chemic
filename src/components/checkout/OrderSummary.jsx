'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

export default function OrderSummary({ cartItems, orderDetails }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">Order Summary</h2>

        <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
          {cartItems.map((item) => (
            <div key={item.id || `${item.name}-${item.variant ? item.variant._id : 'default'}`} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <Image src={item.image || '/images/placeholder.png'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-semibold truncate">{item.name}</p>
                <div className="flex justify-between mt-0.5">
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                  <p className="text-gray-900 text-xs font-semibold">&euro;{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link href="/cart" className="text-sky-500 hover:text-sky-600 flex items-center gap-1.5 text-xs font-semibold transition-colors">
          <FaShoppingCart className="text-xs" /> Edit Cart
        </Link>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-900 font-medium">&euro;{orderDetails.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="text-gray-900 font-medium">{orderDetails.shipping > 0 ? `\u20AC${orderDetails.shipping.toFixed(2)}` : 'Free'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax</span>
          <span className="text-gray-900 font-medium">&euro;{orderDetails.tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-1">
          <div className="flex justify-between font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-sky-500 text-lg">&euro;{orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
