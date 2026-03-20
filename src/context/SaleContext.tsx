'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SaleState {
  saleActive: boolean;
  saleDiscount: number; // 0-100
}

const SaleContext = createContext<SaleState>({ saleActive: false, saleDiscount: 0 });

export function SaleProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SaleState>({ saleActive: false, saleDiscount: 0 });

  useEffect(() => {
    fetch('/api/sale', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const active = Boolean(data.saleActive);
        const endsAt = (data.saleEndsAt || '').trim();
        const stillRunning = endsAt ? new Date(endsAt) > new Date() : false;
        setState({
          saleActive: active && stillRunning,
          saleDiscount: Number(data.saleDiscount ?? 0),
        });
      })
      .catch(() => {});
  }, []);

  return <SaleContext.Provider value={state}>{children}</SaleContext.Provider>;
}

export function useSale() {
  return useContext(SaleContext);
}
