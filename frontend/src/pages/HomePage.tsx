import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Shield, Truck, RotateCcw, Star, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard, { Product } from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get('/products?featured=true&limit=8').then((r) => r.data),
  });

  const { data: newArrivals, isLoading: newLoading } = useQuery({
    queryKey: ['new-products'],
    queryFn: () => api.get('/products?sort=newest&limit=4').then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  const testimonials = [
    { name: 'James Mitchell', role: 'Business Executive', rating: 5, text: 'The Oxford Brogue shoes are absolutely stunning. The craftsmanship is impeccable — my go-to for client meetings.', avatar: 'JM' },
    { name: 'Sarah Chen',     role: 'Creative Director',  rating: 5, text: 'I bought the Heritage Briefcase for my promotion. Beautiful, functional, and it only gets better with age.',         avatar: 'SC' },
    { name: 'David Okafor',   role: 'Architect',           rating: 5, text: 'The slim bifold wallet is perfection. Six months in and it looks even better. Truly delivers on quality.',           avatar: 'DO' },
  ];

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-dark-DEFAULT">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Premium Leather"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-DEFAULT via-dark-DEFAULT/90 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-0.5 bg-accent" />
              <span className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">Handcrafted Leather Goods</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-DEFAULT leading-[1.05] mb-6">
              Unveil the<br />
              <span className="text-accent">Artistry</span> of<br />
              Your Essentials
            </h1>

            <p className="text-cream-muted text-lg mb-10 leading-relaxed max-w-md">
              Discover craftsmanship in every stitch. Where style meets functionality. Elevate your wardrobe with elegance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base px-8 py-4 shadow-glow">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products?featured=true" className="btn-secondary text-base px-8 py-4">
                Featured Items
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-12">
              {[
                { icon: Shield,   text: '3 Years Warranty' },
                { icon: Truck,    text: '24/7 Support' },
                { icon: RotateCcw,text: 'Money Back Guarantee' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-dark-50 border border-white/5 rounded-full px-4 py-2">
                  <Icon className="w-3.5 h-3.5 text-accent" />
                  <span className="text-cream-muted text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cream-muted/40 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* ── TOP CATEGORIES ───────────────────────────────── */}
      <section className="py-16 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-2">Browse</p>
              <h2 className="section-title">Top Categories</h2>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-sm text-cream-muted hover:text-accent transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {(categories || []).map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-dark-50 border border-white/5 group-hover:border-accent/40 transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <span className="text-cream-muted text-xs font-medium group-hover:text-accent transition-colors text-center">{cat.name}</span>
                <span className="text-cream-muted/50 text-[10px]">{cat._count?.products} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ITEMS ────────────────────────────────── */}
      <section className="py-16 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-2">Bestsellers</p>
              <h2 className="section-title">Popular Items</h2>
            </div>
            <Link to="/products?featured=true" className="hidden sm:flex items-center gap-1 text-sm text-cream-muted hover:text-accent transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(productsData?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER CTA ───────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="banner"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-dark-DEFAULT/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4">Limited Offer</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-cream-DEFAULT mb-4">
            Crafted to Last a Lifetime
          </h2>
          <p className="text-cream-muted text-lg mb-8 max-w-lg mx-auto">
            Use code <span className="text-accent font-bold">LEATHER10</span> for 10% off your first order.
          </p>
          <Link to="/products" className="btn-primary px-10 py-4 text-base shadow-glow">
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      <section className="py-16 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-2">Fresh In</p>
              <h2 className="section-title">New Arrival</h2>
            </div>
            <Link to="/products?sort=newest" className="hidden sm:flex items-center gap-1 text-sm text-cream-muted hover:text-accent transition-colors group">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {newLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(newArrivals?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section className="py-16 bg-dark-50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Our Promise</p>
            <h2 className="section-title">Why Choose LeatherCraft</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield,    title: '100% Genuine Leather', desc: 'Full-grain, top-grade leather sourced from ethical tanneries worldwide.' },
              { icon: Truck,     title: 'Free Shipping',         desc: 'Complimentary shipping on all orders over $150 with express options.' },
              { icon: RotateCcw, title: '30-Day Returns',        desc: 'Not satisfied? Return any item within 30 days for a full refund.' },
            ].map((f) => (
              <div key={f.title} className="bg-dark-100 border border-white/5 rounded-xl p-6 text-center group hover:border-accent/30 transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-cream-DEFAULT mb-2">{f.title}</h3>
                <p className="text-cream-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-16 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Reviews</p>
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-dark-50 border border-white/5 rounded-xl p-6 hover:border-accent/20 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-cream-muted text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-cream-DEFAULT text-sm">{t.name}</p>
                    <p className="text-cream-muted text-xs">{t.role}</p>
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
