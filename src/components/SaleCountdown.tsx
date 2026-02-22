'use client';

import { useState, useEffect } from 'react';

interface SaleCountdownProps {
  endAt: string; // ISO date string
  className?: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function getRemaining(endAt: string): { days: number; hours: number; mins: number; secs: number } {
  const end = new Date(endAt).getTime();
  const now = Date.now();
  if (now >= end) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const ms = end - now;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { days: d, hours: h, mins: m, secs: s };
}

export function SaleCountdown({ endAt, className = '' }: SaleCountdownProps) {
  const [left, setLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>(() => getRemaining(endAt));

  useEffect(() => {
    const update = () => setLeft(getRemaining(endAt));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [endAt]);

  if (left.days === 0 && left.hours === 0 && left.mins === 0 && left.secs === 0) {
    return <span className={className}>Sale ended</span>;
  }

  return (
    <span className={className}>
      {pad(left.days)}d {pad(left.hours)}h {pad(left.mins)}m {pad(left.secs)}s
    </span>
  );
}
