'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaShoppingCart, FaUsers, FaChartLine, FaBars, FaTimes, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';

const navItems = [
  { href: '/admin',          label: 'Dashboard', icon: FaChartLine  },
  { href: '/admin/products', label: 'Products',  icon: FaBox        },
  { href: '/admin/orders',   label: 'Orders',    icon: FaShoppingCart },
  { href: '/admin/users',    label: 'Users',     icon: FaUsers      },
];

function SidebarNav({ pathname, onLinkClick }) {
  return (
    <nav className="flex-1">
      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3 px-3">Menu</p>
      <ul className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/70 border border-transparent'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-sky-500/20' : 'bg-gray-800/80'
                }`}>
                  <Icon className={`text-xs ${isActive ? 'text-sky-400' : 'text-gray-500'}`} />
                </div>
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hasCheckedAdmin = useRef(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    if (hasCheckedAdmin.current) return;

    async function checkAdminStatus() {
      try {
        const res = await fetch('/api/auth/check-admin');
        if (res.status === 401) { router.push('/admin/login'); return; }
        const data = await res.json();
        if (!data.isAdmin) {
          router.push('/?message=You do not have admin privileges');
        } else {
          setIsAdmin(true);
          hasCheckedAdmin.current = true;
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-sky-400 text-lg" />
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-sky-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) return children;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900/80 border-r border-gray-800/60 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-gray-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="text-sky-400 text-sm" />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-none">BuyResearchChems</p>
              <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 p-4">
          <SidebarNav pathname={pathname} onLinkClick={undefined} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/60">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-sky-400 text-xs font-medium transition-colors group"
          >
            <FaArrowLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
            Return to Website
          </Link>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-gray-900/90 border-b border-gray-800/60 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
            <FaShieldAlt className="text-sky-400 text-xs" />
          </div>
          <div>
            <p className="text-white font-extrabold text-sm leading-none">BuyResearchChems</p>
            <p className="text-gray-500 text-[10px]">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 bg-gray-900 border-r border-gray-800/60 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Brand */}
            <div className="p-5 border-b border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center">
                  <FaShieldAlt className="text-sky-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm leading-none">BuyResearchChems</p>
                  <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 p-4">
              <SidebarNav pathname={pathname} onLinkClick={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800/60">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-sky-400 text-xs font-medium transition-colors group"
              >
                <FaArrowLeft className="text-[10px] group-hover:-translate-x-0.5 transition-transform" />
                Return to Website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 pt-20 lg:pt-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}
