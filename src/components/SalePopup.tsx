'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { SaleCountdown } from './SaleCountdown';

const POPUP_DISMISS_PREFIX = 'solar_sale_popup_dismissed_';

export function SalePopup() {
  const [sale, setSale] = useState<{ saleName: string; saleEndsAt: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/sale')
      .then((r) => r.json())
      .then((data) => {
        const name = (data.saleName || '').trim() || 'Sale';
        const endsAt = (data.saleEndsAt || '').trim();
        if (endsAt && new Date(endsAt) > new Date()) {
          const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem(POPUP_DISMISS_PREFIX + endsAt) : null;
          setSale({ saleName: name, saleEndsAt: endsAt });
          setVisible(!dismissed);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    if (sale?.saleEndsAt) sessionStorage.setItem(POPUP_DISMISS_PREFIX + sale.saleEndsAt, '1');
    setVisible(false);
  };

  if (!visible || !sale) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass rounded-2xl border border-solar-leaf/30 max-w-md w-full p-8 relative shadow-xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display text-2xl font-bold text-solar-leaf mb-2">{sale.saleName}</h2>
        <p className="text-slate-300 text-sm mb-4">Sale ends in:</p>
        <p className="font-mono text-xl font-bold text-white mb-6">
          <SaleCountdown endAt={sale.saleEndsAt} />
        </p>
        <Link
          href="/products"
          onClick={dismiss}
          className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90"
        >
          Shop sale
        </Link>
      </div>
    </div>
  );
}
