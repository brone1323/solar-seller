import { NextRequest, NextResponse } from 'next/server';
import { appendActivity, type ActivityEvent, type AddToCartEvent, type AbandonedCartEvent, type PurchaseEvent } from '@/lib/activityStorage';

function isValidAddToCart(body: unknown): body is AddToCartEvent {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as AddToCartEvent).type === 'add_to_cart' &&
    typeof (body as AddToCartEvent).productId === 'string' &&
    typeof (body as AddToCartEvent).productName === 'string' &&
    typeof (body as AddToCartEvent).quantity === 'number' &&
    (body as AddToCartEvent).quantity >= 1
  );
}

function isValidAbandonedCart(body: unknown): body is AbandonedCartEvent {
  const b = body as AbandonedCartEvent;
  if (typeof body !== 'object' || body === null || b.type !== 'abandoned_cart') return false;
  if (!Array.isArray(b.items) || b.items.length === 0) return false;
  return typeof b.subtotalCents === 'number';
}

function isValidPurchase(body: unknown): body is PurchaseEvent {
  const b = body as PurchaseEvent;
  if (typeof body !== 'object' || body === null || b.type !== 'purchase') return false;
  if (!Array.isArray(b.items)) return false;
  for (const it of b.items) {
    if (typeof it.productId !== 'string' || typeof it.name !== 'string' || typeof it.quantity !== 'number' || typeof it.priceCents !== 'number') return false;
  }
  return (
    typeof b.subtotalCents === 'number' &&
    typeof b.shippingCents === 'number' &&
    typeof b.totalCents === 'number' &&
    typeof b.gstCents === 'number'
  );
}

/** Record add-to-cart or purchase (no auth; called from storefront) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const at = new Date().toISOString();

    let event: ActivityEvent;

    if (isValidAddToCart(body)) {
      event = {
        type: 'add_to_cart',
        at,
        productId: body.productId,
        productName: body.productName,
        quantity: body.quantity,
      };
    } else if (isValidAbandonedCart(body)) {
      event = {
        type: 'abandoned_cart',
        at,
        items: (body as AbandonedCartEvent).items,
        subtotalCents: (body as AbandonedCartEvent).subtotalCents,
      };
    } else if (isValidPurchase(body)) {
      event = {
        type: 'purchase',
        at,
        email: typeof body.email === 'string' ? body.email : undefined,
        firstName: typeof body.firstName === 'string' ? body.firstName : undefined,
        lastName: typeof body.lastName === 'string' ? body.lastName : undefined,
        address: typeof body.address === 'string' ? body.address : undefined,
        city: typeof body.city === 'string' ? body.city : undefined,
        province: typeof body.province === 'string' ? body.province : undefined,
        postalCode: typeof body.postalCode === 'string' ? body.postalCode : undefined,
        items: body.items,
        subtotalCents: body.subtotalCents,
        shippingCents: body.shippingCents,
        gstCents: body.gstCents,
        totalCents: body.totalCents,
        paypalOrderId: typeof body.paypalOrderId === 'string' ? body.paypalOrderId : undefined,
      };
    } else {
      return NextResponse.json({ error: 'Invalid event: need type "add_to_cart", "abandoned_cart", or "purchase" with required fields' }, { status: 400 });
    }

    await appendActivity(event);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Activity POST error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to record activity' },
      { status: 500 }
    );
  }
}
