'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaEnvelope,
  FaTelegramPlane,
  FaPaperPlane,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCommentDots,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';

const TELEGRAM_USERNAME = 'buyresearchchems';

function buildMessage({ name, contact, phone, address, notes }, cart, orderDetails) {
  const itemLines = cart
    .map((item) => {
      const price = Number(item.price ?? item.variant?.price ?? 0);
      const lineTotal = (price * item.quantity).toFixed(2);
      const variant = item.variant?.grams ? ` (${item.variant.grams}g)` : '';
      return `- ${item.name}${variant} x${item.quantity} @ \u20ac${price.toFixed(2)} = \u20ac${lineTotal}`;
    })
    .join('\n');

  return [
    'New Order Request',
    '',
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Phone: ${phone}`,
    `Shipping Address: ${address}`,
    notes ? `Message: ${notes}` : null,
    '',
    'Order Items:',
    itemLines,
    '',
    `Subtotal: \u20ac${orderDetails.subtotal.toFixed(2)}`,
    `Shipping: \u20ac${orderDetails.shipping.toFixed(2)}`,
    `Tax: \u20ac${orderDetails.tax.toFixed(2)}`,
    `Total: \u20ac${orderDetails.total.toFixed(2)}`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export default function OrderContactForm({ cart, orderDetails }) {
  const [method, setMethod] = useState('email');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid =
    form.name.trim() &&
    form.contact.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    confirmed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    if (method === 'telegram') {
      const message = buildMessage(form, cart, orderDetails);
      const text = encodeURIComponent(message);
      window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${text}`, '_blank', 'noopener,noreferrer');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.contact.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
          cart,
          orderDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send order request');

      setSent(true);
      toast.success(`Order request sent! Reference: ${data.reference}`);
    } catch (err) {
      toast.error(err.message || 'Failed to send order request');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2.5 pl-9 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400 text-sm';
  const labelClass = 'block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5';
  const iconClass = 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs';

  if (sent) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-emerald-500 text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Request Sent</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          Your order request has been emailed to our team. We&apos;ll reply to{' '}
          <span className="font-semibold text-gray-900">{form.contact}</span> within 24 hours
          with secure payment instructions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <FaUser className="text-sky-500 text-sm" />
        <h2 className="text-lg font-bold text-gray-900">Your Details</h2>
      </div>

      {/* Method choice cards */}
      <p className={labelClass}>Choose how to continue</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMethod('email')}
          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
            method === 'email'
              ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500/20'
              : 'border-gray-200 bg-white hover:border-sky-300'
          }`}
        >
          <FaEnvelope className={method === 'email' ? 'text-sky-500' : 'text-gray-400'} />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Email</p>
            <p className="text-[11px] text-gray-500 mt-1">We&apos;ll email you order details</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMethod('telegram')}
          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
            method === 'telegram'
              ? 'border-sky-500 bg-sky-50/60 ring-1 ring-sky-500/20'
              : 'border-gray-200 bg-white hover:border-sky-300'
          }`}
        >
          <FaTelegramPlane className={method === 'telegram' ? 'text-sky-500' : 'text-gray-400'} />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Telegram</p>
            <p className="text-[11px] text-gray-500 mt-1">Continue privately in Telegram</p>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <FaUser className={iconClass} />
            <input name="name" type="text" required value={form.name} onChange={handleChange}
              placeholder="John Doe" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>{method === 'email' ? 'Email Address' : 'Telegram Username'}</label>
          <div className="relative">
            {method === 'email'
              ? <FaEnvelope className={iconClass} />
              : <FaTelegramPlane className={iconClass} />}
            <input
              name="contact"
              type={method === 'email' ? 'email' : 'text'}
              required
              value={form.contact}
              onChange={handleChange}
              placeholder={method === 'email' ? 'john@example.com' : '@yourusername'}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Phone Number *</label>
          <div className="relative">
            <FaPhoneAlt className={iconClass} />
            <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
              placeholder="+1 234 567 8900" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Shipping Address</label>
          <div className="relative">
            <FaMapMarkerAlt className={iconClass} />
            <input name="address" type="text" required value={form.address} onChange={handleChange}
              placeholder="123 Main St, Berlin, Germany" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Message (optional)</label>
          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3 text-gray-400 text-xs" />
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
              placeholder="Any special requests or questions..."
              className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg py-2.5 pl-9 pr-3 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-gray-400 text-sm resize-none" />
          </div>
        </div>

        {/* Confirmation */}
        <label className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 rounded-lg p-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
          />
          <span className="text-[11px] text-gray-600 leading-relaxed">
            I am a serious buyer. I understand this is a real order request and I am ready to receive
            payment instructions via {method === 'email' ? 'email' : 'Telegram'}.
          </span>
        </label>

        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin text-xs" />
              Sending Order...
            </>
          ) : (
            <>
              <FaPaperPlane className="text-xs" />
              Send Order via {method === 'email' ? 'Email' : 'Telegram'} &mdash; &euro;{orderDetails.total.toFixed(2)}
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          {method === 'email'
            ? `You'll fill your details and the order will be sent directly to us via email.`
            : `You'll fill your details and the order will be sent directly to us via Telegram.`}
        </p>
      </form>
    </div>
  );
}
