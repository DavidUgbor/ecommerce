import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import LoadingSpinner from './LoadingSpinner';
import { formatPrice } from '../lib/format';

const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, total, updateQuantity, removeItem, isLoading } = useCartStore();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-luxury-lg flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-primary-900">
          <div className="flex items-center gap-2 text-cream-DEFAULT">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display font-semibold text-lg">Your Cart</h2>
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="text-cream-DEFAULT/70 hover:text-cream-DEFAULT transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Discover our premium leather collection and find your perfect piece.
              </p>
              <Link
                to="/products"
                onClick={closeCart}
                className="btn-primary text-sm"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="px-4 space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.price + (item.variant?.priceModifier || 0);
                const imageUrl = item.product.images?.[0]?.url || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';

                return (
                  <div key={item.id} className="flex gap-3 bg-cream-DEFAULT rounded-lg p-3">
                    <Link to={`/products/${item.product.slug}`} onClick={closeCart}>
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-medium text-primary-900 text-sm hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant.type}: {item.variant.value}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded bg-white">
                          <button
                            onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                            className="p-1.5 hover:bg-gray-50 text-primary-900 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-sm font-medium text-primary-900 min-w-[28px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-50 text-primary-900 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-900 text-sm">
                            {formatPrice(itemPrice * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-primary-900 text-lg">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Delivery confirmed with Nie when you order
            </p>
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-center"
              >
                Place Order
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="btn-secondary w-full justify-center text-sm"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
