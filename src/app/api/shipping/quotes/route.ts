import { NextRequest, NextResponse } from 'next/server';

// Configurable via env vars (values in cents). Fallbacks for Canadian solar equipment.
const FREE_SHIPPING_THRESHOLD = parseInt(process.env.SHIPPING_FREE_THRESHOLD || '50000', 10); // $500
const STANDARD_RATE = parseInt(process.env.SHIPPING_STANDARD_RATE || '4900', 10); // $49
const EXPRESS_RATE = parseInt(process.env.SHIPPING_EXPRESS_RATE || '9900', 10); // $99

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

    const quotes: ShippingQuote[] = [];

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      quotes.push(
        { id: 'free', name: 'Free shipping', price: 0, estimatedDays: '7–10 business days' },
        { id: 'express', name: 'Express shipping', price: EXPRESS_RATE, estimatedDays: '2–3 business days' }
      );
    } else {
      quotes.push(
        { id: 'standard', name: 'Standard shipping', price: STANDARD_RATE, estimatedDays: '5–7 business days' },
        { id: 'express', name: 'Express shipping', price: EXPRESS_RATE, estimatedDays: '2–3 business days' }
      );
    }

    return NextResponse.json({ quotes });
  } catch (e) {
    console.error('Shipping quotes error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to get shipping quotes' },
      { status: 500 }
    );
  }
}
