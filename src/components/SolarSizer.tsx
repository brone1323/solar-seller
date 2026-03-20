'use client';

import { useState } from 'react';
import { Product } from '@/types';
import Link from 'next/link';
import { Zap, MapPin, DollarSign, ChevronRight, Sun } from 'lucide-react';

const PROVINCE_RATES: Record<string, { rate: number; yield: number; label: string }> = {
  ON: { rate: 0.18, yield: 1150, label: 'Ontario' },
  BC: { rate: 0.14, yield: 1300, label: 'British Columbia' },
  AB: { rate: 0.17, yield: 1400, label: 'Alberta' },
  QC: { rate: 0.07, yield: 1100, label: 'Quebec' },
  SK: { rate: 0.19, yield: 1450, label: 'Saskatchewan' },
  MB: { rate: 0.10, yield: 1200, label: 'Manitoba' },
  NS: { rate: 0.22, yield: 1050, label: 'Nova Scotia' },
  NB: { rate: 0.14, yield: 1050, label: 'New Brunswick' },
  PE: { rate: 0.20, yield: 1050, label: 'PEI' },
  NL: { rate: 0.13, yield: 1000, label: 'Newfoundland' },
};

interface SolarSizerProps {
  products: Product[];
}

export function SolarSizer({ products }: SolarSizerProps) {
  const [open, setOpen] = useState(true);
  const [province, setProvince] = useState('ON');
  const [monthlyBill, setMonthlyBill] = useState('');
  const [results, setResults] = useState<{ kwNeeded: number; annualKwh: number; recommendations: Product[] } | null>(null);

  const calculate = () => {
    const bill = parseFloat(monthlyBill);
    if (!bill || bill <= 0) return;

    const { rate, yield: pvYield } = PROVINCE_RATES[province];
    const annualKwh = Math.round((bill / rate) * 12);
    const kwNeeded = Math.round((annualKwh / pvYield) * 10) / 10;

    // Match products by kW spec in their specifications or name
    const scored = products
      .filter((p) => p.category === 'Solar Kits' || p.name.toLowerCase().includes('kit'))
      .map((p) => {
        const specs = Object.values(p.specifications || {}).join(' ').toLowerCase();
        const name = p.name.toLowerCase();
        // Extract kW from specs or name
        const kwMatch = (specs + ' ' + name).match(/(\d+(?:\.\d+)?)\s*kw/i);
        const productKw = kwMatch ? parseFloat(kwMatch[1]) : null;
        const diff = productKw !== null ? Math.abs(productKw - kwNeeded) : 999;
        return { product: p, productKw, diff };
      })
      .filter((x) => x.productKw !== null)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
      .map((x) => x.product);

    // If no kW-matched kits found, just show all solar kits
    const recommendations = scored.length > 0
      ? scored
      : products.filter((p) => p.category === 'Solar Kits').slice(0, 3);

    setResults({ kwNeeded, annualKwh, recommendations });
  };

  return (
    <div className="mb-12 rounded-2xl overflow-hidden border border-solar-sky/20 bg-gradient-to-br from-solar-sky/5 to-solar-leaf/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-solar-sky/15 border border-solar-sky/20 flex items-center justify-center flex-shrink-0">
            <Sun className="w-5 h-5 text-solar-sky" />
          </div>
          <div>
            <p className="font-semibold text-white">Not sure how much solar you need?</p>
            <p className="text-sm text-slate-400">Enter your location and monthly bill — we'll suggest the right kit for you.</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/[0.06]">
          <div className="pt-5 grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />Province
              </label>
              <select
                value={province}
                onChange={(e) => { setProvince(e.target.value); setResults(null); }}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-solar-sky/50 focus:ring-1 focus:ring-solar-sky/20"
              >
                {Object.entries(PROVINCE_RATES).map(([code, { label }]) => (
                  <option key={code} value={code} className="bg-solar-dark">{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                <DollarSign className="w-3.5 h-3.5 inline mr-1" />Avg Monthly Bill (CAD)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 180"
                value={monthlyBill}
                onChange={(e) => { setMonthlyBill(e.target.value); setResults(null); }}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm outline-none focus:border-solar-sky/50 focus:ring-1 focus:ring-solar-sky/20 placeholder:text-slate-600"
              />
            </div>
            <button
              onClick={calculate}
              disabled={!monthlyBill || parseFloat(monthlyBill) <= 0}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Find My Kit
            </button>
          </div>

          {results && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-4 mb-5">
                <div className="glass rounded-xl px-5 py-3 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Estimated annual usage</p>
                  <p className="font-bold text-white text-lg">{results.annualKwh.toLocaleString()} <span className="text-slate-400 font-normal text-sm">kWh/year</span></p>
                </div>
                <div className="glass rounded-xl px-5 py-3 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Recommended system size</p>
                  <p className="font-bold text-solar-leaf text-lg">{results.kwNeeded} <span className="text-slate-400 font-normal text-sm">kW</span></p>
                </div>
                <div className="glass rounded-xl px-5 py-3 border border-solar-sky/20 bg-solar-sky/5">
                  <p className="text-xs text-slate-400 mb-1">{PROVINCE_RATES[province].label} avg rate</p>
                  <p className="font-bold text-solar-sky text-lg">${PROVINCE_RATES[province].rate} <span className="text-slate-400 font-normal text-sm">/kWh</span></p>
                </div>
              </div>

              {results.recommendations.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-slate-300 mb-3">Recommended kits for your consumption:</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {results.recommendations.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="glass rounded-xl p-4 border border-white/10 hover:border-solar-leaf/30 hover:bg-solar-leaf/5 transition-all group"
                      >
                        {p.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt={p.name} className="w-full aspect-video object-cover rounded-lg mb-3" />
                        )}
                        <p className="font-semibold text-white text-sm group-hover:text-solar-leaf transition-colors">{p.name}</p>
                        <p className="text-solar-leaf font-bold mt-1">
                          {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(p.price / 100)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-sm">No kits matched exactly — <Link href="#" className="text-solar-sky hover:underline">browse all products</Link> or contact us for a custom recommendation.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
