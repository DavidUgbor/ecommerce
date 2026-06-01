import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () =>
      api.get(`/admin/users?page=${page}&limit=20${search ? `&search=${search}` : ''}`).then((r) => r.data),
  });

  const users = data?.users || [];

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nav */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Users', href: '/admin/users', active: true },
          ].map((item) => (
            <Link key={item.href} to={item.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-primary-900">Customers</h1>
          <p className="text-gray-500 text-sm">{data?.pagination?.total || 0} total</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-luxury p-5 mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-cream-DEFAULT text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-primary-900 text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{user.phone || '—'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-primary-900">{user._count?.orders || 0}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded border text-sm font-medium transition-colors ${p === page ? 'bg-primary-900 text-white border-primary-900' : 'border-gray-200 text-gray-700 hover:border-accent'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
