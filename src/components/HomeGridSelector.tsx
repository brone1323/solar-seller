/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WifiOff, Wifi, Zap, Battery } from 'lucide-react';

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

const GRID_OPTIONS: { mode: GridMode; icon: typeof WifiOff; label: string; sub: string }[] = [
  {
    mode: 'off_grid',
    icon: WifiOff,
    label: 'Off-Grid',
    sub: 'Full independence from the utility grid — ideal for cabins, farms, or backup power.',
  },
  {
    mode: 'on_grid',
    icon: Wifi,
    label: 'On-Grid',
    sub: 'Sell excess power back to the grid and lower your monthly electricity bill.',
  },
];

const BATTERY_OPTIONS: { chem: BatteryChem; icon: typeof Battery; label: string; sub: string }[] = [
  {
    chem: 'lead_acid',
    icon: Battery,
    label: 'Lead Acid',
    sub: 'Proven, affordable technology — great for budget-conscious installs.',
  },
  {
    chem: 'lithium',
    icon: Zap,
    label: 'Lithium (LiFePO₄)',
    sub: 'Longer lifespan, lighter weight, and deeper discharge capability.',
  },
];

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
    <div className="glass rounded-3xl p-6 lg:p-8 mb-12 border border-white/10">
      {/* Header */}
      <div className="mb-6">
        <p className="section-label mb-1.5">Configure your system</p>
        <h2 className="font-display text-2xl font-bold tracking-tight">What kind of solar do you need?</h2>
        <p className="text-slate-400 text-sm mt-1">
          Choose your grid type, then select battery chemistry if going off-grid.
        </p>
      </div>

      {/* Grid type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {GRID_OPTIONS.map(({ mode, icon: Icon, label, sub }) => {
          const active = gridMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setParams(mode, mode === 'off_grid' ? batteryChem : undefined)}
              className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                active
                  ? 'border-solar-leaf/50 bg-solar-leaf/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  active ? 'bg-solar-leaf/20' : 'bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-solar-leaf' : 'text-slate-400'}`} />
              </div>
              <div>
                <div className={`font-semibold text-sm mb-0.5 transition-colors ${active ? 'text-white' : 'text-slate-300'}`}>
                  {label}
                  {active && (
                    <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-solar-leaf animate-pulse-glow" />
                  )}
                </div>
                <div className="text-slate-500 text-xs leading-relaxed">{sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Battery chemistry (off-grid only) */}
      {gridMode === 'off_grid' && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Battery Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BATTERY_OPTIONS.map(({ chem, icon: Icon, label, sub }) => {
              const active = batteryChem === chem;
              return (
                <button
                  key={chem}
                  type="button"
                  onClick={() => setParams('off_grid', chem)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    active
                      ? 'border-solar-sky/50 bg-solar-sky/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      active ? 'bg-solar-sky/20' : 'bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-solar-sky' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm mb-0.5 transition-colors ${active ? 'text-white' : 'text-slate-300'}`}>
                      {label}
                      {active && (
                        <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-solar-sky animate-pulse-glow" />
                      )}
                    </div>
                    <div className="text-slate-500 text-xs leading-relaxed">{sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
