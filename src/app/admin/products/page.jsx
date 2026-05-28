'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // For specific operations like delete
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null); // For success/error messages

  const fetchProducts = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&search=${search}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsLoading(true); // Show loading state
      
      const res = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        // Success - remove product from list
        setProducts(products.filter(p => p._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
        setAlertMessage({ type: 'success', text: 'Product deleted successfully' });
      } else {
        // Handle error response
        let errorMessage = 'Failed to delete product';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use status text
          errorMessage = `Failed to delete product: ${res.statusText}`;
        }
        
        setAlertMessage({ type: 'error', text: errorMessage });
        console.error(errorMessage);
      }
    } catch (error) {
      // Handle network/unexpected errors
      const errorMessage = `Error deleting product: ${error.message || 'Unknown error'}`;
      setAlertMessage({ type: 'error', text: errorMessage });
      console.error(errorMessage);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Clear alert message after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {alertMessage && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          alertMessage.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-sky-500/10 border border-sky-500/20 text-sky-400'
        }`}>
          {alertMessage.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalogue</p>
        </div>
        <Link href="/admin/products/new"
          className="bg-sky-500 hover:bg-sky-500 text-white text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-800/30">
          <FaPlus className="text-xs" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-gray-800/60 border border-gray-700 text-white text-sm px-4 py-2.5 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-sky-500 hover:bg-sky-500 text-white text-sm px-4 py-2.5 rounded-xl transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
        </div>
      ) : (
        <>
          {products && products.length > 0 ? (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-700/50">
                      <th className="px-5 py-3">Image</th>
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Stock</th>
                      <th className="px-5 py-3">Featured</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-5 py-3">
                          <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-gray-800">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium text-white">{product.name}</td>
                        <td className="px-5 py-3 text-gray-400 capitalize">{product.category}</td>
                        <td className="px-5 py-3 text-white">
                          {product.price > 0
                            ? `€${Number(product.price).toFixed(2)}`
                            : product.priceVariants?.length > 0
                              ? `€${product.priceVariants[0].price.toFixed(2)}`
                              : '—'}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.countInStock > 10 ? 'bg-green-500/20 text-green-400' :
                            product.countInStock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-sky-500/20 text-sky-400'
                          }`}>
                            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {product.featured ? (
                            <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded-full text-xs font-medium">Featured</span>
                          ) : (
                            <span className="bg-gray-700/40 text-gray-500 px-2 py-1 rounded-full text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/products/edit/${product._id}`}
                              className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title="Edit">
                              <FaEdit className="text-xs" />
                            </Link>
                            <button onClick={() => handleDeleteClick(product)}
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
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">Prev</button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        currentPage === i + 1 ? 'bg-sky-500 text-white' : 'bg-gray-800 border border-gray-700 text-white'
                      }`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm mb-4">No products found.</p>
              <Link href="/admin/products/new"
                className="bg-sky-500 hover:bg-sky-500 text-white text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors">
                <FaPlus className="text-xs" /> Add Your First Product
              </Link>
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
              Delete <span className="text-white font-semibold">{productToDelete?.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isLoading}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-500 text-white text-sm rounded-xl disabled:opacity-50">
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
