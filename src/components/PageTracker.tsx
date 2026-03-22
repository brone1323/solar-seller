'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    // Never track admin pages
    if (pathname.startsWith('/admin')) return;
    // Deduplicate (React StrictMode fires effects twice)
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    try {
      let visitorId = localStorage.getItem('sdiy_vid') ?? '';
      if (!visitorId) {
        visitorId = generateId();
        localStorage.setItem('sdiy_vid', visitorId);
      }
      let sessionId = sessionStorage.getItem('sdiy_sid') ?? '';
      if (!sessionId) {
        sessionId = generateId();
        sessionStorage.setItem('sdiy_sid', sessionId);
      }

      const payload = JSON.stringify({
        sessionId,
        visitorId,
        path: pathname,
        title: document.title,
        referrer: document.referrer || undefined,
      });

      // sendBeacon is fire-and-forget and survives page navigation
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // Tracking is non-critical — fail silently
    }
  }, [pathname]);

  return null;
}
