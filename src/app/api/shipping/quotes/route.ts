import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/settingsStorage';

// Configurable via env var (value in cents). Default $500.
const DESIGN_PACKAGE_RATE = (() => {
  const n = parseInt(process.env.SHIPPING_DESIGN_PACKAGE_RATE || '50000', 10);
  return Number.isFinite(n) && n >= 0 ? n : 50000;
})();

export interface ShippingQuote {
  id: string;
  name: string;
  price: number; // cents
  estimatedDays?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const subtotal = typeof body.subtotal === 'number' && body.subtotal >= 0
      ? body.subtotal
      : 0;

    const settings = await getSettings();
    const price = settings.shippingDisabled ? 0 : DESIGN_PACKAGE_RATE;
    const name = settings.shippingDisabled
      ? 'Free shipping (test mode)'
      : 'Shipped to your door with full design package within 3 weeks';

    const quotes: ShippingQuote[] = [
      {
        id: 'design-package',
        name,
        price,
        estimatedDays: 'Within 3 weeks',
      },
    ];

    return NextResponse.json({ quotes });
  } catch (e) {
    console.error('Shipping quotes error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to get shipping quotes' },
      { status: 500 }
    );
  }
}
