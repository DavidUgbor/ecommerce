import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, Package, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { itemCount, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'All',         href: '/products' },
    { label: 'Shoes',       href: '/products?category=shoes' },
    { label: 'Sandals',     href: '/products?category=sandals' },
    { label: 'Slippers',    href: '/products?category=slippers' },
    { label: 'Bags',        href: '/products?category=bags' },
    { label: 'Wallets',     href: '/products?category=wallets' },
    { label: 'Belts',       href: '/products?category=belts' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ];

  return (
    <>
    {/* Announcement bar */}
    <div className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center">
        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
          <span className="text-accent">✦</span>&nbsp; Real leather. Made by hand. Shipped from Lagos. &nbsp;<span className="text-accent">✦</span>
        </p>
      </div>
    </div>

    <header className="sticky top-0 z-30 bg-white border-b border-sand">

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute inset-0 bg-white z-10 flex items-center px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3 max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-ink-muted flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nie's collection..."
              className="flex-1 py-2 text-base text-ink bg-transparent focus:outline-none placeholder-ink-faint"
            />
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="p-1 text-ink-muted hover:text-ink transition-colors">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.5rem] gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 overflow-hidden rounded-md shadow-sm flex-shrink-0 bg-accent">
              <img
                src="/logo.jpg"
                alt="Nie's Wears"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  el.parentElement!.innerHTML = '<span class="w-full h-full flex items-center justify-center text-white font-bold text-sm">NW</span>';
                }}
              />
            </div>
            <div className="leading-none">
              <span className="block font-display font-bold text-xl sm:text-2xl text-ink tracking-tight">
                Nie's Wears
              </span>
              <span className="hidden sm:block text-[8.5px] uppercase tracking-[0.28em] text-ink-muted mt-1">
                Leather Goods · Lagos, Nigeria
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSearchOpen(true)}
              className="p-2.5 text-ink-muted hover:text-ink transition-colors">
              <Search className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>

            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2.5 text-ink-muted hover:text-ink transition-colors">
                <Heart style={{ width: '1.1rem', height: '1.1rem' }} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            <button onClick={toggleCart} className="relative p-2.5 text-ink-muted hover:text-ink transition-colors">
              <ShoppingCart style={{ width: '1.1rem', height: '1.1rem' }} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-1.5 text-ink-muted hover:text-ink transition-colors">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg border border-sand shadow-card-hover py-1 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-sand-light">
                      <p className="font-semibold text-ink text-sm">{user?.name}</p>
                      <p className="text-xs text-ink-muted truncate">{user?.email}</p>
                    </div>
                    {[
                      { to: '/account', icon: User,    label: 'My Account' },
                      { to: '/orders',  icon: Package, label: 'My Orders' },
                      { to: '/wishlist',icon: Heart,   label: 'Wishlist' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:text-ink hover:bg-canvas transition-colors">
                        <Icon className="w-4 h-4" />{label}
                      </Link>
                    ))}
                    {user?.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-sand-light my-1" />
                        <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent hover:bg-canvas transition-colors">
                          <LayoutDashboard className="w-4 h-4" />Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-sand-light my-1" />
                    <button onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-canvas w-full transition-colors">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="text-xs font-semibold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link to="/register" className="text-xs font-semibold uppercase tracking-widest bg-ink text-white px-4 py-2 rounded hover:bg-ink-muted transition-colors hidden sm:block">
                  Register
                </Link>
                <Link to="/login" className="p-2 text-ink-muted hover:text-ink sm:hidden">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            )}

            <button onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-ink-muted hover:text-ink transition-colors lg:hidden ml-1">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-sand animate-fade-in">
          <nav className="px-4 py-2">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-3 text-xs font-semibold uppercase tracking-widest text-ink-muted hover:text-ink border-b border-sand-light last:border-0">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-sand">
            <form onSubmit={handleSearch} className="flex items-center gap-2 border border-sand rounded px-3 py-2">
              <Search className="w-4 h-4 text-ink-faint" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Nie's collection..."
                className="flex-1 text-sm text-ink bg-transparent focus:outline-none placeholder-ink-faint" />
            </form>
          </div>
          {!isAuthenticated && (
            <div className="px-4 py-3 border-t border-sand flex gap-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-sand text-ink rounded text-xs font-semibold uppercase tracking-widest">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-ink text-white rounded text-xs font-semibold uppercase tracking-widest">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;
