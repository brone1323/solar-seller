import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settingsStorage';

export const dynamic = 'force-dynamic';

/** Public: WhatsApp and phone for live chat (no auth) */
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    whatsappNumber: settings.whatsappNumber || '',
    phoneNumber: settings.phoneNumber || '',
  });
}
