'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaUserEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${search}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Refresh user list
      fetchUsers(currentPage, searchTerm);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Use the fetched users directly
  const displayUsers = users;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage registered accounts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-0">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="bg-gray-800/60 border border-gray-700 text-white text-sm px-4 py-2.5 pl-9 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-gray-600"
              />
            </div>
            <button type="submit"
              className="bg-sky-500 hover:bg-sky-500 text-white text-sm px-4 py-2.5 rounded-r-xl transition-colors border-l-0">
              <FaSearch className="text-xs" />
            </button>
          </form>

          <Link href="/admin/users/new"
            className="bg-gray-800 border border-gray-700 hover:border-sky-500 text-white text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <FaUserPlus className="text-xs" /> Add User
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500" />
        </div>
      ) : (
        <>
          {displayUsers && displayUsers.length > 0 ? (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-gray-700/50">
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Email</th>
                      <th className="px-5 py-3">Role</th>
                      <th className="px-5 py-3">Joined</th>
                      <th className="px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {displayUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="px-5 py-3 font-medium text-white">{user.name}</td>
                        <td className="px-5 py-3 text-gray-400">{user.email}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-sky-500/20 text-sky-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/users/edit/${user._id}`}
                              className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors" title="Edit User">
                              <FaUserEdit className="text-xs" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-sky-400 hover:text-sky-300 p-1.5 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30"
                              title="Delete User"
                              disabled={user.role === 'admin'}
                            >
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
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">Previous</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        currentPage === page ? 'bg-sky-500 text-white' : 'bg-gray-800 border border-gray-700 text-white'
                      }`}>{page}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-10 text-center">
              <p className="text-gray-500 text-sm mb-4">No users found.</p>
              <Link href="/admin/users/new"
                className="inline-block bg-sky-500 hover:bg-sky-500 text-white text-sm px-5 py-2.5 rounded-xl transition-colors">
                Add Your First User
              </Link>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-gray-400 text-sm mb-6">
              Delete user <span className="text-white font-semibold">{userToDelete?.name}</span>? This cannot be undone.
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
