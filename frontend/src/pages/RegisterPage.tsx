import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const navigate = useNavigate();

  const passwordStrength = (pw: string) => {
    const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)];
    return checks.filter(Boolean).length;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register({ email: form.email, password: form.password, name: form.name, phone: form.phone });
      await Promise.all([fetchCart(), fetchWishlist()]);
      toast.success('Account created! Welcome to LeatherCraft');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT flex">
      {/* Left: Image */}
      <div className="hidden lg:block flex-1 relative">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80"
          alt="Leather Craftsmanship"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-900/60" />
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent rounded flex items-center justify-center">
              <span className="text-white font-display font-bold">LC</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">LeatherCraft</span>
          </Link>
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="space-y-3">
            {['Exclusive member discounts', 'Order tracking & history', 'Priority customer support', 'Early access to new collections'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-cream-DEFAULT">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-900 rounded flex items-center justify-center">
              <span className="text-accent font-display font-bold">LC</span>
            </div>
            <span className="font-display font-bold text-2xl text-primary-900">LeatherCraft</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-primary-900 mb-1">Create your account</h1>
          <p className="text-gray-500 mb-8">Join thousands of satisfied customers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className="text-xs text-gray-500">{strengthLabels[strength]} password</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Confirm Password *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                required
                className={`input-field ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center text-base py-3.5 mt-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
