import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { itemCount, toggleCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Shop All', href: '/products' },
    { label: 'Shoes', href: '/products?category=shoes' },
    { label: 'Bags', href: '/products?category=bags' },
    { label: 'Wallets', href: '/products?category=wallets' },
    { label: 'Belts', href: '/products?category=belts' },
    { label: 'Accessories', href: '/products?category=accessories' },
  ];

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-luxury' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top bar */}
      <div className="bg-primary-900 text-cream-DEFAULT text-xs py-2 text-center font-body">
        Free shipping on orders over $150 | Use code <span className="text-accent font-semibold">LEATHER10</span> for 10% off
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-900 rounded flex items-center justify-center">
              <span className="text-accent font-display font-bold text-sm">LC</span>
            </div>
            <span className="font-display font-bold text-xl text-primary-900 hidden sm:block">
              LeatherCraft
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-accent transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leather goods..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-700 hover:text-accent transition-colors rounded-full hover:bg-cream-DEFAULT"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center" style={{width:'18px',height:'18px',fontSize:'10px'}}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-accent transition-colors rounded-full hover:bg-cream-DEFAULT"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center" style={{width:'18px',height:'18px',fontSize:'10px'}}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-2 text-gray-700 hover:text-accent transition-colors rounded-full hover:bg-cream-DEFAULT"
                >
                  <div className="w-7 h-7 bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-cream-DEFAULT text-xs font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-luxury-lg border border-gray-100 py-1 animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-primary-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-DEFAULT hover:text-primary-900 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-DEFAULT hover:text-primary-900 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-DEFAULT hover:text-primary-900 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-accent hover:bg-cream-DEFAULT transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-accent transition-colors px-3 py-2 hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded transition-colors hidden sm:block"
                >
                  Register
                </Link>
                <Link to="/login" className="p-2 text-gray-700 hover:text-accent sm:hidden">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-accent transition-colors lg:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leather goods..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </form>
          </div>

          {/* Mobile nav links */}
          <nav className="px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-3 text-gray-700 hover:text-accent border-b border-gray-50 last:border-0 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isAuthenticated && (
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-primary-900 text-primary-900 rounded text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-primary-900 text-white rounded text-sm font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
