'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const CHAT_POPUP_SHOWN_KEY = 'solar_chat_popup_shown';

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Failed to send');
      }
      setStatus('sent');
      setMessage('');
    } catch (err) {
      setStatus('error');
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
              {status === 'sent' ? (
                <div className="py-8 text-center">
                  <p className="text-solar-leaf font-medium">Thanks! We&apos;ll get back to you soon.</p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-slate-400 hover:text-white text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
