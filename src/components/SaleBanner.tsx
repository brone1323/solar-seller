'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SaleCountdown } from './SaleCountdown';

/** Bar at top of every page showing sale countdown when a sale is active */
export function SaleBanner() {
  const [sale, setSale] = useState<{ saleName: string; saleEndsAt: string } | null>(null);

  useEffect(() => {
    fetch('/api/sale', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const endsAt = (data.saleEndsAt || '').trim();
        const name = (data.saleName || '').trim();
        if (endsAt && new Date(endsAt) > new Date()) {
          setSale({ saleName: name || 'Sale', saleEndsAt: endsAt });
        }
      })
      .catch(() => {});
  }, []);

  if (!sale) return null;

  return (
    <div className="bg-gradient-to-r from-solar-sky/90 to-solar-leaf/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <span className="font-semibold">{sale.saleName}</span>
        <span className="font-mono text-lg sm:text-xl font-bold tabular-nums">
          <SaleCountdown endAt={sale.saleEndsAt} className="text-white" />
        </span>
        <Link href="/products" className="underline font-medium hover:no-underline">
          Shop sale →
        </Link>
      </div>
    </div>
  );
}
