import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSettings, setSettings } from '@/lib/settingsStorage';

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const updates: { shippingDisabled?: boolean; saleActive?: boolean; saleName?: string; saleEndsAt?: string } = {};
    if (typeof body.shippingDisabled === 'boolean') updates.shippingDisabled = body.shippingDisabled;
    if (typeof body.saleActive === 'boolean') updates.saleActive = body.saleActive;
    if (typeof body.saleName === 'string') updates.saleName = body.saleName.trim() || '';
    if (typeof body.saleEndsAt === 'string') updates.saleEndsAt = body.saleEndsAt.trim() || '';
    const settings = await setSettings(updates);
    return NextResponse.json(settings);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
