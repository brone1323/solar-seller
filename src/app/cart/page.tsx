'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-slate-400 mb-8">Add some solar equipment to get started!</p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="glass rounded-xl p-4 flex gap-4"
            >
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.slug}`} className="font-semibold hover:text-solar-sky">
                  {product.name}
                </Link>
                <p className="text-slate-400 text-sm">{product.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="ml-2 p-1 rounded hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-solar-leaf">{formatPrice(product.price * quantity)}</p>
                <p className="text-slate-400 text-sm">{formatPrice(product.price)} each</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="glass rounded-xl p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Items ({totalItems})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span className="text-solar-leaf">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Taxes and shipping calculated at checkout
            </p>
            <Link
              href="/checkout"
              className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90 transition-opacity"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
