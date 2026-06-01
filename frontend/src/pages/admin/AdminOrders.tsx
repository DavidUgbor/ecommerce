import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

const AdminOrders: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status],
    queryFn: () =>
      api.get(`/admin/orders?page=${page}&limit=20${status ? `&status=${status}` : ''}`).then((r) => r.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    },
  });

  const filteredOrders = (data?.orders || []).filter((order: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      order.user?.name?.toLowerCase().includes(q) ||
      order.user?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nav */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Products', href: '/admin/products' },
            { label: 'Orders', href: '/admin/orders', active: true },
            { label: 'Users', href: '/admin/users' },
          ].map((item) => (
            <Link key={item.href} to={item.href} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-primary-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'}`}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-primary-900">Orders</h1>
          <p className="text-gray-500 text-sm">{data?.pagination?.total || 0} total</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-luxury p-5 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order # or customer..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
            >
              <option value="">All Statuses</option>
              {validStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl shadow-luxury overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-primary-900 text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-400 capitalize">{order.paymentStatus}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-primary-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{order.items?.length || 0} items</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-primary-900">${order.total?.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                          className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent bg-white text-gray-700"
                        >
                          {validStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
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

export default AdminOrders;
