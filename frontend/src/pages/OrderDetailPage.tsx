import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, MapPin, CreditCard, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../lib/format';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-gray-50 text-gray-700 border-gray-200',
};

const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.put(`/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success('Order cancelled');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to cancel');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">Order not found</h2>
        <Link to="/orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'My Orders', href: '/orders' }, { label: `#${order.orderNumber}` }]} />

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge border text-sm px-3 py-1.5 ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}>
              {order.status}
            </span>
            {['PENDING', 'CONFIRMED'].includes(order.status) && (
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        {!['CANCELLED', 'REFUNDED'].includes(order.status) && (
          <div className="bg-white rounded-xl shadow-luxury p-6 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      i <= currentStepIndex
                        ? 'bg-accent border-accent text-white'
                        : 'bg-white border-gray-200 text-gray-300'
                    }`}
                  >
                    {i < currentStepIndex ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium text-center hidden sm:block ${i <= currentStepIndex ? 'text-primary-900' : 'text-gray-400'}`}>
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-luxury p-6">
              <h2 className="font-display font-semibold text-primary-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary-200" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary-900 text-sm">{item.productName}</h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant.type}: {item.variant.value}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-primary-900 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-luxury p-5">
              <h3 className="font-display font-semibold text-primary-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-primary-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Payment: <span className="capitalize font-medium text-gray-600">{order.paymentStatus}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="bg-white rounded-xl shadow-luxury p-5">
                <h3 className="font-display font-semibold text-primary-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  Delivery Address
                </h3>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p className="font-medium text-primary-900">{order.address.fullName}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                  <p>{order.address.country}</p>
                  <p className="text-gray-400">{order.address.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link to="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
