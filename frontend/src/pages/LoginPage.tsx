import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      await Promise.all([fetchCart(), fetchWishlist()]);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary-900 rounded flex items-center justify-center">
              <span className="text-accent font-display font-bold">LC</span>
            </div>
            <span className="font-display font-bold text-2xl text-primary-900">LeatherCraft</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-primary-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-primary-900">Password</label>
                <a href="#" className="text-xs text-accent hover:text-accent-dark transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center text-base py-3.5 mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Test credentials */}
          <div className="mt-5 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Test Accounts</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Admin:</span> admin@leathergoods.com / admin123</p>
              <p><span className="font-medium">User:</span> john@example.com / user1234</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-dark font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1200&q=80"
          alt="Premium Leather"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <blockquote className="text-center">
            <p className="font-display text-3xl font-semibold text-cream-DEFAULT italic leading-relaxed">
              "Quality is remembered long after the price is forgotten."
            </p>
            <footer className="text-accent mt-4 font-medium">— Aldo Gucci</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
