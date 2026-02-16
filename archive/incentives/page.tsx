'use client';

import { useState, useMemo } from 'react';
import { MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { canadianIncentives } from '@/data/incentives';
import type { CanadianIncentive } from '@/types';

const typeColors: Record<string, string> = {
  rebate: 'bg-solar-leaf/20 text-solar-leaf',
  loan: 'bg-solar-sky/20 text-solar-sky',
  'tax-credit': 'bg-accent-sun/20 text-accent-sun',
  financing: 'bg-solar-ocean/20 text-solar-ocean',
  grant: 'bg-solar-forest/20 text-solar-forest',
};

const provinces = ['All', 'Federal', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

export default function IncentivesPage() {
  const [filterProvince, setFilterProvince] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return canadianIncentives.filter((inc) => {
      const matchProvince = filterProvince === 'All' || inc.province === filterProvince;
      const matchSearch =
        !search ||
        inc.program.toLowerCase().includes(search.toLowerCase()) ||
        inc.location.toLowerCase().includes(search.toLowerCase());
      return matchProvince && matchSearch;
    });
  }, [filterProvince, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
          Solar Incentives in Canada
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Rebates, loans, tax credits, and financing available across provinces. Find what&apos;s available in your area.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search by program or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl glass border border-white/20"
        />
        <div className="flex flex-wrap gap-2">
          {provinces.map((p) => (
            <button
              key={p}
              onClick={() => setFilterProvince(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterProvince === p
                  ? 'bg-solar-sky text-white'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((inc) => (
          <IncentiveCard key={inc.id} incentive={inc} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 glass rounded-2xl">
          <MapPin className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No incentives match your filters. Try a different province or search term.</p>
        </div>
      )}

      <p className="text-slate-500 text-sm text-center mt-12">
        Incentive details and amounts may change. Always verify with official sources before applying.
      </p>
    </div>
  );
}

function IncentiveCard({ incentive }: { incentive: CanadianIncentive }) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-solar-sky/30 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex items-center gap-1 text-solar-sky font-medium">
              <MapPin className="w-4 h-4" />
              {incentive.location}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${typeColors[incentive.type] || 'glass'}`}>
              {incentive.type.replace('-', ' ')}
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">{incentive.program}</h3>
          <div className="flex items-center gap-2 text-solar-leaf font-semibold mb-3">
            <DollarSign className="w-5 h-5" />
            {incentive.amount}
          </div>
          <p className="text-slate-300 mb-2">{incentive.details}</p>
          <p className="text-slate-400 text-sm">
            <strong>Eligibility:</strong> {incentive.eligibility}
          </p>
        </div>
        {incentive.link && (
          <a
            href={incentive.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-solar-sky/20 text-solar-sky hover:bg-solar-sky/30 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" /> Learn more
          </a>
        )}
      </div>
    </div>
  );
}
