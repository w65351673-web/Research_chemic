'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaSpinner, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '@/components/cart/CartProvider';

export default function CheckoutForm({ orderDetails }) {
  const router = useRouter();
  const { cart } = useCart();

  const [errorMessage, setErrorMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e) => {
    setBillingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingDetails: {
            name: billingDetails.name,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              postal_code: billingDetails.postalCode,
              country: billingDetails.country,
            },
          },
          orderTotal: orderDetails.total,
          cartItems: cart,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      await fetch('/api/cart/clear', { method: 'POST' });
      router.push(`/checkout/success?order_id=${orderData._id}`);
    } catch (error) {
      console.error('Order error:', error);
      setErrorMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const inputClass = 'bg-gray-100/60 border border-gray-700 text-white rounded-xl py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-600 text-sm';
  const labelClass = 'block text-xs font-medium text-gray-900 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="bg-sky-500/20 border border-sky-500/40 text-sky-400 px-4 py-3 rounded-xl text-sm">
          {errorMessage}
        </div>
      )}

      <h3 className="text-white font-semibold text-sm">Billing Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input name="name" type="text" required value={billingDetails.name} onChange={handleChange}
            placeholder="John Doe" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email Address</label>
          <input name="email" type="email" required value={billingDetails.email} onChange={handleChange}
            placeholder="john@example.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input name="phone" type="tel" value={billingDetails.phone} onChange={handleChange}
            placeholder="+1 234 567 8900" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input name="country" type="text" required value={billingDetails.country} onChange={handleChange}
            placeholder="United States" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Street Address</label>
          <input name="address" type="text" required value={billingDetails.address} onChange={handleChange}
            placeholder="123 Main Street" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input name="city" type="text" required value={billingDetails.city} onChange={handleChange}
            placeholder="New York" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Postal Code</label>
          <input name="postalCode" type="text" required value={billingDetails.postalCode} onChange={handleChange}
            placeholder="10001" className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-sky-500 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Placing Order...
          </>
        ) : (
          <>
            <FaLock className="mr-2 text-xs" />
            Place Order â€” â‚¬{orderDetails.total.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-gray-900 text-xs text-center">
        By placing your order you agree to be contacted with payment instructions via email.
      </p>
    </form>
  );
}
