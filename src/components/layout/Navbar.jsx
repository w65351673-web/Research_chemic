'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaSearch, FaDna, FaFlask, FaCannabis, FaPills, FaSyringe, FaVial, FaTimes, FaChevronDown } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const shopCategories = [
  { href: '/products?category=cannabinoids', label: 'Cannabinoids', Icon: FaCannabis, desc: 'Synthetic & natural compounds' },
  { href: '/products?category=opioids', label: 'Opioids', Icon: FaPills, desc: 'Opioid research compounds' },
  { href: '/products?category=nitazenes', label: 'Nitazenes', Icon: FaSyringe, desc: 'Nitazene compounds' },
  { href: '/products?category=etomidate', label: 'Etomidate', Icon: FaVial, desc: 'Etomidate compounds' },
  { href: '/products?category=research%20chemicals', label: 'Research Chemicals', Icon: FaFlask, desc: 'Specialized compounds' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart ? cart.reduce((s, i) => s + i.quantity, 0) : 0;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <>
      {/* â”€â”€ Main header â”€â”€ */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <FaDna className="text-white text-xs" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-gray-900 font-black text-[15px] tracking-tight">
                  BuyResearch<span className="text-sky-500">Chems</span>
                </span>
                <span className="text-gray-900 text-[9px] tracking-[0.18em] uppercase font-medium hidden sm:block">Research Chemicals</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all ${pathname === href ? 'text-sky-600 bg-sky-50' : 'text-gray-900 hover:text-sky-600 hover:bg-sky-50/60'}`}>
                  {label}
                </Link>
              ))}

              {/* Shop dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${pathname.startsWith('/products') ? 'text-sky-600 bg-sky-50' : 'text-gray-900 hover:text-sky-600 hover:bg-sky-50/60'}`}>
                  Shop <FaChevronDown size={9} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-50 w-60">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
                    <div className="p-2">
                      <p className="text-[10px] text-gray-900 uppercase tracking-widest px-3 py-1.5">Categories</p>
                      {shopCategories.map(({ href, label, Icon, desc }) => (
                        <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 group/item transition-all">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 group-hover/item:bg-sky-100 transition-colors">
                            <Icon className="text-sky-500 text-[10px]" />
                          </div>
                          <div>
                            <p className="text-gray-700 text-sm font-semibold group-hover/item:text-sky-600 transition-colors leading-none">{label}</p>
                            <p className="text-gray-900 text-xs mt-0.5">{desc}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="mt-1 pt-2 border-t border-gray-100">
                        <Link href="/products" className="flex items-center justify-center py-1.5 text-xs text-sky-500 hover:text-sky-600 font-semibold transition-colors">View all &rarr;</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search â€” desktop */}
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form key="sf" initial={{ width: 0, opacity: 0 }} animate={{ width: 180, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    <input ref={searchRef} type="search" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-gray-900 text-sm py-2 px-3 outline-none w-full placeholder-gray-400" />
                    <button type="button" onClick={() => setSearchOpen(false)} className="pr-3 text-gray-900 hover:text-gray-700"><FaTimes size={10} /></button>
                  </motion.form>
                ) : (
                  <motion.button key="sb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSearchOpen(true)} className="hidden md:flex w-9 h-9 items-center justify-center rounded-xl text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-all">
                    <FaSearch size={13} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Cart */}
              <Link href="/cart" className="relative cart-icon w-9 h-9 flex items-center justify-center rounded-xl text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-all">
                <FaShoppingCart size={15} />
                {cartCount > 0 && (
                  <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 bg-sky-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User â€” desktop only */}
              {mounted && (
                user ? (
                  <div className="relative group hidden md:block">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:border-sky-300 text-gray-700 hover:text-sky-600 text-sm transition-all">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-black">{user.name.charAt(0).toUpperCase()}</div>
                      <span className="hidden lg:block font-medium">{user.name.split(' ')[0]}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white border border-gray-200 rounded-2xl shadow-xl py-1 z-50 transition-all">
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">Profile</Link>
                      {user.isAdmin && <Link href="/admin" className="block px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">Admin</Link>}
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={logout} className="block w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">Sign out</button>
                    </div>
                  </div>
                ) : (
                  <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition-all">
                    <FaUser size={11} /> Login
                  </Link>
                )
              )}

              {/* Hamburger â€” mobile only */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-sky-50 text-gray-700 transition-all"
                aria-label="Open menu"
              >
                <HiMenu size={20} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* â”€â”€ Mobile drawer â”€â”€ */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-[300px] bg-white border-l border-gray-200 flex flex-col"
            >
              {/* Red top line */}
              <div className="h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                    <FaDna className="text-white text-xs" />
                  </div>
                  <span className="text-gray-900 font-black text-sm">BuyResearch<span className="text-sky-500">Chems</span></span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-all">
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="px-4 py-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                  <FaSearch className="text-gray-900 text-xs shrink-0" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-transparent text-gray-900 text-sm outline-none w-full placeholder-gray-400"
                  />
                </div>
              </form>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                <div className="space-y-1 mb-4">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href} href={href}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === href ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'text-gray-900 hover:bg-gray-50 hover:text-sky-600'}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <p className="text-[10px] text-gray-900 uppercase tracking-widest font-bold px-4 pb-2">Shop by Category</p>
                <div className="space-y-1">
                  {shopCategories.map(({ href, label, Icon }) => (
                    <Link
                      key={href} href={href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-900 hover:bg-sky-50 hover:text-sky-600 text-sm transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Icon className="text-sky-500 text-[10px]" />
                      </div>
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Bottom auth */}
              <div className="px-3 pb-6 pt-3 border-t border-gray-100 space-y-2 shrink-0">
                <Link href="/cart" className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-sky-600 text-sm font-semibold transition-all">
                  <span className="flex items-center gap-2.5"><FaShoppingCart size={13} /> Cart</span>
                  {cartCount > 0 && <span className="bg-sky-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{cartCount}</span>}
                </Link>

                {mounted && (
                  user ? (
                    <>
                      <Link href="/profile" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-sky-600 text-sm font-semibold transition-all">
                        <FaUser size={12} /> Profile
                      </Link>
                      {user.isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-sky-600 text-sm font-semibold transition-all">
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-gray-900 hover:text-sky-600 hover:bg-sky-50 text-sm font-semibold transition-all text-left">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition-all">
                      <FaUser size={12} /> Login / Register
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
