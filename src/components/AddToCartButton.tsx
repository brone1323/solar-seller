'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold text-lg hover:opacity-90 transition-opacity"
    >
      <ShoppingCart className="w-6 h-6" />
      Add to Cart
    </button>
  );
}
