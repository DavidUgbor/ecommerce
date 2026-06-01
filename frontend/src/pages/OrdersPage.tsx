import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowRight, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-gray-50 text-gray-700 border-gray-200',
};

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders').then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'My Orders' }]} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900">My Orders</h1>
          <span className="text-sm text-gray-500">{orders?.length || 0} orders</span>
        </div>

        {!orders?.length ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-luxury">
            <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Your orders will appear here once you start shopping.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white rounded-xl shadow-luxury hover:shadow-luxury-lg transition-all duration-200 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-primary-900">Order #{order.orderNumber}</h3>
                      <span className={`badge border text-xs ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {/* Item preview */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                <Package className="w-4 h-4 text-primary-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        {order.items.length > 3 && ` (+${order.items.length - 3} more)`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-display text-xl font-bold text-primary-900">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">{order.paymentStatus}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
