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
    const updates: { shippingDisabled?: boolean } = {};
    if (typeof body.shippingDisabled === 'boolean') updates.shippingDisabled = body.shippingDisabled;
    const settings = await setSettings(updates);
    return NextResponse.json(settings);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to update settings';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
