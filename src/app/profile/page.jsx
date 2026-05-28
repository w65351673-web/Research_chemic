'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaShoppingBag, FaMapMarkerAlt, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/components/auth/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ProfilePage() {
  const { user, loading, isAuthenticated, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [updating, setUpdating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=profile');
    }
  }, [loading, isAuthenticated, router]);

  // Set initial form data when user is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
      
      if (user.shippingAddress) {
        setShippingData({
          fullName: user.shippingAddress.fullName || '',
          address: user.shippingAddress.address || '',
          city: user.shippingAddress.city || '',
          postalCode: user.shippingAddress.postalCode || '',
          country: user.shippingAddress.country || '',
        });
      }
    }
  }, [user]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          setLoadingOrders(true);
          const token = localStorage.getItem('token');
          const { data } = await axios.get('/api/orders/my-orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
          toast.error('Failed to load your orders');
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating your profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleShippingUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const result = await updateProfile({ shippingAddress: shippingData });
      
      if (result.success) {
        toast.success('Shipping address updated successfully');
      } else {
        toast.error(result.message || 'Failed to update shipping address');
      }
    } catch (error) {
      toast.error('An error occurred while updating your shipping address');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('/api/auth/update-password', 
        { 
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while updating your password');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-sky-500 text-white' 
                        : 'text-gray-900 hover:bg-gray-700'
                    }`}
                  >
                    <FaUser className="mr-3" /> Profile
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-sky-500 text-white' 
                        : 'text-gray-900 hover:bg-gray-700'
                    }`}
                  >
                    <FaShoppingBag className="mr-3" /> Orders
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'shipping' 
                        ? 'bg-sky-500 text-white' 
                        : 'text-gray-900 hover:bg-gray-700'
                    }`}
                  >
                    <FaMapMarkerAlt className="mr-3" /> Shipping Address
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'password' 
                        ? 'bg-sky-500 text-white' 
                        : 'text-gray-900 hover:bg-gray-700'
                    }`}
                  >
                    <FaLock className="mr-3" /> Change Password
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center p-3 rounded-lg text-gray-900 hover:bg-gray-700 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" /> Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-gray-100 rounded-lg p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-white mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-white mb-2">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={updating}
                        className={`bg-sky-500 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 ${
                          updating ? 'opacity-70 cursor-not-allowed translate-y-0' : ''
                        }`}
                      >
                        {updating ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Update Profile'
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
                
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Order History</h2>
                    
                    {loadingOrders ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order._id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex flex-wrap justify-between items-center mb-4">
                              <div>
                                <p className="text-gray-900 text-sm">Order ID</p>
                                <p className="text-white font-mono">{order._id}</p>
                              </div>
                              <div>
                                <p className="text-gray-900 text-sm">Date</p>
                                <p className="text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-900 text-sm">Total</p>
                                <p className="text-white font-semibold">${order.totalPrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-900 text-sm">Status</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  order.isPaid 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-600 pt-4">
                              <p className="text-gray-900 text-sm mb-2">Items</p>
                              <div className="space-y-2">
                                {order.orderItems.map((item) => (
                                  <div key={item._id} className="flex justify-between">
                                    <div className="flex items-center">
                                      <span className="text-white">{item.name}</span>
                                      {item.variant && (
                                        <span className="text-gray-900 ml-2">({item.variant.quantity}g)</span>
                                      )}
                                      <span className="text-gray-900 mx-2">Ã—</span>
                                      <span className="text-white">{item.quantity}</span>
                                    </div>
                                    <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Link 
                                href={`/orders/${order._id}`}
                                className="text-sky-400 hover:text-sky-300 text-sm"
                              >
                                View Order Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-900 mb-4">You haven't placed any orders yet.</p>
                        <Link 
                          href="/products" 
                          className="bg-sky-500 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-xl transition-colors"
                        >
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Shipping Address Tab */}
                {activeTab === 'shipping' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Shipping Address</h2>
                    
                    <form onSubmit={handleShippingUpdate} className="space-y-6">
                      <div>
                        <label htmlFor="fullName" className="block text-white mb-2">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={shippingData.fullName}
                          onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-white mb-2">
                          Street Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="city" className="block text-white mb-2">
                            City
                          </label>
                          <input
                            id="city"
                            type="text"
                            value={shippingData.city}
                            onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                            className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="postalCode" className="block text-white mb-2">
                            Postal Code
                          </label>
                          <input
                            id="postalCode"
                            type="text"
                            value={shippingData.postalCode}
                            onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                            className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-white mb-2">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          value={shippingData.country}
                          onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={updating}
                        className={`bg-sky-500 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 ${
                          updating ? 'opacity-70 cursor-not-allowed translate-y-0' : ''
                        }`}
                      >
                        {updating ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Update Shipping Address'
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
                
                {/* Change Password Tab */}
                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                    
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-white mb-2">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-white mb-2">
                          New Password
                        </label>
                        <input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                          minLength={6}
                        />
                        <p className="text-gray-900 text-sm mt-1">
                          Must be at least 6 characters
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-white mb-2">
                          Confirm New Password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-gray-700 text-white rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={updating}
                        className={`bg-sky-500 hover:bg-sky-500 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30 ${
                          updating ? 'opacity-70 cursor-not-allowed translate-y-0' : ''
                        }`}
                      >
                        {updating ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Change Password'
                        )}
                      </motion.button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
