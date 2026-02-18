import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'PayPal credentials not configured. Add PAYPAL_CLIENT_SECRET to Vercel env vars. ' +
      'PAYPAL_CLIENT_ID is optional if NEXT_PUBLIC_PAYPAL_CLIENT_ID is set.'
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { items, subtotal, shipping = 0, gst = 0 } = await request.json();

    if (!items?.length || subtotal === undefined) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    const shippingVal = Math.max(0, Number(shipping) || 0);
    const gstVal = Math.max(0, Number(gst) || 0);
    const totalCents = subtotal + shippingVal + gstVal;
    const total = (totalCents / 100).toFixed(2);
    const itemTotal = (subtotal / 100).toFixed(2);
    const shippingTotal = (shippingVal / 100).toFixed(2);
    const taxTotal = (gstVal / 100).toFixed(2);

    const accessToken = await getAccessToken();

    const breakdown: Record<string, { currency_code: string; value: string }> = {
      item_total: { currency_code: 'CAD', value: itemTotal },
    };
    if (shippingVal > 0) {
      breakdown.shipping = { currency_code: 'CAD', value: shippingTotal };
    }
    if (gstVal > 0) {
      breakdown.tax_total = { currency_code: 'CAD', value: taxTotal };
    }

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'CAD',
            value: total,
            breakdown,
          },
          items: items.map(({ product, quantity }: { product: { name: string; price: number }; quantity: number }) => ({
            name: product.name,
            quantity: String(quantity),
            unit_amount: {
              currency_code: 'CAD',
              value: (product.price / 100).toFixed(2),
            },
          })),
        },
      ],
    };

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      const hint = res.status === 401 || res.status === 404
        ? ' Check PAYPAL_CLIENT_SECRET and PAYPAL_MODE in Vercel (live vs sandbox).'
        : '';
      return NextResponse.json(
        { error: `PayPal create order failed: ${err}${hint}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ orderID: data.id });
  } catch (e) {
    console.error('PayPal create order error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
