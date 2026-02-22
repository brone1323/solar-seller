'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SaleCountdown } from './SaleCountdown';

/** Bar at top of every page showing sale countdown when a sale is active */
export function SaleBanner() {
  const [saleEndsAt, setSaleEndsAt] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/sale')
      .then((r) => r.json())
      .then((data) => {
        const endsAt = (data.saleEndsAt || '').trim();
        if (endsAt && new Date(endsAt) > new Date()) setSaleEndsAt(endsAt);
      })
      .catch(() => {});
  }, []);

  if (!saleEndsAt) return null;

  return (
    <div className="bg-gradient-to-r from-solar-sky/90 to-solar-leaf/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm">
        <span className="font-semibold">Sale on now</span>
        <span className="font-mono font-bold tabular-nums">
          <SaleCountdown endAt={saleEndsAt} className="text-white" />
        </span>
        <Link href="/products" className="underline font-medium hover:no-underline">
          Shop sale →
        </Link>
      </div>
    </div>
  );
}
