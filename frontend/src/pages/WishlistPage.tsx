import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import StarRating from '../components/StarRating';
import Breadcrumb from '../components/Breadcrumb';

const WishlistPage: React.FC = () => {
  const { items, toggle } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await toggle(productId);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist.</p>
          <Link to="/products" className="btn-primary">
            Discover Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-900">
            My Wishlist
            <span className="text-lg font-normal text-gray-500 ml-3">({items.length} items)</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const product = item.product;
            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80';

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-luxury overflow-hidden group hover:shadow-luxury-lg transition-all">
                <div className="relative overflow-hidden aspect-square">
                  <Link to={`/products/${product.slug}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80';
                      }}
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
                    {product.category.name}
                  </p>
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-display font-semibold text-primary-900 text-sm hover:text-accent transition-colors mb-2 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {product.reviewCount > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating rating={product.avgRating} size="sm" />
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-primary-900">${product.price.toFixed(2)}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-primary-900 text-white rounded text-sm font-medium hover:bg-primary-800 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
