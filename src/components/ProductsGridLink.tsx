'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

type GridMode = 'off_grid' | 'on_grid';
type BatteryChem = 'lead_acid' | 'lithium';

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

export function ProductsGridLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();

  const href = useMemo(() => {
    const grid = getGridMode(searchParams);
    const battery = getBatteryChem(searchParams);
    const query = new URLSearchParams();
    query.set('grid', grid);
    if (grid === 'off_grid') query.set('battery', battery);
    return `/products?${query.toString()}`;
  }, [searchParams]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

