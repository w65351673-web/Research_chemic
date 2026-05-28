'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { use } from 'react';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

function OrderDetailContent({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableOrder, setEditableOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Fetch order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching order: ${res.status}`);
        }
        
        const data = await res.json();
        setOrder(data);
        setEditableOrder(data); // Initialize editable state with fetched data
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setEditableOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle shipping address changes
  const handleAddressChange = (field, value) => {
    setEditableOrder(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };
  
  // Save changes
  const saveChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editableOrder.status,
          isPaid: editableOrder.isPaid,
          isDelivered: editableOrder.isDelivered,
          notes: editableOrder.notes,
          shippingAddress: editableOrder.shippingAddress
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update order');
      }
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder);
      setEditableOrder(updatedOrder);
      
      // Exit edit mode
      router.push(`/admin/orders/${orderId}`);
    } catch (error) {
      console.error('Error saving order changes:', error);
      setSaveError(error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'shipped':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'completed':
        return 'bg-sky-500/20 text-sky-400';
      case 'cancelled':
        return 'bg-sky-500/20 text-sky-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-sky-500/20 text-sky-400 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <FaExclamationTriangle className="mr-2" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>
        <p>{error}</p>
        <button 
          onClick={() => router.push('/admin/orders')}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Orders
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <p className="text-gray-400 mb-4">Order not found.</p>
        <Link 
          href="/admin/orders"
          className="inline-block bg-sky-500 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-sm"
        >
          Back to Orders
        </Link>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link 
            href="/admin/orders"
            className="mr-4 text-gray-400 hover:text-white"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Order #{orderId.slice(-6)}</h1>
          <span className={`ml-4 px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        
        <div>
          {isEditMode ? (
            <div className="flex space-x-2">
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => router.push(`/admin/orders/${orderId}`)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push(`/admin/orders/${orderId}?edit=true`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaEdit className="mr-2" /> Edit Order
            </button>
          )}
        </div>
      </div>
      
      {saveError && (
        <div className="bg-sky-500/20 text-sky-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <p>{saveError}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 mb-1">Order ID</p>
                <p className="font-medium">{order._id}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Payment Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.isPaid ? 'paid' : 'unpaid'}
                    onChange={(e) => handleInputChange('isPaid', e.target.value === 'paid')}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Not Paid</option>
                  </select>
                ) : (
                  <div className="flex items-center">
                    <span className={order.isPaid ? 'text-green-400' : 'text-sky-400'}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                    {order.isPaid && order.paidAt && (
                      <span className="text-sm text-gray-400 ml-2">({formatDate(order.paidAt)})</span>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Delivery Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.isDelivered ? 'delivered' : 'not-delivered'}
                    onChange={(e) => handleInputChange('isDelivered', e.target.value === 'delivered')}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="delivered">Delivered</option>
                    <option value="not-delivered">Not Delivered</option>
                  </select>
                ) : (
                  <div className="flex items-center">
                    <span className={order.isDelivered ? 'text-green-400' : 'text-sky-400'}>
                      {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                    </span>
                    {order.isDelivered && order.deliveredAt && (
                      <span className="text-sm text-gray-400 ml-2">({formatDate(order.deliveredAt)})</span>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Order Status</p>
                {isEditMode ? (
                  <select
                    value={editableOrder.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                )}
              </div>
              
              <div>
                <p className="text-gray-400 mb-1">Payment Method</p>
                <p className="font-medium">{order.paymentMethod || 'Bank Transfer'}</p>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mt-6">
              <p className="text-gray-400 mb-1">Admin Notes</p>
              {isEditMode ? (
                <textarea
                  value={editableOrder.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[100px]"
                  placeholder="Add notes about this order..."
                />
              ) : (
                <p className="bg-gray-700 p-3 rounded">{order.notes || 'No notes'}</p>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Price</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item._id} className="border-b border-gray-700">
                      <td className="py-4">
                        <div className="flex items-center">
                          {item.product?.images?.[0] && (
                            <div className="w-12 h-12 relative mr-3 bg-gray-700 rounded overflow-hidden">
                              <Image 
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{item.product?.name || 'Product Unavailable'}</p>
                            {item.variant && <p className="text-sm text-gray-400">{item.variant}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">${item.price?.toFixed(2) || '0.00'}</td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4 text-right font-medium">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="pt-4 text-right font-medium">Subtotal:</td>
                    <td className="pt-4 text-right font-medium">${order.itemsPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-2 text-right font-medium">Shipping:</td>
                    <td className="pt-2 text-right font-medium">${order.shippingPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-2 text-right font-medium">Tax:</td>
                    <td className="pt-2 text-right font-medium">${order.taxPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="pt-4 text-right text-lg font-bold">Total:</td>
                    <td className="pt-4 text-right text-lg font-bold">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customer Information</h2>
            
            {order.user ? (
              <div>
                <p className="font-medium">{order.user.name}</p>
                <p className="text-gray-400">{order.user.email}</p>
              </div>
            ) : (
              <p className="text-gray-400">Guest checkout</p>
            )}
          </div>
          
          {/* Shipping Address */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            
            {isEditMode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.name || ''}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Address</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.address || ''}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.postalCode || ''}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.country || ''}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editableOrder.shippingAddress?.phone || ''}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && (
                  <p className="pt-2">
                    <span className="text-gray-400">Phone: </span>
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Payment Info */}
          {order.paymentResult && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400">Payment ID: </span>
                  <span>{order.paymentResult.id}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Status: </span>
                  <span className={order.paymentResult.status === 'succeeded' ? 'text-green-400' : 'text-yellow-400'}>
                    {order.paymentResult.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-400">Date: </span>
                  <span>{formatDate(order.paymentResult.update_time || order.paidAt)}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Email: </span>
                  <span>{order.paymentResult.email_address}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetail({ params }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    }>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
