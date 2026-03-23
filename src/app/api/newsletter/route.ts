import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic';

const REDIS_KEY = 'solar:newsletter';

interface Subscriber {
  name: string;
  email: string;
  subscribedAt: string;
}

async function getSubscribers(): Promise<Subscriber[]> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) return [];
  try {
    const redis = new Redis({ url: redisUrl, token: redisToken });
    const data = await redis.get(REDIS_KEY);
    if (data == null) return [];
    const arr = typeof data === 'string' ? JSON.parse(data) : data;
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) throw new Error('No storage configured.');
  const redis = new Redis({ url: redisUrl, token: redisToken });
  await redis.set(REDIS_KEY, JSON.stringify(subscribers));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    let stored = false;
    try {
      const subscribers = await getSubscribers();
      const alreadyExists = subscribers.some((s) => s.email === email);
      if (!alreadyExists) {
        subscribers.push({ name, email, subscribedAt: new Date().toISOString() });
        await saveSubscribers(subscribers);
      }
      stored = true;
    } catch (err) {
      console.error('Newsletter storage error:', err);
    }

    // Send notification email via Resend if configured
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL_TO || 'info@solar-diy.com';
    const from = process.env.RESEND_FROM_EMAIL || 'Solar DIY <onboarding@resend.dev>';

    if (apiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject: `New newsletter subscriber: ${name}`,
            html: `<p><strong>${name}</strong> (${email}) just subscribed to the Solar DIY newsletter.</p>`,
          }),
        });
      } catch (emailErr) {
        console.error('Newsletter notification email error:', emailErr);
      }
    }

    if (!stored) {
      return NextResponse.json(
        { error: 'Unable to save your subscription right now. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Newsletter POST error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  // Admin-only endpoint to export subscribers
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    return NextResponse.json({ subscribers: [] });
  }
  try {
    const subscribers = await getSubscribers();
    subscribers.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
    return NextResponse.json({ subscribers, count: subscribers.length });
  } catch {
    return NextResponse.json({ subscribers: [], count: 0 });
  }
}
