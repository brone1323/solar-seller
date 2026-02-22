'use client';

import { useState, useEffect } from 'react';

interface SaleCountdownProps {
  endAt: string; // ISO date string
  className?: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function SaleCountdown({ endAt, className = '' }: SaleCountdownProps) {
  const [left, setLeft] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const end = new Date(endAt).getTime();
    const update = () => {
      const now = Date.now();
      if (now >= end) {
        setLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const d = Math.floor((end - now) / 86400000);
      const h = Math.floor(((end - now) % 86400000) / 3600000);
      const m = Math.floor(((end - now) % 3600000) / 60000);
      const s = Math.floor(((end - now) % 60000) / 1000);
      setLeft({ days: d, hours: h, mins: m, secs: s });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endAt]);

  if (left === null) return <span className={className}>-- : -- : -- : --</span>;
  if (left.days === 0 && left.hours === 0 && left.mins === 0 && left.secs === 0) {
    return <span className={className}>Sale ended</span>;
  }

  return (
    <span className={className}>
      {pad(left.days)}d {pad(left.hours)}h {pad(left.mins)}m {pad(left.secs)}s
    </span>
  );
}
