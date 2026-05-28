'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async (page = 1, search = '', status = 'all') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        search: search || '',
        status: status !== 'all' ? status : ''
      }).toString();
      
      const res = await fetch(`/api/admin/orders?${queryParams}`);
      
      if (!res.ok) {
        throw new Error(`Error fetching orders: ${res.status}`);
      }
      
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchTerm, statusFilter);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/orders/${orderToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Show success message
        alert('Order deleted successfully');
        
        // Update the orders list
        setOrders(orders.filter(o => o._id !== orderToDelete._id));
        setShowDeleteModal(false);
        setOrderToDelete(null);
      } else {
        const error = await res.json();
        console.error('Failed to delete order:', error.message || 'Unknown error');
        alert(`Failed to delete order: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`Error deleting order: ${error.message || 'Unknown error'}`);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/update-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        // Update the order in the local state
        const data = await res.json();
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus, ...data.order } : order
        ));
      } else {
        const error = await res.json();
        console.error('Failed to update order status:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and update customer orders</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full bg-gray-800/60 border border-gray-700 text-white text-sm px-4 py-2.5 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-sky-500 hover:bg-sky-500 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
              Search
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/60 border border-gray-700 text-white text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
        </div>
      ) : (
        <>
          {filteredOrders.length > 0 ? (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-700/50">
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-5 py-3 font-mono text-gray-300">#{order._id.slice(-6)}</td>
                        <td className="px-5 py-3">
                          {order.user ? (
                            <div>
                              <div className="font-medium text-white">{order.user.name}</div>
                              <div className="text-gray-500 text-xs">{order.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Unknown</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-white font-medium">€{order.totalPrice.toFixed(2)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {order.isPaid ? (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Paid</span>
                          ) : (
                            <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded-full text-xs font-medium">Unpaid</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/orders/${order._id}`}
                              className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title="View">
                              <FaEye className="text-xs" />
                            </Link>
                            <button onClick={() => router.push(`/admin/orders/${order._id}?edit=true`)}
                              className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title="Edit">
                              <FaEdit className="text-xs" />
                            </button>
                            <button onClick={() => handleDeleteClick(order)}
                              className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title="Delete">
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-5 py-4 border-t border-gray-700/50 flex justify-center gap-1">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        currentPage === i + 1 ? 'bg-sky-500 text-white' : 'bg-gray-800 border border-gray-700 text-white'
                      }`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm">No orders found.</p>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-gray-400 text-sm mb-6">
              Delete order <span className="text-white font-mono">#{orderToDelete?._id.slice(-6)}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-500 text-white text-sm rounded-xl">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
