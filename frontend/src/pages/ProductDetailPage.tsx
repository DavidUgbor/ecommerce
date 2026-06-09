import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard, { Product } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../lib/format';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedVariantType, setSelectedVariantType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggle, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['product-reviews', product?.id],
    queryFn: () => api.get(`/products/${product?.id}/reviews`).then((r) => r.data),
    enabled: !!product?.id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category?.slug],
    queryFn: () => api.get(`/products?category=${product.category.slug}&limit=4`).then((r) => r.data),
    enabled: !!product?.category?.slug,
    select: (data) => data.products.filter((p: Product) => p.id !== product?.id).slice(0, 4),
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { productId: string; rating: number; title: string; body: string }) =>
      api.post('/reviews', data),
    onSuccess: () => {
      toast.success('Review submitted!');
      setReviewTitle('');
      setReviewBody('');
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['product-reviews', product?.id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">Product not found</h2>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const variantTypes = [...new Set(product.variants?.map((v: any) => v.type) as string[])];

  const selectedVariantObj = product.variants?.find((v: any) => v.id === selectedVariant);
  const currentPrice = product.price + (selectedVariantObj?.priceModifier || 0);

  const handleAddToCart = async () => {
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    setIsAddingToCart(true);
    try {
      await addItem(product.id, selectedVariant || undefined, quantity);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    try {
      await toggle(product.id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please log in to review'); return; }
    reviewMutation.mutate({ productId: product.id, rating: reviewRating, title: reviewTitle, body: reviewBody });
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: product.category.name, href: `/products?category=${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image Gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative rounded-xl overflow-hidden bg-white shadow-luxury aspect-square">
              <img
                src={product.images?.[selectedImageIndex]?.url || 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={product.images?.[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="badge bg-red-500 text-white text-sm px-3 py-1">-{discount}%</span>
                </div>
              )}
              {/* Navigation arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                    disabled={selectedImageIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-primary-900" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                    disabled={selectedImageIndex === product.images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-primary-900" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/products?category=${product.category.slug}`}
                className="text-sm text-accent font-medium uppercase tracking-wider hover:text-accent-dark transition-colors"
              >
                {product.category.name}
              </Link>
              {product.featured && (
                <span className="badge bg-accent/10 text-accent">Featured</span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-900 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.avgRating} size="md" />
              <span className="text-sm text-gray-600">
                {product.avgRating.toFixed(1)} ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-primary-900">
                {formatPrice(currentPrice)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="badge bg-red-50 text-red-600 text-sm px-3 py-1">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            {/* Variants */}
            {variantTypes.map((type) => {
              const typeVariants = product.variants?.filter((v: any) => v.type === type) || [];
              return (
                <div key={type} className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="font-medium text-primary-900 text-sm uppercase tracking-wider">
                      {type}
                    </label>
                    {selectedVariantType === type && selectedVariant && (
                      <span className="text-sm text-gray-500">
                        — {typeVariants.find((v: any) => v.id === selectedVariant)?.value}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {typeVariants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant.id);
                          setSelectedVariantType(type);
                        }}
                        disabled={variant.stock === 0}
                        className={`px-4 py-2 border-2 rounded text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          selectedVariant === variant.id
                            ? 'border-primary-900 bg-primary-900 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-primary-900'
                        }`}
                      >
                        {variant.value}
                        {variant.priceModifier !== 0 && (
                          <span className="ml-1 text-xs">
                            (+{formatPrice(variant.priceModifier)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 text-primary-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-primary-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-50 text-primary-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 btn-primary justify-center text-base py-3 shadow-luxury"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                onClick={handleWishlist}
                className={`p-3 border-2 rounded-lg transition-all ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              <button className="p-3 border-2 border-gray-200 rounded-lg text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Stock status */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <p className="text-red-500 text-sm font-medium">Out of stock</p>
              ) : product.stock <= 10 ? (
                <p className="text-orange-500 text-sm font-medium">
                  Only {product.stock} left in stock
                </p>
              ) : (
                <p className="text-green-600 text-sm font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  In stock ({product.stock} available)
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="border-t border-gray-100 pt-5 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on orders over ₦50,000' },
                { icon: RotateCcw, text: '7-day exchanges' },
                { icon: Shield, text: '100% genuine leather, always' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <item.icon className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* SKU / Tags */}
            {(product.sku || product.tags) && (
              <div className="border-t border-gray-100 pt-4 mt-4 text-xs text-gray-400 space-y-1">
                {product.sku && <p>SKU: {product.sku}</p>}
                {product.tags && (
                  <p>Tags: {product.tags.split(',').filter(Boolean).join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-luxury p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary-900 mb-1">Customer Reviews</h2>
              {reviewsData && (
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={reviewsData.avgRating} size="lg" />
                  <span className="font-display text-2xl font-bold text-primary-900">
                    {reviewsData.avgRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({reviewsData.total} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-6 mb-8">
            {reviewsData?.reviews?.length > 0 ? (
              reviewsData.reviews.map((review: any) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-cream-DEFAULT text-sm font-semibold">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-primary-900 text-sm">{review.user.name}</div>
                        {review.verified && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check className="w-3 h-3" />
                            Verified Purchase
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  {review.title && (
                    <h4 className="font-medium text-primary-900 mt-2">{review.title}</h4>
                  )}
                  {review.body && (
                    <p className="text-gray-700 text-sm mt-1 leading-relaxed">{review.body}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Add review form */}
          {isAuthenticated ? (
            <div className="border-t border-gray-100 pt-8">
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-900 mb-2">Rating *</label>
                  <StarRating
                    rating={reviewRating}
                    size="lg"
                    interactive
                    onChange={setReviewRating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900 mb-1">Title</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-900 mb-1">Review</label>
                  <textarea
                    value={reviewBody}
                    onChange={(e) => setReviewBody(e.target.value)}
                    placeholder="Tell others about your experience with this product"
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="btn-primary"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          ) : (
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-600 mb-3">Sign in to leave a review</p>
              <Link to="/login" className="btn-primary">Sign In</Link>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-primary-900 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
