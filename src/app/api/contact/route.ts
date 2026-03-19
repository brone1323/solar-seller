import { NextRequest, NextResponse } from 'next/server';
import { appendActivity } from '@/lib/activityStorage';

export const dynamic = 'force-dynamic';

/** Send contact form: store message and/or email via Resend. Works even if storage isn't configured. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const at = new Date().toISOString();
    let stored = false;
    try {
      await appendActivity({ type: 'contact', at, name: name || '—', email: email || '—', message });
      stored = true;
    } catch (storageErr) {
      console.error('Contact storage error (Redis/Blob may be missing):', storageErr);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_EMAIL_TO || 'info@solar-diy.ca';
    const from = process.env.RESEND_FROM_EMAIL || 'Solar DIY <onboarding@resend.dev>';

    if (apiKey) {
      const subject = name || email ? `Chat from Solar DIY: ${name || email}` : 'Chat from Solar DIY';
      const fromLine = name || email ? `<p><strong>From:</strong> ${name || '—'} ${email ? `&lt;${email}&gt;` : ''}</p>` : '<p><strong>From:</strong> (no name/email)</p>';
      const payload: { from: string; to: string[]; subject: string; html: string; reply_to?: string } = {
        from,
        to: [to],
        subject,
        html: `${fromLine}<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>${email ? '<p style="color:#64748b;font-size:12px;">Reply to this email — your reply will go to the visitor.</p>' : '<p style="color:#64748b;font-size:12px;">Visitor did not leave an email; reply here to keep a record.</p>'}`,
      };
      if (email) payload.reply_to = email;
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        if (!stored) {
          return NextResponse.json({ error: 'Failed to send. Try emailing us at info@solar-diy.ca' }, { status: 500 });
        }
      }
    } else if (!stored) {
      return NextResponse.json(
        { error: 'Unable to save your message right now. Please email us at info@solar-diy.ca' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Contact POST error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or email info@solar-diy.ca' },
      { status: 500 }
    );
  }
}
