import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settingsStorage';

export const dynamic = 'force-dynamic';

/** Public API: returns sale name and end date for popup/countdown */
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    saleActive: Boolean(settings.saleActive),
    saleName: settings.saleName || '',
    saleEndsAt: settings.saleEndsAt || '',
    saleDiscount: Number(settings.saleDiscount ?? 0),
  });
}
