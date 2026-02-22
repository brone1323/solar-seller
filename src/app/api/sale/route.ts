import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settingsStorage';

/** Public API: returns sale name and end date for popup/countdown */
export async function GET() {
  const settings = await getSettings();
  let saleName = settings.saleName || '';
  let saleEndsAt = settings.saleEndsAt || '';

  // In development, if no sale is configured, return a demo sale so popup and countdown are visible
  if (!saleEndsAt && process.env.NODE_ENV === 'development') {
    const demoEnd = new Date(Date.now() + 24 * 60 * 60 * 1000);
    saleName = saleName || 'Sale';
    saleEndsAt = demoEnd.toISOString();
  }

  return NextResponse.json({
    saleName,
    saleEndsAt,
  });
}
