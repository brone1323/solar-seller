'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { PayPalCheckout } from '@/components/PayPalCheckout';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

interface ShippingQuote {
  id: string;
  name: string;
  price: number;
  estimatedDays?: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const handlePayPalSuccess = () => {
    setComplete(true);
    clearCart();
  };
  const [step, setStep] = useState(1);
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingQuote | null>(null);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
  });
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (step !== 2) return;
    setQuotesLoading(true);
    setQuotes([]);
    setSelectedShipping(null);
    fetch('/api/shipping/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postalCode: form.postalCode,
        province: form.province,
        subtotal,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.quotes?.length) {
          setQuotes(data.quotes);
          setSelectedShipping(data.quotes[0]);
        }
      })
      .catch(() => setQuotes([]))
      .finally(() => setQuotesLoading(false));
  }, [step, form.postalCode, form.province, subtotal]);

  if (items.length === 0 && !complete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Nothing to Checkout</h1>
        <p className="text-slate-400 mb-8">Your cart is empty. Add items to proceed.</p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="glass rounded-2xl p-12">
          <h1 className="font-display text-3xl font-bold mb-4 text-solar-leaf">Order Received!</h1>
          <p className="text-slate-300 mb-8">
            Thank you for your order. We&apos;ll send a confirmation to {form.email}.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Your order has been paid via PayPal. You&apos;ll receive a confirmation email from PayPal shortly.
          </p>
          <Link
            href="/products"
            className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          {step === 1 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold mb-6">Contact Information</h2>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 mb-4"
              />
              <h2 className="font-display text-xl font-semibold mt-8 mb-6">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20"
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 mt-4"
              />
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20"
                />
                <select
                  value={form.province}
                  onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
                  className="px-4 py-3 rounded-lg bg-white/10 border border-white/20"
                >
                  <option value="">Province</option>
                  <option>AB</option>
                  <option>BC</option>
                  <option>MB</option>
                  <option>NB</option>
                  <option>NL</option>
                  <option>NS</option>
                  <option>NT</option>
                  <option>NU</option>
                  <option>ON</option>
                  <option>PE</option>
                  <option>QC</option>
                  <option>SK</option>
                  <option>YT</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Postal code"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                className="w-full sm:w-1/3 px-4 py-3 rounded-lg bg-white/10 border border-white/20 mt-4"
              />
              <button
                onClick={() => setStep(2)}
                className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90"
              >
                Continue to Shipping
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold mb-2">Shipping</h2>
              <p className="text-slate-400 mb-6">
                Choose a shipping method for your order.
              </p>
              {quotesLoading ? (
                <p className="text-slate-400 py-8 text-center">Loading shipping options…</p>
              ) : quotes.length === 0 ? (
                <p className="text-amber-200/80 text-sm py-4">No shipping options. Check your address.</p>
              ) : (
                <div className="space-y-3 mb-6">
                  {quotes.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedShipping(q)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        selectedShipping?.id === q.id
                          ? 'border-solar-leaf bg-solar-leaf/10'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{q.name}</span>
                        <span className="text-solar-leaf">{formatPrice(q.price)}</span>
                      </div>
                      {q.estimatedDays && (
                        <p className="text-slate-400 text-sm mt-1">{q.estimatedDays}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => setStep(3)}
                disabled={!selectedShipping}
                className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 w-full py-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Address
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold mb-2">Payment</h2>
              <p className="text-slate-400 mb-6">
                Pay securely with your PayPal account.
              </p>
              <div className="mb-6 rounded-xl overflow-hidden">
                <PayPalCheckout
                  onSuccess={handlePayPalSuccess}
                  shippingCost={selectedShipping?.price ?? 0}
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Shipping
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="glass rounded-xl p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-slate-300">
                    {product.name} × {quantity}
                  </span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {step >= 2 && selectedShipping && (
                <div className="flex justify-between text-sm">
                  <span>Shipping ({selectedShipping.name})</span>
                  <span>{formatPrice(selectedShipping.price)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span className="text-solar-leaf">
                  {formatPrice(subtotal + (selectedShipping?.price ?? 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
