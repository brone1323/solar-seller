'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

type GridMode = 'off_grid' | 'on_grid';
type BatteryChem = 'lead_acid' | 'lithium';

const GRID_TYPE_SPEC_KEY = 'Grid Type';
const BATTERY_TYPE_SPEC_KEY = 'Battery Type';

function getGridMode(searchParams: URLSearchParams): GridMode {
  const v = searchParams.get('grid');
  if (v === 'on_grid' || v === 'off_grid') return v;
  return 'off_grid';
}

function getBatteryChem(searchParams: URLSearchParams): BatteryChem {
  const v = searchParams.get('battery');
  if (v === 'lithium' || v === 'lead_acid') return v;
  return 'lead_acid';
}

export function FeaturedKitsGrid({ featuredProducts }: { featuredProducts: Product[] }) {
  const searchParams = useSearchParams();

  const { gridMode, batteryChem } = useMemo(() => {
    const gridMode = getGridMode(searchParams);
    const batteryChem = getBatteryChem(searchParams);
    return { gridMode, batteryChem };
  }, [searchParams]);

  const filtered = useMemo(() => {
    return featuredProducts.filter((p) => {
      // Only filter Solar Kits; other featured equipment stays visible.
      if (p.category !== 'Solar Kits') return true;

      // Backward-compatible behavior:
      // If a kit hasn't been labeled with Grid Type yet, do NOT hide it
      // (otherwise the On-grid side can look empty while you're updating kits).
      const rawGridType = p.specifications?.[GRID_TYPE_SPEC_KEY] as GridMode | undefined;
      if (!rawGridType) return true;

      if (gridMode === 'on_grid') return rawGridType === 'on_grid';

      const batteryType =
        (p.specifications?.[BATTERY_TYPE_SPEC_KEY] as BatteryChem | undefined) ?? 'lead_acid';
      return rawGridType === 'off_grid' && batteryType === batteryChem;
    });
  }, [featuredProducts, gridMode, batteryChem]);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {filtered.length === 0 && (
        <div className="col-span-full text-center py-10 text-slate-400">
          No kits found for your selection.
        </div>
      )}
    </div>
  );
}

