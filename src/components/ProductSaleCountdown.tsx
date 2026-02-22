'use client';

import { useState, useEffect } from 'react';
import { SaleCountdown } from './SaleCountdown';
import { Product } from '@/types';

export function ProductSaleCountdown({ product }: { product: Product }) {
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

  return (
    <p className="text-slate-400 text-sm mt-2">
      Sale ends in: <SaleCountdown endAt={saleEndsAt} className="font-semibold text-solar-leaf" />
    </p>
  );
}
