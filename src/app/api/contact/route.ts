import { NextRequest, NextResponse } from 'next/server';
import { appendActivity } from '@/lib/activityStorage';

export const dynamic = 'force-dynamic';

/** Send contact form: store message and optionally email via Resend */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const at = new Date().toISOString();
    await appendActivity({ type: 'contact', at, name, email, message });

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL_TO || 'info@solar-diy.com';
    const from = process.env.RESEND_FROM_EMAIL || 'Solar DIY <onboarding@resend.dev>';

    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Contact from Solar DIY: ${name}`,
          html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact POST error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to send message' },
      { status: 500 }
    );
  }
}
