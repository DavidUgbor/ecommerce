import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../lib/format';

const CartPage: React.FC = () => {
  const { items, total, isLoading, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const shipping = total > 50000 ? 0 : 3500;
  const orderTotal = total + shipping;

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Shopping Cart' }]} />

        <h1 className="font-display text-3xl font-bold text-primary-900 mb-8">
          Shopping Cart
          <span className="text-lg font-normal text-gray-500 ml-3">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemPrice = item.product.price + (item.variant?.priceModifier || 0);
              const imageUrl = item.product.images?.[0]?.url || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';

              return (
                <div key={item.id} className="bg-white rounded-xl p-5 shadow-luxury flex gap-4">
                  <Link to={`/products/${item.product.slug}`}>
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-display font-semibold text-primary-900 hover:text-accent transition-colors text-base sm:text-lg leading-tight"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.variant.type}: <span className="font-medium">{item.variant.value}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="p-2 hover:bg-gray-50 text-primary-900 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold text-primary-900 min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50 text-primary-900 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-primary-900 text-lg">
                          {formatPrice(itemPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-400">{formatPrice(itemPrice)} each</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <Link to="/products" className="text-sm text-accent hover:text-accent-dark transition-colors font-medium">
                ← Continue Shopping
              </Link>
              <button
                onClick={() => clearCart()}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-luxury p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-primary-900 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-primary-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-primary-900'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-accent">
                    Add {formatPrice(50000 - total)} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary-900">Total</span>
                  <span className="font-display text-2xl font-bold text-primary-900">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full justify-center text-base py-4 shadow-luxury"
              >
                Place Order
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Order directly from Nie by email or WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
