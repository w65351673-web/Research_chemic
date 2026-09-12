'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBox, FaShoppingCart, FaUsers, FaEuroSign,
  FaPlus, FaChartLine, FaArrowRight, FaClipboardList,
  FaUserPlus, FaBoxOpen,
} from 'react-icons/fa';

const statusConfig = {
  completed:  { bg: 'bg-green-500/15',  text: 'text-green-400',  dot: 'bg-green-400'  },
  processing: { bg: 'bg-blue-500/15',   text: 'text-blue-400',   dot: 'bg-blue-400'   },
  shipped:    { bg: 'bg-indigo-500/15', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  pending:    { bg: 'bg-yellow-500/15', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  cancelled:  { bg: 'bg-sky-500/15',    text: 'text-sky-400',    dot: 'bg-sky-400'    },
};

const getStatus = (s) => statusConfig[s] || statusConfig.pending;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders:   data.totalOrders   || 0,
          totalUsers:    data.totalUsers    || 0,
          totalRevenue:  data.totalRevenue  || 0,
          recentOrders:  data.recentOrders  || [],
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
      </div>
    );
  }

  const statCards = [
    {
      icon: FaBox,
      label: 'Total Products',
      value: stats.totalProducts,
      href: '/admin/products',
      linkLabel: 'Manage Products',
      accent: 'teal',
    },
    {
      icon: FaShoppingCart,
      label: 'Total Orders',
      value: stats.totalOrders,
      href: '/admin/orders',
      linkLabel: 'View All Orders',
      accent: 'blue',
    },
    {
      icon: FaUsers,
      label: 'Registered Users',
      value: stats.totalUsers,
      href: '/admin/users',
      linkLabel: 'Manage Users',
      accent: 'violet',
    },
    {
      icon: FaEuroSign,
      label: 'Total Revenue',
      value: `\u20AC${typeof stats.totalRevenue === 'number' ? stats.totalRevenue.toFixed(2) : '0.00'}`,
      href: null,
      linkLabel: 'All-time sales',
      accent: 'green',
    },
  ];

  const accentMap = {
    teal:   { bg: 'bg-sky-500/10',   border: 'border-sky-500/20',   icon: 'text-sky-400',   glow: 'shadow-sky-800/20'   },
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: 'text-blue-400',   glow: 'shadow-blue-900/20'   },
    violet: { bg: 'bg-sky-500/10', border: 'border-sky-500/20', icon: 'text-sky-400', glow: 'shadow-sky-800/20' },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: 'text-green-400',  glow: 'shadow-green-900/20'  },
  };

  const quickActions = [
    { icon: FaPlus,        label: 'Add Product',  href: '/admin/products/new', color: 'teal'   },
    { icon: FaClipboardList, label: 'View Orders',  href: '/admin/orders',       color: 'blue'   },
    { icon: FaUserPlus,    label: 'Add User',     href: '/admin/users/new',    color: 'violet' },
    { icon: FaChartLine,   label: 'All Products', href: '/admin/products',     color: 'green'  },
  ];

  return (
    <div className="space-y-8">
      {/* Header / Welcome banner */}
      <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-950/80 border border-gray-700/50 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-sky-400/4 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">{today}</p>
            <h1 className="text-2xl font-extrabold text-white">Welcome back 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 self-start sm:self-auto whitespace-nowrap"
          >
            <FaPlus className="text-xs" /> Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, href, linkLabel, accent }, i) => {
          const a = accentMap[accent];
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5 shadow-lg ${a.glow}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center shadow`}>
                  <Icon className={`${a.icon} text-base`} />
                </div>
                <FaChartLine className="text-gray-700 text-sm" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
              <p className="text-xs text-gray-500 mb-3">{label}</p>
              {href ? (
                <Link href={href} className={`flex items-center gap-1 ${a.icon} hover:opacity-80 text-xs font-medium transition-all group`}>
                  {linkLabel}
                  <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <span className="text-gray-600 text-xs">{linkLabel}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, href, color }) => {
            const a = accentMap[color];
            return (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4 hover:border-gray-600/60 hover:bg-gray-800/50 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`${a.icon} text-base`} />
                </div>
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <FaBoxOpen className="text-sky-400 text-sm" />
            <h2 className="text-sm font-bold text-white">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors group">
            View All
            <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-900/40 border-b border-gray-700/50">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {stats.recentOrders.map((order, i) => {
                  const s = getStatus(order.status);
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white text-sm font-medium">{order.user?.name || 'Guest'}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold text-sm">
                        &euro;{(order.total || order.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors group"
                        >
                          View
                          <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-gray-800/60 border border-gray-700/50 rounded-2xl flex items-center justify-center mb-4">
              <FaShoppingCart className="text-gray-600 text-lg" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No orders yet</p>
            <p className="text-gray-600 text-xs mt-1">Orders will appear here once customers start buying.</p>
          </div>
        )}
      </div>
    </div>
  );
}
