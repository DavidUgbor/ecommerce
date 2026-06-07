import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
                <span className="text-white font-display font-bold text-[10px]">NW</span>
              </div>
              <span className="font-display font-semibold text-base tracking-wide">Nie's Wears</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-5 max-w-[200px]">
              Nie's Wears creates leather goods with character. Handcrafted with premium leather and timeless techniques — durable, stylish, designed to grow better with every wear.
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Follow</p>
            <div className="flex items-center gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-7 h-7 border border-white/15 rounded flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-white/50">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center',        href: '#' },
                { label: 'How to Buy',         href: '#' },
                { label: 'Returns & Refunds',  href: '#' },
                { label: 'Terms & Conditions', href: '#' },
                { label: 'Warranty',           href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/60 text-xs hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Shoes',        href: '/products?category=shoes' },
                { label: 'Sandals',      href: '/products?category=sandals' },
                { label: 'Slippers',     href: '/products?category=slippers' },
                { label: 'Bags',         href: '/products?category=bags' },
                { label: 'Wallets',      href: '/products?category=wallets' },
                { label: 'Belts',        href: '/products?category=belts' },
                { label: 'Accessories',  href: '/products?category=accessories' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/60 text-xs hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-4">Get in Touch</h4>
            <div className="space-y-2 mb-6">
              <p className="text-white/60 text-xs">93 Lawanson Road, beside Wema Bank, Surulere</p>
              <p className="text-white/60 text-xs">chideraannie129@gmail.com</p>
            </div>
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-3">Newsletter</h4>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-3 py-2.5 bg-white/10 border border-white/15 text-white text-xs placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
              />
              <button type="submit"
                className="bg-accent hover:bg-accent-dark text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Nie's Wears. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-white/30 text-xs hover:text-accent transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
