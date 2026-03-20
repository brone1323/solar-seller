'use client';

import { useSale } from '@/context/SaleContext';

function fmt(cents: number) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);
}

export function ProductPrice({ price }: { price: number }) {
  const { saleActive, saleDiscount } = useSale();
  const onSale = saleActive && saleDiscount > 0;
  const salePrice = onSale ? Math.round(price * (1 - saleDiscount / 100)) : price;

  if (onSale) {
    return (
      <div>
        <p className="text-slate-400 line-through text-xl">{fmt(price)}</p>
        <p className="text-3xl font-bold text-solar-leaf">{fmt(salePrice)}</p>
      </div>
    );
  }

  return <p className="text-3xl font-bold text-solar-leaf">{fmt(price)}</p>;
}
