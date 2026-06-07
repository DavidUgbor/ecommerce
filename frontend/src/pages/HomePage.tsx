import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Clock, RefreshCw, ChevronDown, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard, { Product } from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HERO_IMAGE = 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600';

const blogPosts = [
  {
    date: '12 Nov 2024',
    title: '5 Ways to Make your Leather Accessories Last a Lifetime',
    excerpt: 'Admittedly, nothing lasts forever, even leather. But with the right care we can significantly increase the lifespan and keep it looking pristine for decades.',
    image: 'https://images.pexels.com/photos/4046267/pexels-photo-4046267.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    date: '14 Nov 2024',
    title: 'How to Store Leather Bags for a Long Time — Save from Peeling & Mold',
    excerpt: 'Leather bags are one of the luxury items people love to own. They come in different designs and shapes and can last decades when stored correctly.',
    image: 'https://images.pexels.com/photos/3778212/pexels-photo-3778212.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    date: '31 Nov 2024',
    title: 'How to Clean Leather: 4 Tips for Cleaning Leather Properly',
    excerpt: 'Over time, our precious leather accessories may get covered with dirt. When this happens, we do not need to discard them — just clean them right.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const faqs = [
  { q: 'How long does it take to receive my order?', a: 'Standard orders ship within 2–3 business days. Express delivery is available at checkout and typically arrives within 1–2 business days.' },
  { q: 'How do I request a customization or special order?', a: 'Contact our support team via email or live chat with your requirements. Custom orders typically take 7–14 business days to complete.' },
  { q: 'How can I update my billing information?', a: 'Log in to your account, go to My Account → Payment Methods, and update your billing details there at any time.' },
];

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm text-cream-DEFAULT hover:bg-dark-50 transition-colors"
          >
            <span className="font-medium">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-cream-muted flex-shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-cream-muted leading-relaxed border-t border-white/5 pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const HomePage: React.FC = () => {
  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-products'],
    queryFn: () => api.get('/products?featured=true&limit=4').then((r) => r.data),
  });

  const { data: newArrivalsData, isLoading: newLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => api.get('/products?sort=newest&limit=4').then((r) => r.data),
  });

  const { data: allProductsData } = useQuery({
    queryKey: ['all-products-sale'],
    queryFn: () => api.get('/products?limit=40').then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  const onSaleProducts: Product[] = (allProductsData?.products || [])
    .filter((p: Product) => p.comparePrice && p.comparePrice > p.price)
    .slice(0, 4);

  return (
    <div className="bg-dark-DEFAULT">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '420px' }}>
        <img
          src={HERO_IMAGE}
          alt="Premium Leather Goods"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-DEFAULT/95 via-dark-DEFAULT/70 to-dark-DEFAULT/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center min-h-[420px]">
          <div className="max-w-md">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-cream-DEFAULT leading-tight mb-4">
              Unveil the Artistry of Your Essentials!
            </h1>
            <p className="text-cream-muted text-sm leading-relaxed mb-8 max-w-sm">
              Discover craftsmanship in every stitch with our leather goods where style meets functionality. Elevate your essentials with elegance.
            </p>
            <Link
              to="/products"
              className="inline-block bg-accent hover:bg-accent-dark text-white text-sm font-bold px-8 py-3 rounded transition-colors tracking-wide"
            >
              VIEW MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <div className="bg-dark-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:divide-x divide-white/5">
            {[
              { icon: Shield,    title: '3 Years Warranty',      desc: 'Take your replacement for any kind of quality issues.' },
              { icon: Clock,     title: '24/7 Support',           desc: 'Contact through email or messenger 24/7.' },
              { icon: RefreshCw, title: 'Money Back Guarantee',   desc: "If it doesn't suit, get your money back!" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 sm:px-6 first:pl-0 last:pr-0">
                <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-cream-DEFAULT text-sm font-semibold">{title}</p>
                  <p className="text-cream-muted text-xs leading-snug mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP CATEGORIES ───────────────────────────────── */}
      <section className="py-12 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-cream-DEFAULT mb-6">Top Categories</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(categories || []).map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-dark-50">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <span className="text-cream-DEFAULT text-xs font-medium text-center leading-tight group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ITEMS ────────────────────────────────── */}
      <section className="py-10 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-cream-DEFAULT">Popular Items</h2>
            <Link to="/products?featured=true" className="text-xs text-cream-muted hover:text-accent transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {popularLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(popularData?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEW ARRIVAL ──────────────────────────────────── */}
      <section className="py-10 bg-dark-DEFAULT">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-cream-DEFAULT">New Arrival</h2>
            <Link to="/products?sort=newest" className="text-xs text-cream-muted hover:text-accent transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {newLoading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(newArrivalsData?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ON SALE ──────────────────────────────────────── */}
      {onSaleProducts.length > 0 && (
        <section className="py-10 bg-dark-DEFAULT">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-cream-DEFAULT">On Sale</h2>
              <Link to="/products" className="text-xs text-cream-muted hover:text-accent transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {onSaleProducts.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-14 bg-dark-DEFAULT border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-cream-DEFAULT text-center mb-8">
            Frequently Asked Questions (FAQs)
          </h2>
          <Faq />
        </div>
      </section>

      {/* ── NEWS & BLOG ──────────────────────────────────── */}
      <section className="py-14 bg-dark-DEFAULT border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-cream-DEFAULT mb-2">News &amp; Blog</h2>
            <p className="text-cream-muted text-sm max-w-md mx-auto">
              Uncover the artistry, craftsmanship, and style behind our handmade leather products in our blog.
              Dive into the world of leather, get insider insights, and stay updated on all things handcrafted.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {blogPosts.map((post, i) => (
              <div key={i} className="bg-dark-50 rounded-lg overflow-hidden group cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-accent text-[10px] font-semibold uppercase tracking-widest mb-2">{post.date}</p>
                  <h3 className="text-cream-DEFAULT text-sm font-semibold leading-snug mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-cream-muted text-xs leading-relaxed mb-3 line-clamp-3">{post.excerpt}</p>
                  <span className="text-accent text-xs font-semibold hover:underline">Continue Reading</span>
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
