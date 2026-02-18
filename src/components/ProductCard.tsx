'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { ShareButton } from './ShareButton';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const imgs = product.images?.filter(Boolean) || [];
  const [imgIndex, setImgIndex] = useState(0);
  const displayImg = imgs[imgIndex] || imgs[0] || '/placeholder.svg';
  const hasMultiple = imgs.length > 1;

  return (
    <div className="group glass rounded-2xl overflow-hidden hover:border-solar-sky/50 transition-all duration-300 hover:shadow-xl hover:shadow-solar-sky/10">
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="relative aspect-square bg-solar-deep/50 overflow-hidden"
          onMouseEnter={() => hasMultiple && setImgIndex((i) => (i + 1) % imgs.length)}
        >
          <Image
            src={displayImg}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
          {product.featured && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-md bg-solar-leaf text-xs font-bold">
              Featured
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <span className="text-solar-sky text-sm font-medium">{product.category}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display font-semibold text-lg mt-1 group-hover:text-solar-sky transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display font-bold text-xl text-solar-leaf">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-2">
            <div onClick={(e) => e.stopPropagation()}>
              <ShareButton url={`/products/${product.slug}`} className="p-2" size="sm" />
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-solar-sky to-solar-leaf hover:opacity-90 transition-opacity font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
