import { NextRequest, NextResponse } from 'next/server';
import { recordPageView } from '@/lib/pageViewStorage';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : '';
    const visitorId = typeof body.visitorId === 'string' ? body.visitorId.slice(0, 64) : '';
    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '';
    const title = typeof body.title === 'string' ? body.title.slice(0, 200) : '';
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : undefined;

    if (!sessionId || !path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    await recordPageView({
      sessionId,
      visitorId,
      path,
      title,
      at: new Date().toISOString(),
      referrer: referrer || undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('track POST error:', e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
