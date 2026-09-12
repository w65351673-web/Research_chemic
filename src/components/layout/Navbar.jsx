'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCart } from '@/components/cart/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaSearch, FaDna, FaFlask, FaCannabis, FaPills, FaSyringe, FaTimes, FaChevronDown, FaChevronRight, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { HiMenu } from 'react-icons/hi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
];

const shopCategories = [
  { href: '/products?category=cannabinoids', label: 'Cannabinoids', Icon: FaCannabis, desc: 'Synthetic & natural compounds' },
  { href: '/products?category=opioids', label: 'Opioids', Icon: FaPills, desc: 'Opioid research compounds' },
  { href: '/products?category=nitazenes', label: 'Nitazenes', Icon: FaSyringe, desc: 'Nitazene compounds' },
  { href: '/products?category=research%20chemicals', label: 'Research Chemicals', Icon: FaFlask, desc: 'Specialized compounds' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const shopRef = useRef(null);
  const userRef = useRef(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartCount = cart ? cart.reduce((s, i) => s + i.quantity, 0) : 0;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setShopOpen(false);
    setUserMenuOpen(false);
    setMobileShopOpen(false);
  }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  // Scroll-aware header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Keyboard shortcuts: Ctrl/Cmd+K to open search, Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setShopOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll when mobile menu or search overlay open
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
  }, [searchQuery]);

  return (
    <>
      {/* Main header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md' : 'bg-white/80 backdrop-blur-md border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 group-hover:rotate-6 transition-transform">
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
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} className="relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors">
                    {active && (
                      <motion.span layoutId="navPill" className="absolute inset-0 bg-sky-50 rounded-lg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className={`relative z-10 ${active ? 'text-sky-600' : 'text-gray-900 hover:text-sky-600'}`}>{label}</span>
                  </Link>
                );
              })}

              {/* Shop dropdown */}
              <div className="relative" ref={shopRef}>
                <button
                  onClick={() => setShopOpen(o => !o)}
                  className="relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                  aria-expanded={shopOpen}
                >
                  {(shopOpen || pathname.startsWith('/products')) && (
                    <motion.span layoutId="navPill" className="absolute inset-0 bg-sky-50 rounded-lg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${shopOpen || pathname.startsWith('/products') ? 'text-sky-600' : 'text-gray-900 hover:text-sky-600'}`}>
                    Shop <FaChevronDown size={9} className={`transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 w-64"
                    >
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/60 overflow-hidden">
                        <div className="h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
                        <div className="p-2">
                          <p className="text-[10px] text-gray-900 uppercase tracking-widest px-3 py-1.5">Categories</p>
                          {shopCategories.map(({ href, label, Icon, desc }) => (
                            <Link key={href} href={href} onClick={() => setShopOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 group/item transition-all">
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
                            <Link href="/products" onClick={() => setShopOpen(false)} className="flex items-center justify-center py-1.5 text-xs text-sky-500 hover:text-sky-600 font-semibold transition-colors">View all &rarr;</Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Search trigger — desktop */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-sky-600 hover:border-sky-300 hover:bg-sky-50/60 transition-all"
              >
                <FaSearch size={12} />
                <span className="text-xs">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-semibold text-gray-500">Ctrl K</kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-all"
                aria-label="Search"
              >
                <FaSearch size={14} />
              </button>

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
                  <div className="relative hidden md:block" ref={userRef}>
                    <button
                      onClick={() => setUserMenuOpen(o => !o)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${userMenuOpen ? 'border-sky-300 text-sky-600 bg-sky-50/60' : 'border-gray-200 hover:border-sky-300 text-gray-700 hover:text-sky-600'}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white text-xs font-black">{user.name.charAt(0).toUpperCase()}</div>
                      <span className="hidden lg:block font-medium">{user.name.split(' ')[0]}</span>
                      <FaChevronDown size={8} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-1.5 z-50"
                        >
                          <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                          <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                            <FaUser size={12} /> Profile
                          </Link>
                          {user.isAdmin && (
                            <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                              <FaUserShield size={12} /> Admin
                            </Link>
                          )}
                          <div className="border-t border-gray-100 my-1" />
                          <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                            <FaSignOutAlt size={12} /> Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  null
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

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-24 sm:pt-32 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <FaSearch className="text-sky-500 shrink-0" size={16} />
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Search compounds, categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 text-base outline-none placeholder-gray-400"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-700 shrink-0">
                  <FaTimes size={14} />
                </button>
              </form>
              <div className="p-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-2 pb-2">Quick categories</p>
                <div className="grid grid-cols-1 gap-1">
                  {shopCategories.map(({ href, label, Icon, desc }) => (
                    <Link key={href} href={href} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 transition-all group/item">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 group-hover/item:bg-sky-100 transition-colors">
                        <Icon className="text-sky-500 text-xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-800 text-sm font-semibold leading-none">{label}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
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

              {/* Search bar â€” opens overlay */}
              <button
                onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                className="flex items-center gap-2 mx-4 my-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-left shrink-0"
              >
                <FaSearch className="text-gray-900 text-xs shrink-0" />
                <span className="text-gray-400 text-sm">Search products...</span>
              </button>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                <div className="space-y-1 mb-4">
                  {navLinks.map(({ href, label }, i) => (
                    <motion.div key={href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, duration: 0.2 }}>
                      <Link
                        href={href}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === href ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'text-gray-900 hover:bg-gray-50 hover:text-sky-600'}`}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Shop accordion */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * navLinks.length, duration: 0.2 }}>
                  <button
                    onClick={() => setMobileShopOpen(o => !o)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname.startsWith('/products') ? 'bg-sky-50 text-sky-600 border border-sky-200' : 'text-gray-900 hover:bg-gray-50 hover:text-sky-600'}`}
                  >
                    Shop by Category
                    <FaChevronRight size={11} className={`transition-transform duration-200 ${mobileShopOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileShopOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pt-1 pb-1">
                          {shopCategories.map(({ href, label, Icon, desc }) => (
                            <Link
                              key={href} href={href}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-900 hover:bg-sky-50 hover:text-sky-600 text-sm transition-all"
                            >
                              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                                <Icon className="text-sky-500 text-[10px]" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium leading-none">{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
                              </div>
                            </Link>
                          ))}
                          <Link href="/products" className="flex items-center justify-center py-2 text-xs text-sky-500 hover:text-sky-600 font-semibold transition-colors">View all &rarr;</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                    null
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
