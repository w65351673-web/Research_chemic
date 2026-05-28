'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt, FaArrowLeft, FaDna } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting admin login with:', { username });
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', response.status, data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      console.log('Login successful');
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50/50 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-sky-100/40 p-8 sm:p-10">

          {/* Logo + title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-500/25">
              <FaDna className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to manage your store</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm p-3.5 rounded-xl mb-6 flex items-start gap-2"
            >
              <span className="mt-0.5 text-red-400">&#9888;</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaUser className="text-gray-300 text-sm" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all"
                  placeholder="Enter admin username"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaLock className="text-gray-300 text-sm" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm pl-10 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 placeholder-gray-400 transition-all"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <FaShieldAlt className="text-xs" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-500 text-sm transition-colors group"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
            Back to main site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
