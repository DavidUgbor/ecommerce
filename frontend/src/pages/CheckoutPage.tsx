import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Plus, MapPin, Truck, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Breadcrumb from '../components/Breadcrumb';
import LoadingSpinner from '../components/LoadingSpinner';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#3D1A00',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#e5424d' },
  },
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { items, total, clearLocal } = useCartStore();
  const { user, fetchMe } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: '',
    isDefault: false,
  });

  const shipping = total > 150 ? 0 : 15;
  const tax = (total - discount) * 0.075;
  const orderTotal = total - discount + shipping + tax;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/auth/me');
      const addrs = res.data.addresses || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
    } catch {
      // silently fail
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/addresses', newAddress);
      await fetchAddresses();
      setIsAddingAddress(false);
      toast.success('Address added!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add address');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      // Simple validation without a dedicated endpoint
      toast.success('Coupon will be applied at order creation');
    } catch {
      toast.error('Invalid coupon');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!selectedAddressId) { toast.error('Please select a delivery address'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsProcessing(true);

    try {
      // Create payment intent
      const intentRes = await api.post('/payments/create-intent', {
        amount: orderTotal,
        currency: 'usd',
      });
      const { clientSecret, paymentIntentId } = intentRes.data;

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: user?.name, email: user?.email },
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Create order
        const orderRes = await api.post('/orders', {
          addressId: selectedAddressId,
          paymentIntentId,
          couponCode: couponCode || undefined,
        });

        clearLocal();
        toast.success('Order placed successfully!');
        navigate(`/orders/${orderRes.data.id}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Delivery & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-primary-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-sm text-accent hover:text-accent-dark font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {/* Add address form */}
            {isAddingAddress && (
              <div className="mb-5 p-4 bg-cream-DEFAULT rounded-lg border border-gray-100">
                <h3 className="font-semibold text-primary-900 mb-4 text-sm">New Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'fullName', label: 'Full Name' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'street', label: 'Street Address', full: true },
                    { key: 'city', label: 'City' },
                    { key: 'state', label: 'State' },
                    { key: 'country', label: 'Country' },
                    { key: 'zipCode', label: 'Zip Code' },
                  ].map((field) => (
                    <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                      <input
                        type="text"
                        value={(newAddress as any)[field.key]}
                        onChange={(e) => setNewAddress({ ...newAddress, [field.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="accent-accent"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default</label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={handleAddAddress} className="btn-primary text-sm py-2">
                    Save Address
                  </button>
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="btn-secondary text-sm py-2">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Address selection */}
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No saved addresses. Add one above.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-0.5 accent-accent"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary-900 text-sm">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="badge bg-accent/10 text-accent text-xs">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>
                    </div>
                    {selectedAddressId === addr.id && (
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl shadow-luxury p-6">
            <h2 className="font-display text-xl font-bold text-primary-900 mb-5 flex items-center gap-2">
              <span className="text-xl">💳</span>
              Payment Details
            </h2>
            <div className="border-2 border-gray-200 rounded-lg p-4 focus-within:border-accent transition-colors">
              <CardElement options={cardElementOptions} />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              🔒 Your payment info is encrypted and secure. Test: 4242 4242 4242 4242
            </p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-luxury p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-primary-900 mb-5">Order Summary</h2>

            {/* Cart items preview */}
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const price = item.product.price + (item.variant?.priceModifier || 0);
                const imageUrl = item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80';
                return (
                  <div key={item.id} className="flex gap-2 items-center">
                    <div className="relative">
                      <img src={imageUrl} alt={item.product.name} className="w-12 h-12 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'; }} />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-primary-900 truncate">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-gray-400">{item.variant.value}</p>}
                    </div>
                    <span className="text-xs font-semibold text-primary-900">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                />
                <button type="button" onClick={handleApplyCoupon} className="px-3 py-2 bg-primary-100 text-primary-900 rounded text-xs font-medium hover:bg-primary-200 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-primary-900">Total</span>
                <span className="font-display text-2xl font-bold text-primary-900">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !stripe || items.length === 0}
              className="w-full btn-primary justify-center text-base py-4 shadow-luxury"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" color="text-white" />
                  Processing...
                </span>
              ) : (
                <>
                  Place Order · ${orderTotal.toFixed(2)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
              <Truck className="w-3.5 h-3.5" />
              {shipping === 0 ? 'Free shipping applied' : `$${shipping} shipping`}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="font-display text-3xl font-bold text-primary-900 mb-8">Checkout</h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
