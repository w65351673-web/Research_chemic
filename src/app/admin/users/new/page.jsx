'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function NewUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...userData } = formData;
      
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create user');
      }
      
      // Redirect to users list on success
      router.push('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Add New User</h1>
        <Link
          href="/admin/users"
          className="flex items-center text-gray-400 hover:text-white"
        >
          <FaArrowLeft className="mr-2" />
          Back to Users
        </Link>
      </div>
      
      {error && (
        <div className="bg-sky-500/20 border border-sky-500 text-sky-400 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  formErrors.name ? 'border border-sky-500' : ''
                }`}
                placeholder="Enter user's full name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sky-400 text-sm">{formErrors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  formErrors.email ? 'border border-sky-500' : ''
                }`}
                placeholder="user@example.com"
              />
              {formErrors.email && (
                <p className="mt-1 text-sky-400 text-sm">{formErrors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  formErrors.password ? 'border border-sky-500' : ''
                }`}
                placeholder="Enter password"
              />
              {formErrors.password && (
                <p className="mt-1 text-sky-400 text-sm">{formErrors.password}</p>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-400 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  formErrors.confirmPassword ? 'border border-sky-500' : ''
                }`}
                placeholder="Confirm password"
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sky-400 text-sm">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-gray-400 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-500 text-white px-6 py-2 rounded-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
