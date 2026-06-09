import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Mail, MessageCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Breadcrumb from '../components/Breadcrumb';
import { formatPrice } from '../lib/format';

const NIE_EMAIL = 'chideraannie129@gmail.com';
// Nie's WhatsApp — update if a different number is preferred.
const NIE_WHATSAPP = '2348000000000';

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const shipping = total > 50000 ? 0 : 3500;
  const orderTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-DEFAULT flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add a piece you love, then place your order.</p>
          <Link to="/products" className="btn-primary">
            Browse the Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const buildOrderText = () => {
    const lines = items.map((item) => {
      const unit = item.product.price + (item.variant?.priceModifier || 0);
      const variant = item.variant ? ` (${item.variant.type}: ${item.variant.value})` : '';
      return `• ${item.product.name}${variant} × ${item.quantity} — ${formatPrice(unit * item.quantity)}`;
    });
    return [
      `Hello Nie, I'd like to place an order:`,
      ``,
      ...lines,
      ``,
      `Subtotal: ${formatPrice(total)}`,
      `Delivery: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}`,
      `Total: ${formatPrice(orderTotal)}`,
      ``,
      `Name: ${name || '—'}`,
      `Phone: ${phone || '—'}`,
      `Delivery address: ${address || '—'}`,
      note ? `Note: ${note}` : ``,
    ]
      .filter((l) => l !== '')
      .join('\n');
  };

  const placeByEmail = () => {
    const subject = `New order from ${name || 'a customer'} — Nie's Wears`;
    const body = buildOrderText();
    window.location.href = `mailto:${NIE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const placeByWhatsApp = () => {
    const text = buildOrderText();
    window.open(`https://wa.me/${NIE_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-cream-DEFAULT">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Place Order' }]} />

        <h1 className="font-display text-3xl font-bold text-primary-900 mb-2">Place Your Order</h1>
        <p className="text-gray-500 mb-8 max-w-xl">
          Tell us where to deliver and send your order straight to Nie by email or WhatsApp.
          She'll confirm availability, delivery and payment with you directly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-primary-900">Delivery Details</h2>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Phone (WhatsApp)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 080..."
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Delivery address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)}
                rows={3} placeholder="Street, area, city, state"
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-900 mb-1.5">Note (optional)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                rows={2} placeholder="Anything Nie should know — colour, size, preferred delivery time…"
                className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-luxury p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-primary-900 mb-5">Your Order</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const unit = item.product.price + (item.variant?.priceModifier || 0);
                  return (
                    <div key={item.id} className="flex justify-between gap-2 text-sm">
                      <span className="text-gray-600">
                        {item.product.name}
                        {item.variant && <span className="text-gray-400"> ({item.variant.value})</span>}
                        <span className="text-gray-400"> × {item.quantity}</span>
                      </span>
                      <span className="font-medium text-primary-900 whitespace-nowrap">
                        {formatPrice(unit * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-primary-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-primary-900'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-primary-900">Total</span>
                  <span className="font-display text-2xl font-bold text-primary-900">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button onClick={placeByEmail}
                  className="btn-primary w-full justify-center text-base py-3.5">
                  <Mail className="w-4.5 h-4.5" /> Order by Email
                </button>
                <button onClick={placeByWhatsApp}
                  className="btn-secondary w-full justify-center text-sm py-3">
                  <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                </button>
                <button onClick={() => { clearCart(); navigate('/products'); }}
                  className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors pt-1">
                  Clear cart
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Nie confirms every order personally before payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
