'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
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
            <strong>WooCommerce Integration:</strong> When connected to WooCommerce, orders will sync automatically. For now, this is a demo checkout.
          </p>
          <Link
            href="/products"
            onClick={() => clearCart()}
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
                Continue to Payment
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold mb-6">Payment</h2>
              <p className="text-slate-400 mb-6">
                Payment gateway integration (Stripe, WooCommerce, etc.) will be connected here.
                For demo, clicking Place Order will complete the checkout.
              </p>
              <div className="rounded-lg bg-white/5 border border-white/10 p-4 mb-6">
                <p className="text-slate-400 text-sm">Card number</p>
                <p className="text-slate-500">•••• •••• •••• ••••</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg glass"
                >
                  Back
                </button>
                <button
                  onClick={() => setComplete(true)}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90"
                >
                  Place Order
                </button>
              </div>
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
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between font-bold">
                <span>Subtotal</span>
                <span className="text-solar-leaf">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
