'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaWhatsapp, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.", { duration: 5000 });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      toast.error(err.message || 'Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white pointer-events-none" />
        <div className="relative z-10 container mx-auto px-6 pt-32 pb-14 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Contact</span>
          </nav>
          <p className="text-sky-500 text-xs font-bold uppercase tracking-[0.25em] mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            We&apos;d love to hear from you.
          </h1>
          <p className="text-gray-900 text-base leading-relaxed max-w-xl">
            Have a question about a product, shipping, or your order? Send us a message and we&apos;ll reply within 24-48 business hours.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="container mx-auto px-6 -mt-1 pb-12 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          {[
            { Icon: FaEnvelope, label: 'Email', value: 'info@buyresearchchems.com', href: 'mailto:info@buyresearchchems.com' },
            { Icon: FaWhatsapp, label: 'WhatsApp', value: '+1 000 000 0000', href: 'https://wa.me/10000000000' },
            { Icon: FaClock, label: 'Response Time', value: '24-48 hours', href: null },
          ].map(({ Icon, label, value, href }) => {
            const inner = (
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-sky-300 transition-all">
                <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                  <Icon className="text-sky-500 text-sm" />
                </div>
                <div>
                  <p className="text-gray-900 text-[11px] font-bold uppercase tracking-wide">{label}</p>
                  <p className="text-gray-900 text-sm font-medium">{value}</p>
                </div>
              </div>
            );
            return href ? <a key={label} href={href} target="_blank" rel="noopener noreferrer">{inner}</a> : <div key={label}>{inner}</div>;
          })}
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-6 pb-20 max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-1">Send a Message</h2>
          <p className="text-gray-900 text-sm mb-8">Fill out the form below and we&apos;ll get back to you.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Name</label>
                <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Subject</label>
              <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required placeholder="How can we help?" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all" />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={5} required placeholder="Tell us about your inquiry..." className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 resize-none transition-all" />
            </div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 text-emerald-700 font-bold text-sm">
                  <FaCheckCircle /> Message sent successfully!
                </motion.div>
              ) : (
                <motion.button key="btn" type="submit" disabled={isSubmitting} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/20 text-sm">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><FaPaperPlane /> Send Message</>}
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-lg font-black text-gray-900 mb-5">Quick Answers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { q: 'Shipping times?', a: 'Orders dispatched in 48h. Standard 3-5 days, express available.' },
              { q: 'International shipping?', a: 'Yes, most countries worldwide. 7-14 days international.' },
              { q: 'Payment methods?', a: 'Bank transfer, Bitcoin, Ethereum and other secure options.' },
              { q: 'Return policy?', a: 'Accepted for defective or incorrect items within 48h of delivery.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sky-500 text-xs font-bold mb-1">{item.q}</p>
                <p className="text-gray-900 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
