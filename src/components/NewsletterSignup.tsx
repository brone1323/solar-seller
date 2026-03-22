'use client';

import { useState } from 'react';
import { Mail, Zap, Tag, BookOpen, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const perks = [
  { icon: Tag, text: 'Exclusive sale alerts & discount codes' },
  { icon: Zap, text: 'New kit announcements before anyone else' },
  { icon: BookOpen, text: 'DIY solar guides & expert tips' },
];

export function NewsletterSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(6,10,24,0.95) 40%, rgba(34,197,94,0.06) 100%)' }}>

        {/* Background orbs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-solar-sky/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-solar-leaf/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-solar-sky/5 blur-3xl pointer-events-none" />

        <div className="relative px-8 py-14 lg:px-16 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="badge-leaf">
                  <span className="w-1.5 h-1.5 rounded-full bg-solar-leaf animate-pulse-glow" />
                  Free to Join
                </span>
              </div>

              <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight mb-4">
                Get Solar Deals &amp;{' '}
                <span className="gradient-text">Expert Tips</span>
                {' '}Delivered to Your Inbox
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
                Join thousands of Canadians going solar the smart way. Be the first to hear about sales, new kits, and how-to guides — no spam, ever.
              </p>

              <ul className="space-y-3">
                {perks.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-solar-sky/15 border border-solar-sky/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-solar-sky" />
                    </div>
                    <span className="text-slate-300 text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="glass-strong rounded-2xl p-8 border border-white/[0.08]">
              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-solar-leaf/15 border border-solar-leaf/25 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-solar-leaf" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">You&apos;re in!</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Thanks for subscribing. Watch your inbox for solar deals and tips from our team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="font-display text-xl font-bold mb-1">Stay in the loop</p>
                    <p className="text-slate-500 text-sm mb-6">We send useful content — not noise.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
                    <input
                      type="text"
                      placeholder="Jane"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-solar-sky/50 focus:ring-1 focus:ring-solar-sky/20 transition-all disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === 'loading'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-slate-600 outline-none focus:border-solar-sky/50 focus:ring-1 focus:ring-solar-sky/20 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !name.trim() || !email.trim()}
                    className="w-full btn-solar flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-white text-base glow-btn disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe — It&apos;s Free
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-slate-600 text-xs text-center pt-1">
                    Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
