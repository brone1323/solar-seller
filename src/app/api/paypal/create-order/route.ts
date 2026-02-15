import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to .env.local');
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
    const { items, subtotal } = await request.json();

    if (!items?.length || subtotal === undefined) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'CAD',
            value: (subtotal / 100).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'CAD',
                value: (subtotal / 100).toFixed(2),
              },
            },
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
      return NextResponse.json({ error: `PayPal create order failed: ${err}` }, { status: 500 });
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
