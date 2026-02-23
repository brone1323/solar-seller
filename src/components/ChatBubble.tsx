'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';

const CHAT_POPUP_SHOWN_KEY = 'solar_chat_popup_shown';

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<{ whatsappNumber: string; phoneNumber: string }>({ whatsappNumber: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(CHAT_POPUP_SHOWN_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(CHAT_POPUP_SHOWN_KEY, '1');
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    fetch('/api/contact-info', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setContactInfo({ whatsappNumber: data.whatsappNumber || '', phoneNumber: data.phoneNumber || '' }))
      .catch(() => {});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    setErrorMessage('');
    const emailTrimmed = email.trim();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), email: emailTrimmed || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to send');
      }
      setStatus('sent');
      setSentEmail(emailTrimmed || null);
      setMessage('');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-solar-sky to-solar-leaf text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md bg-solar-dark border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-display text-lg font-semibold">Chat</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <p className="text-white font-medium mb-4">Is there anything we can help with?</p>
              {(contactInfo.whatsappNumber || contactInfo.phoneNumber) && (
                <div className="flex flex-col gap-3 mb-6">
                  {contactInfo.whatsappNumber && (
                    <a
                      href={`https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent('Hi, I have a question about Solar DIY')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-medium hover:opacity-90"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Chat live on WhatsApp
                    </a>
                  )}
                  {contactInfo.phoneNumber && (
                    <a
                      href={`tel:${contactInfo.phoneNumber.replace(/\D/g, '')}`}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-solar-sky text-white font-medium hover:opacity-90"
                    >
                      <Phone className="w-5 h-5" />
                      Call us
                    </a>
                  )}
                  <p className="text-slate-400 text-xs text-center">Or leave a message below and we&apos;ll get back to you.</p>
                </div>
              )}
              {status === 'sent' ? (
                <div className="space-y-4">
                  <p className="text-solar-leaf font-medium">Thanks! We got your message.</p>
                  <p className="text-slate-300 text-sm">
                    {sentEmail
                      ? <>We&apos;ll reply to you at <strong>{sentEmail}</strong>. Just hit Reply in your email when we write back.</>
                      : <>We&apos;ll get back to you soon. Add your email below if you&apos;d like a direct reply next time.</>}
                  </p>
                  <p className="text-slate-400 text-sm">This chat stays open so you can keep browsing or send another message.</p>
                  <button
                    type="button"
                    onClick={() => { setStatus('idle'); setSentEmail(null); }}
                    className="mt-2 text-solar-leaf hover:underline text-sm font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Your email (optional — we&apos;ll reply here)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMessage || 'Something went wrong. Try again or email us at info@solar-diy.com'}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending' || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {status === 'sending' ? 'Sending…' : (
                      <>
                        <Send className="w-4 h-4" /> Send message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
