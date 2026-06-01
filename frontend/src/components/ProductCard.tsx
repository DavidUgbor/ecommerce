import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  featured: boolean;
  avgRating: number;
  reviewCount: number;
  images: { url: string; alt?: string }[];
  category: { id: string; name: string; slug: string };
  tags: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    setIsAddingToCart(true);
    try {
      await addItem(product.id);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to manage wishlist');
      return;
    }
    try {
      await toggle(product.id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="group card hover:shadow-luxury-lg transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80';
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="badge bg-accent text-white">Featured</span>
            )}
            {discount > 0 && (
              <span className="badge bg-red-500 text-white">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-gray-500 text-white">Out of Stock</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge bg-orange-500 text-white">Only {product.stock} left</span>
            )}
          </div>

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="bg-primary-900 hover:bg-primary-800 text-white px-4 py-2.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors disabled:opacity-60 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <Link
                to={`/products/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-white hover:bg-cream-DEFAULT text-primary-900 p-2.5 rounded transition-colors shadow-lg"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
            {product.category.name}
          </p>
          <h3 className="font-display font-semibold text-primary-900 mb-2 text-base leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={product.avgRating} size="sm" />
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary-900">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
