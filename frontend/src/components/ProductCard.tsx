import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
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
  const discount = product.comparePrice
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
    <div className="group">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-canvas mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            style={{ '--tw-scale-x': 1.03, '--tw-scale-y': 1.03 } as React.CSSProperties}
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="text-[10px] bg-ink text-white px-2 py-0.5 tracking-wider font-medium">
                -{discount}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] bg-white text-ink-muted px-2 py-0.5 tracking-wider border border-sand">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 ${
              inWishlist
                ? 'bg-white text-red-500 opacity-100'
                : 'bg-white/90 text-ink-muted hover:text-red-400'
            }`}>
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Add to cart — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2.5 bg-white/95 backdrop-blur-sm">
            <button onClick={handleCart} disabled={adding || product.stock === 0}
              className="w-full bg-ink hover:bg-accent text-white py-2 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50">
              <ShoppingCart className="w-3.5 h-3.5" />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Meta */}
        <div>
          {/* Stars */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.round(product.avgRating || 0) ? 'text-accent fill-accent' : 'text-sand'}`} />
              ))}
              <span className="text-[10px] text-ink-faint ml-1">({product.reviewCount})</span>
            </div>
          )}

          <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-0.5">{product.category.name}</p>

          <h3 className="text-sm text-ink font-medium leading-snug line-clamp-2 mb-1.5 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">${product.price.toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-xs text-ink-faint line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
