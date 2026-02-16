import { NextRequest, NextResponse } from 'next/server';

// Configurable via env var (value in cents). Default $500.
const DESIGN_PACKAGE_RATE = parseInt(process.env.SHIPPING_DESIGN_PACKAGE_RATE || '50000', 10);

export interface ShippingQuote {
  id: string;
  name: string;
  price: number; // cents
  estimatedDays?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { postalCode, province, subtotal } = await request.json();

    if (subtotal === undefined || subtotal < 0) {
      return NextResponse.json({ error: 'Invalid subtotal' }, { status: 400 });
    }

    const quotes: ShippingQuote[] = [
      {
        id: 'design-package',
        name: 'Shipped to your door with full design package within 3 weeks',
        price: DESIGN_PACKAGE_RATE,
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
