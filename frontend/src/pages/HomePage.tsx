import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Award,
  Truck,
  RotateCcw,
  Shield,
  Star,
  ChevronRight,
} from 'lucide-react';
import api from '../lib/api';
import ProductCard, { Product } from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?featured=true&limit=8').then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  const features = [
    {
      icon: Award,
      title: 'Genuine Leather',
      description: 'Every product uses full-grain, top-grade leather sourced from ethical tanneries worldwide.',
    },
    {
      icon: Shield,
      title: 'Handcrafted Quality',
      description: 'Master artisans hand-stitch every piece, ensuring durability and unique character.',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Enjoy complimentary shipping on all orders over $150 with express options available.',
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      description: 'Not satisfied? Return any item within 30 days for a full refund, no questions asked.',
    },
  ];

  const testimonials = [
    {
      name: 'James Mitchell',
      role: 'Business Executive',
      rating: 5,
      text: 'The Oxford Brogue shoes I ordered are absolutely stunning. The craftsmanship is impeccable — they\'ve already become my go-to for client meetings.',
      avatar: 'JM',
    },
    {
      name: 'Sarah Chen',
      role: 'Creative Director',
      rating: 5,
      text: 'I bought the Heritage Briefcase for my promotion. It\'s everything I dreamed of — beautiful, functional, and it only gets better with age.',
      avatar: 'SC',
    },
    {
      name: 'David Okafor',
      role: 'Architect',
      rating: 5,
      text: 'The slim bifold wallet is perfection. Six months in and it looks even better. LeatherCraft truly delivers on their promise of quality.',
      avatar: 'DO',
    },
  ];

  const categoryImages: Record<string, string> = {
    shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    belts: 'https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=800&q=80',
    bags: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    wallets: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
    accessories: 'https://images.unsplash.com/photo-1611010344438-2f6e7ce79bdb?w=800&q=80',
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-primary-900 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1600&q=80"
            alt="Premium Leather Goods"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/40" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">
                Since 1987
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-DEFAULT leading-tight mb-6">
              Premium
              <span className="block text-accent">Leather</span>
              Goods
            </h1>
            <p className="text-cream-DEFAULT/80 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl">
              Handcrafted from the world's finest leathers. Each piece is a testament to artisanal excellence — built to last a lifetime and tell your story.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-accent text-base px-8 py-4 shadow-luxury-lg">
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary border-cream-DEFAULT text-cream-DEFAULT hover:bg-cream-DEFAULT hover:text-primary-900 text-base px-8 py-4">
                Featured Items
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">10K+</div>
                <div className="text-cream-DEFAULT/60 text-xs uppercase tracking-wider">Happy Customers</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">35+</div>
                <div className="text-cream-DEFAULT/60 text-xs uppercase tracking-wider">Years of Craft</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-accent">4.9</div>
                <div className="text-cream-DEFAULT/60 text-xs uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-accent text-accent" /> Rating
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-DEFAULT/40 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-0.5 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">Collections</span>
              <div className="w-12 h-0.5 bg-accent" />
            </div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              From boardroom to weekend — we have the perfect leather piece for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(categories || []).map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-xl overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-300 aspect-[3/4]"
              >
                <img
                  src={cat.image || categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display font-semibold text-white text-lg">{cat.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{cat._count?.products || 0} products</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-accent text-white rounded-full p-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-cream-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-0.5 bg-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-widest">Bestsellers</span>
              </div>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-900 hover:text-accent transition-colors group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {(productsData?.products || []).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link to="/products" className="btn-secondary">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-0.5 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">Our Promise</span>
              <div className="w-12 h-0.5 bg-accent" />
            </div>
            <h2 className="section-title">Why Choose LeatherCraft</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-900 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary-900 group-hover:text-cream-DEFAULT transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-16 bg-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-DEFAULT mb-4">
            Crafted to Last a Lifetime
          </h2>
          <p className="text-cream-DEFAULT/70 text-lg mb-8 max-w-xl mx-auto">
            Use code <span className="text-accent font-bold">LEATHER10</span> for 10% off your first order.
          </p>
          <Link to="/products" className="btn-accent px-10 py-4 text-base shadow-luxury-lg">
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-0.5 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">Reviews</span>
              <div className="w-12 h-0.5 bg-accent" />
            </div>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-luxury hover:shadow-luxury-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-cream-DEFAULT font-semibold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-900 text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
