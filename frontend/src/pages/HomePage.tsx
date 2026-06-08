import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, RefreshCw, Truck, ChevronDown, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import ProductCard, { Product } from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';


const faqs = [
  { q: 'How long does it take to receive my order?', a: 'Standard orders ship within 2–3 business days. Express delivery typically arrives within 1–2 business days.' },
  { q: 'How do I request a customization or special order?', a: 'Reach Nie directly at chideraannie129@gmail.com or via WhatsApp. Custom orders take 7–14 business days.' },
  { q: 'How can I update my billing information?', a: 'Log in to My Account → Payment Methods and update your details there anytime.' },
];

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-sand">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left text-sm text-ink font-medium hover:text-accent transition-colors"
          >
            {faq.q}
            <ChevronDown className={`w-4 h-4 text-ink-muted flex-shrink-0 ml-6 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <p className="pb-5 text-sm text-ink-muted leading-relaxed">
              {faq.a.split('chideraannie129@gmail.com').map((part, j, arr) => (
                <React.Fragment key={j}>
                  {part}
                  {j < arr.length - 1 && (
                    <a href="mailto:chideraannie129@gmail.com" className="text-accent hover:underline">chideraannie129@gmail.com</a>
                  )}
                </React.Fragment>
              ))}
            </p>
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

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  });

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Nie's Wears — Premium Leather Goods"
            className="w-full h-full object-cover"
          />
          {/* Gradient: strong left fade so text is readable, right side shows the leather */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F7] via-[#FAF9F7]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F7]/60 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-5">
              Nie's Wears — Handcrafted in Nigeria
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.05] mb-6">
              Leather Goods<br />
              <em className="not-italic text-accent">With Character</em>
            </h1>
            <p className="text-ink-muted text-base leading-relaxed mb-5 max-w-sm">
              From shoes to bags, wallets to sandals — each piece cut, stitched, and finished by hand. Built from high-quality leather that gets better with every wear.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/products"
                className="bg-ink hover:bg-accent text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded transition-colors">
                Shop Now
              </Link>
              <Link to="/products?featured=true"
                className="text-xs font-semibold uppercase tracking-widest text-ink-muted hover:text-ink border-b border-ink-muted hover:border-ink transition-colors pb-0.5">
                View Featured
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────── */}
      <div className="bg-canvas border-y border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            {[
              { icon: Truck,     text: 'Free shipping on orders over ₦50,000' },
              { icon: RefreshCw, text: '30-day easy returns' },
              { icon: Shield,    text: '100% genuine leather, always' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-ink-muted text-xs">
                <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ─────────────────────────────── */}
      <section className="py-16 bg-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-ink">Shop by Category</h2>
            <Link to="/products" className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink transition-colors font-semibold flex items-center gap-1">
              All Products <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {(categories || []).map((cat: any) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-2">
                <div className="w-full aspect-square overflow-hidden bg-canvas">
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted group-hover:text-accent transition-colors text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ESSENTIALS (Featured) ─────────────────────── */}
      <section className="py-16 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-1">Bestsellers</p>
              <h2 className="font-display text-2xl font-bold text-ink">The Essentials</h2>
            </div>
            <Link to="/products?featured=true" className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink transition-colors font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {popularLoading ? (
            <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(popularData?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ──────────────────────────────── */}
      <section className="py-0 bg-page">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">
            {/* Image */}
            <div className="relative min-h-[320px] lg:min-h-0 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Nie's Wears — premium leather goods collection"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="flex items-center px-8 sm:px-12 lg:px-16 py-14 bg-ink">
              <div className="max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-4">The Craft</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">
                  Sculpted by Hand.<br />Meticulously Crafted.<br />Luxuriously Designed.
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Nie's Wears is a leather goods brand based in Surulere, Lagos. Every piece — from bags to shoes, wallets, and sandals — is made by Nie herself, cut, stitched, and finished by hand. She works only with high-quality leather that ages beautifully and lasts for years. Just real leather, made right.
                </p>
                <p className="text-white/50 text-xs mb-8 italic">
                  "Every piece I make, I make like it's mine to keep."<br />— Nie, Founder & Maker
                </p>
                <Link to="/products"
                  className="inline-block border border-white/30 hover:border-accent hover:text-accent text-white text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded transition-colors">
                  Shop the Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      <section className="py-16 bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-1">Just In</p>
              <h2 className="font-display text-2xl font-bold text-ink">New Arrivals</h2>
            </div>
            <Link to="/products?sort=newest" className="text-xs uppercase tracking-widest text-ink-muted hover:text-ink transition-colors font-semibold flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {newLoading ? (
            <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {(newArrivalsData?.products || []).map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 bg-canvas border-t border-sand">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold text-ink mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Faq />
        </div>
      </section>


      {/* ── NEWSLETTER ───────────────────────────────────── */}
      <section className="py-16 bg-ink">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-3">Stay Updated</p>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Never Miss a Drop</h2>
          <p className="text-white/60 text-sm mb-8">
            New arrivals and restocks, straight to your inbox. No spam, just leather.
          </p>
          <form className="flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 min-w-0 px-4 py-3 bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-accent transition-colors"
            />
            <button type="submit"
              className="bg-accent hover:bg-accent-dark text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
