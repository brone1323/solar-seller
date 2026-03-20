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
        if (data.saleActive && endsAt && new Date(endsAt) > new Date()) {
          setSale({ saleName: name || 'Sale', saleEndsAt: endsAt });
        }
      })
      .catch(() => {});
  }, []);

  if (!sale) return null;

  return (
    <div className="bg-gradient-to-r from-solar-sky via-solar-leaf/80 to-solar-leaf text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center">
          <span className="font-bold tracking-wide">{sale.saleName}</span>
          <span className="hidden sm:inline text-white/50">·</span>
          <span className="text-sm font-medium text-white/90">🚚 Free shipping · Racking included · While quantities last</span>
          <span className="hidden sm:inline text-white/50">·</span>
          <span className="font-mono text-base font-bold tabular-nums opacity-90">
            <SaleCountdown endAt={sale.saleEndsAt} className="text-white" />
          </span>
          <Link href="/#kits" className="underline font-semibold text-sm hover:no-underline whitespace-nowrap">
            Shop now →
          </Link>
        </div>
      </div>
    </div>
  );
}
