'use client';

import Link from 'next/link';
import { FaDna, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineArrowRight as HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const footerLinks = {
  Shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?category=cannabinoids', label: 'Cannabinoids' },
    { href: '/products?category=opioids', label: 'Opioids' },
    { href: '/products?category=nitazenes', label: 'Nitazenes' },
    { href: '/products?category=research%20chemicals', label: 'Research Chemicals' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/shipping', label: 'Shipping Info' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => { setStatus('done'); setEmail(''); setTimeout(() => setStatus('idle'), 3000); }, 800);
  };

  return (
    <footer className="relative bg-gray-50 text-gray-900 overflow-hidden">

      {/* Watermark brand name */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-center pointer-events-none overflow-hidden select-none" aria-hidden>
        <span className="font-black text-transparent leading-none" style={{ fontSize: 'clamp(4rem,14vw,12rem)', WebkitTextStroke: '1px rgba(14,165,233,0.06)', marginTop: '-0.15em' }}>BuyResearchChems</span>
      </div>{/* Main grid */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">

          {/* Brand ï¿½ spans 2 cols */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-xl shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <FaDna className="text-white text-lg" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-gray-900 font-black text-lg tracking-tight">BuyResearch<span className="text-sky-500">Chems</span></span>
                <span className="text-gray-900 text-[9px] tracking-[0.2em] uppercase mt-0.5">Research Chemicals</span>
              </div>
            </Link>

            <p className="text-gray-900 text-sm leading-relaxed max-w-xs">Premium research chemicals verified for scientific excellence. Trusted by laboratories and researchers worldwide.</p>


            {/* Contact quick links */}
            <div className="space-y-2">
              <a href="mailto:info@buyresearchchems.com" className="flex items-center gap-2.5 text-sm text-gray-900 hover:text-sky-500 transition-colors">
                <FaEnvelope className="text-sky-500 text-xs shrink-0" /> info@buyresearchchems.com
              </a>
              <a href="https://wa.me/10000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-900 hover:text-emerald-400 transition-colors">
                <FaWhatsapp className="text-emerald-700 text-xs shrink-0" /> WhatsApp Support
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="group text-sm text-gray-900 hover:text-sky-500 transition-colors flex items-center gap-1.5">
                      <span className="w-0 group-hover:w-2 h-px bg-sky-400 transition-all duration-200 shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges row */}
      <div className="relative z-10 border-t border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {['Lab Verified Purity', 'Batch COA Included', 'Discreet Packaging', 'Secure Checkout', '48h Dispatch'].map(b => (
              <span key={b} className="text-xs text-gray-900 font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 bg-sky-400 rounded-full" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-gray-200">
        <div className="container mx-auto px-6 py-5 flex items-center justify-center">
          <p className="text-gray-900 text-xs">&copy; {new Date().getFullYear()} BuyResearchChems. All rights reserved.</p>
        </div>
      </div>

    </footer>
  );
}
