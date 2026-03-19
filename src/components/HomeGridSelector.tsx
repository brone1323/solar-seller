/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

export function HomeGridSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const gridMode = useMemo(() => getGridMode(searchParams), [searchParams]);
  const batteryChem = useMemo(() => getBatteryChem(searchParams), [searchParams]);

  const setParams = (nextGrid: GridMode, nextBattery?: BatteryChem) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set('grid', nextGrid);
    if (nextGrid === 'off_grid') {
      next.set('battery', nextBattery ?? batteryChem);
    } else {
      next.delete('battery');
    }
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="glass rounded-3xl p-6 lg:p-8 mb-12">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold mb-1">Choose your system</h2>
          <p className="text-slate-400 text-sm">
            Select Off-grid vs On-grid, then Off-grid battery type.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => setParams('off_grid', 'lead_acid')}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            gridMode === 'off_grid' ? 'border-solar-leaf bg-solar-leaf/15 text-white' : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-200'
          }`}
        >
          Off grid
        </button>
        <button
          type="button"
          onClick={() => setParams('on_grid')}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            gridMode === 'on_grid' ? 'border-solar-leaf bg-solar-leaf/15 text-white' : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-200'
          }`}
        >
          On grid
        </button>
      </div>

      {gridMode === 'off_grid' && (
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setParams('off_grid', 'lead_acid')}
            className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
              batteryChem === 'lead_acid'
                ? 'border-solar-leaf bg-solar-leaf/15 text-white'
                : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-200'
            }`}
          >
            Lead acid
          </button>
          <button
            type="button"
            onClick={() => setParams('off_grid', 'lithium')}
            className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
              batteryChem === 'lithium'
                ? 'border-solar-leaf bg-solar-leaf/15 text-white'
                : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-200'
            }`}
          >
            Lithium
          </button>
        </div>
      )}
    </div>
  );
}

