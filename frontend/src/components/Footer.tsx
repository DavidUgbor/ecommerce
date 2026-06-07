import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-DEFAULT border-t border-white/5 text-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">NW</span>
              </div>
              <span className="font-display font-bold text-base tracking-wide">Nie's Wears</span>
            </div>
            <p className="text-cream-muted text-xs leading-relaxed mb-5 max-w-[200px]">
              Nie's Wears creates leather goods with character. From shoes to everyday accessories, each piece is handcrafted using premium leather and timeless techniques. Durable, stylish, and designed to grow better with every wear.
            </p>
            <p className="text-cream-muted text-xs mb-3 font-semibold uppercase tracking-wider">Follow Us</p>
            <div className="flex items-center gap-2">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-7 h-7 border border-white/15 rounded flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-cream-muted">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-cream-DEFAULT text-sm font-bold mb-4 uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Center',        href: '#' },
                { label: 'How to Buy',         href: '#' },
                { label: 'Returns & Refunds',  href: '#' },
                { label: 'Terms & Conditions', href: '#' },
                { label: 'Warranty',           href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-cream-muted text-xs hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nie's Wears Links */}
          <div>
            <h4 className="text-cream-DEFAULT text-sm font-bold mb-4 uppercase tracking-wider">Nie's Wears</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About',          href: '#' },
                { label: 'Careers',        href: '#' },
                { label: 'News & Blogs',   href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-cream-muted text-xs hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="text-cream-DEFAULT text-sm font-bold mb-2 uppercase tracking-wider">Newsletter</h4>
            <p className="text-cream-muted text-xs leading-relaxed mb-4">
              Be the first to know about new arrivals, exclusive drops, and Nie's personal style picks — straight to your inbox.
            </p>
            <div className="mb-5 space-y-1.5">
              <p className="text-cream-muted text-xs">📍 93 Lawanson Road, beside Wema Bank, Surulere</p>
              <p className="text-cream-muted text-xs">✉️ chideraannie129@gmail.com</p>
            </div>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 min-w-0 px-3 py-2.5 bg-dark-50 border border-white/10 text-cream-DEFAULT text-xs placeholder-cream-muted/50 focus:outline-none focus:border-accent rounded-l transition-colors"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-white text-xs font-bold px-4 py-2.5 rounded-r transition-colors whitespace-nowrap tracking-wide"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream-muted text-xs">
            © {new Date().getFullYear()} Nie's Wears. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-cream-muted text-xs hover:text-accent transition-colors">
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
