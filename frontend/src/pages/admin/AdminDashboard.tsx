import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
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

const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { stats, recentOrders, lowStockProducts, ordersByStatus } = data || {};

  const statCards = [
    {
      label: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-700',
      trend: '+12%',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700',
      trend: '+8%',
    },
    {
      label: 'Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Customers',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-50 text-orange-700',
      trend: '+5%',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-primary-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Overview of your store performance</p>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: 'Dashboard', href: '/admin', active: true },
            { label: 'Products', href: '/admin/products' },
            { label: 'Orders', href: '/admin/orders' },
            { label: 'Users', href: '/admin/users' },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-primary-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-luxury p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                {card.trend && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {card.trend}
                  </span>
                )}
              </div>
              <div className="font-display text-2xl font-bold text-primary-900">{card.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-semibold text-primary-900 text-lg">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-accent hover:text-accent-dark flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {(recentOrders || []).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-primary-900 text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge text-xs ${statusColors[order.status]}`}>{order.status}</span>
                    <span className="font-semibold text-primary-900 text-sm">
                      ${order.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {!recentOrders?.length && (
                <p className="text-gray-400 text-sm text-center py-4">No orders yet</p>
              )}
            </div>
          </div>

          {/* Low Stock & Order Status */}
          <div className="space-y-5">
            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-luxury p-5">
              <h2 className="font-display font-semibold text-primary-900 mb-4">Order Status</h2>
              <div className="space-y-2">
                {(ordersByStatus || []).map((item: any) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className={`badge text-xs ${statusColors[item.status]}`}>{item.status}</span>
                    <span className="font-semibold text-primary-900 text-sm">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-xl shadow-luxury p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <h2 className="font-display font-semibold text-primary-900">Low Stock Alert</h2>
              </div>
              <div className="space-y-3">
                {(lowStockProducts || []).slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-gray-50 overflow-hidden flex-shrink-0">
                      {product.images?.[0]?.url && (
                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category?.name}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {product.stock} left
                    </span>
                  </div>
                ))}
                {!lowStockProducts?.length && (
                  <p className="text-gray-400 text-xs text-center py-2">All products well stocked</p>
                )}
              </div>
              <Link to="/admin/products" className="block text-center text-xs text-accent hover:text-accent-dark mt-4">
                Manage Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
