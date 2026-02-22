'use client';

import { useState, useEffect } from 'react';
import { SaleCountdown } from './SaleCountdown';
import { Product } from '@/types';

interface ProductSaleCountdownProps {
  product: Product;
  /** When true, countdown is shown large above the price block */
  size?: 'default' | 'large';
}

export function ProductSaleCountdown({ product, size = 'default' }: ProductSaleCountdownProps) {
  const [saleEndsAt, setSaleEndsAt] = useState<string | null>(null);

  useEffect(() => {
    if (!(product.regularPrice != null && product.regularPrice > product.price)) return;
    fetch('/api/sale')
      .then((r) => r.json())
      .then((data) => {
        const endsAt = (data.saleEndsAt || '').trim();
        if (endsAt && new Date(endsAt) > new Date()) setSaleEndsAt(endsAt);
      })
      .catch(() => {});
  }, [product.regularPrice, product.price]);

  if (!saleEndsAt) return null;

  if (size === 'large') {
    return (
      <div className="mb-6 p-6 rounded-2xl bg-solar-leaf/10 border border-solar-leaf/30">
        <p className="text-slate-400 text-sm mb-2">Sale ends in</p>
        <p className="font-mono text-3xl sm:text-4xl font-bold text-solar-leaf tabular-nums">
          <SaleCountdown endAt={saleEndsAt} />
        </p>
      </div>
    );
  }

  return (
    <p className="text-slate-400 text-sm mt-2">
      Sale ends in: <SaleCountdown endAt={saleEndsAt} className="font-semibold text-solar-leaf" />
    </p>
  );
}
