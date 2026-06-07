import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, Package, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { itemCount, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Shoes',       href: '/products?category=shoes' },
    { label: 'Bags',        href: '/products?category=bags' },
    { label: 'Wallets',     href: '/products?category=wallets' },
    { label: 'Belts',       href: '/products?category=belts' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-dark-DEFAULT border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">NW</span>
            </div>
            <span className="font-display font-bold text-base text-cream-DEFAULT hidden sm:block tracking-wide">
              Nie's Wears
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-cream-muted hover:text-cream-DEFAULT transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="flex w-full border border-white/10 rounded overflow-hidden focus-within:border-accent transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nie's collection..."
                className="flex-1 px-3 py-2 text-sm bg-dark-50 text-cream-DEFAULT placeholder-cream-muted/60 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-white text-xs font-bold px-4 py-2 transition-colors whitespace-nowrap tracking-wide"
              >
                SEARCH
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2 text-cream-muted hover:text-cream-DEFAULT transition-colors">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            <button onClick={toggleCart} className="relative p-2 text-cream-muted hover:text-cream-DEFAULT transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-1.5 text-cream-muted hover:text-cream-DEFAULT transition-colors"
                >
                  <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-50 rounded-lg border border-white/10 shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="font-semibold text-cream-DEFAULT text-sm">{user?.name}</p>
                      <p className="text-xs text-cream-muted truncate">{user?.email}</p>
                    </div>
                    {[
                      { to: '/account', icon: User,    label: 'My Account' },
                      { to: '/orders',  icon: Package, label: 'My Orders' },
                      { to: '/wishlist',icon: Heart,   label: 'Wishlist' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cream-muted hover:text-cream-DEFAULT hover:bg-dark-100 transition-colors">
                        <Icon className="w-4 h-4" />{label}
                      </Link>
                    ))}
                    {user?.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-white/5 my-1" />
                        <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent hover:bg-dark-100 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-white/5 my-1" />
                    <button onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-dark-100 w-full transition-colors">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-cream-muted hover:text-cream-DEFAULT transition-colors px-3 py-2 hidden sm:block">Sign In</Link>
                <Link to="/register" className="text-sm font-semibold bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded transition-colors hidden sm:block">Register</Link>
                <Link to="/login" className="p-2 text-cream-muted hover:text-cream-DEFAULT sm:hidden"><User className="w-5 h-5" /></Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-cream-muted hover:text-cream-DEFAULT transition-colors lg:hidden">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-dark-50 border-t border-white/5">
          <div className="px-4 py-3 border-b border-white/5">
            <form onSubmit={handleSearch} className="flex border border-white/10 rounded overflow-hidden">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nie's collection..."
                className="flex-1 px-3 py-2.5 text-sm bg-dark-100 text-cream-DEFAULT placeholder-cream-muted/60 focus:outline-none" />
              <button type="submit" className="bg-accent text-white text-xs font-bold px-4 transition-colors">SEARCH</button>
            </form>
          </div>
          <nav className="px-4 py-2">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-3 text-cream-muted hover:text-cream-DEFAULT border-b border-white/5 last:border-0 text-sm">
                {link.label}
              </Link>
            ))}
          </nav>
          {!isAuthenticated && (
            <div className="px-4 py-3 border-t border-white/5 flex gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-white/20 text-cream-DEFAULT rounded text-sm font-medium">Sign In</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-accent text-white rounded text-sm font-semibold">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
