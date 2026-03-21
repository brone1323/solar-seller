'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Check } from 'lucide-react';
import { ShareButton } from './ShareButton';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useSale } from '@/context/SaleContext';
import { useState, useRef } from 'react';

interface ProductCardProps {
  product: Product;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

function savingsPercent(regular: number, sale: number) {
  return Math.round(((regular - sale) / regular) * 100);
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { saleActive, saleDiscount } = useSale();
  const imgs = product.images?.filter(Boolean) || [];
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const displayImg = imgs[imgIndex] || imgs[0] || '/placeholder.svg';
  const hasMultiple = imgs.length > 1;

  const onSale = saleActive && saleDiscount > 0;
  const salePrice = onSale ? Math.round(product.price * (1 - saleDiscount / 100)) : product.price;
  const savings = onSale ? saleDiscount : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(onSale ? { ...product, price: salePrice } : product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group glass-card overflow-hidden flex flex-col">
      {/* Image area */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div
          className="relative aspect-[4/3] bg-solar-deep/40 overflow-hidden"
          onMouseEnter={() => {
            if (!hasMultiple) return;
            cycleRef.current = setInterval(() => setImgIndex((i) => (i + 1) % imgs.length), 800);
          }}
          onMouseLeave={() => {
            if (cycleRef.current) clearInterval(cycleRef.current);
            setImgIndex(0);
          }}
        >
          <Image
            src={displayImg}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Bottom overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="badge-leaf text-[10px]">★ Featured</span>
            )}
            {onSale && (
              <span className="badge-amber text-[10px]">Save {savings}%</span>
            )}
          </div>

          {/* Image dots */}
          {hasMultiple && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`transition-all duration-200 rounded-full ${
                    i === imgIndex ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Info area */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-solar-sky text-xs font-bold uppercase tracking-wider">{product.category}</span>
        <p className="text-solar-leaf text-xs font-medium mt-1">✓ Every kit includes your racking and mounts</p>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display font-bold text-base mt-1.5 group-hover:text-solar-sky transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed flex-1">{product.description}</p>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-5 gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            {onSale ? (
              <>
                <span className="text-slate-500 text-xs line-through">{formatPrice(product.price)}</span>
                <span className="font-display font-bold text-xl text-solar-leaf leading-none">
                  {formatPrice(salePrice)}
                </span>
              </>
            ) : (
              <span className="font-display font-bold text-xl text-solar-leaf leading-none">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-slate-600 text-[10px] font-medium">CAD incl. tax</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div onClick={(e) => e.stopPropagation()}>
              <ShareButton url={`/products/${product.slug}`} className="p-2 opacity-60 hover:opacity-100 transition-opacity" size="sm" />
            </div>
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                added
                  ? 'bg-solar-leaf/20 border border-solar-leaf/40 text-solar-leaf'
                  : 'btn-solar text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
