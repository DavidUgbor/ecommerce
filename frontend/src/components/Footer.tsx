import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-cream-DEFAULT">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-1">Stay in the Loop</h3>
              <p className="text-cream-DEFAULT/70 text-sm">
                Subscribe for exclusive offers, new arrivals, and leather care tips.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1 md:w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded text-cream-DEFAULT placeholder-cream-DEFAULT/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-white px-5 py-3 rounded font-medium text-sm transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">LC</span>
              </div>
              <span className="font-display font-bold text-xl">LeatherCraft</span>
            </div>
            <p className="text-cream-DEFAULT/70 text-sm leading-relaxed mb-5">
              Premium handcrafted leather goods made with passion and precision. Every piece tells a story of craftsmanship.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Shoes', href: '/products?category=shoes' },
                { label: 'Bags', href: '/products?category=bags' },
                { label: 'Wallets', href: '/products?category=wallets' },
                { label: 'Belts', href: '/products?category=belts' },
                { label: 'Accessories', href: '/products?category=accessories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-cream-DEFAULT/70 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {[
                { label: 'My Account', href: '/account' },
                { label: 'My Orders', href: '/orders' },
                { label: 'Shipping Policy', href: '#' },
                { label: 'Returns & Exchanges', href: '#' },
                { label: 'Size Guide', href: '#' },
                { label: 'Care & Maintenance', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-cream-DEFAULT/70 hover:text-accent text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-cream-DEFAULT/70">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
                <span>123 Leather Lane, Craftsville<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-cream-DEFAULT/70">
                <Phone className="w-4 h-4 flex-shrink-0 text-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-cream-DEFAULT/70">
                <Mail className="w-4 h-4 flex-shrink-0 text-accent" />
                <span>hello@leathercraft.com</span>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-cream-DEFAULT/60">
                <span className="text-accent font-semibold">Mon-Fri:</span> 9am – 6pm EST<br />
                <span className="text-accent font-semibold">Sat:</span> 10am – 4pm EST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-cream-DEFAULT/50 text-xs">
            © {new Date().getFullYear()} LeatherCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-cream-DEFAULT/50 hover:text-accent text-xs transition-colors">
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
