import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';
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

const FALLBACK = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const inWishlist = isInWishlist(product.id);
  const discount   = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;
  const imageUrl = product.images?.[0]?.url || FALLBACK;

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please log in to add items to cart'); return; }
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    setAdding(true);
    try {
      await addItem(product.id);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally { setAdding(false); }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please log in to manage wishlist'); return; }
    try {
      await toggle(product.id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  return (
    <div className="group bg-dark-50 rounded-xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-dark-100">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.featured && (
              <span className="badge bg-accent text-white text-[10px] px-2 py-0.5">Featured</span>
            )}
            {discount > 0 && (
              <span className="badge bg-red-500 text-white text-[10px] px-2 py-0.5">-{discount}%</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-white/20 text-white text-[10px] px-2 py-0.5 backdrop-blur-sm">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all duration-200 ${
              inWishlist ? 'bg-red-500 text-white' : 'bg-dark-DEFAULT/70 text-cream-muted hover:text-red-400 backdrop-blur-sm'
            }`}>
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 p-3 bg-gradient-to-t from-dark-DEFAULT/90 to-transparent pt-8">
            <button onClick={handleCart} disabled={adding || product.stock === 0}
              className="flex-1 bg-accent hover:bg-accent-dark text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60">
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link to={`/products/${product.slug}`} onClick={(e) => e.stopPropagation()}
              className="bg-dark-50/80 hover:bg-dark-100 text-cream-DEFAULT p-2 rounded-lg transition-colors backdrop-blur-sm">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p className="text-[10px] text-accent font-medium uppercase tracking-widest mb-1">{product.category.name}</p>
          <h3 className="font-medium text-cream-DEFAULT text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors mb-2">
            {product.name}
          </h3>

          {/* Stars */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < Math.round(product.avgRating) ? 'text-accent fill-accent' : 'text-dark-300'}`} />
              ))}
              <span className="text-[10px] text-cream-muted ml-0.5">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-cream-DEFAULT">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xs text-cream-muted line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
