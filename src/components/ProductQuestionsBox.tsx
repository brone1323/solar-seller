'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { ProductQuestion } from '@/types';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function ProductQuestionsBox({ productSlug }: { productSlug: string }) {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchQuestions = () => {
    fetch(`/api/products/${productSlug}/questions`)
      .then((r) => r.json())
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [productSlug]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim() || 'Guest', body: text }),
      });
      if (res.ok) {
        const created = await res.json();
        setQuestions((prev) => [...prev, created]);
        setBody('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 glass rounded-2xl overflow-hidden border border-white/10">
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-solar-leaf" />
        <h3 className="font-display text-lg font-semibold">Questions &amp; answers</h3>
      </div>
      <div
        ref={scrollRef}
        className="max-h-[360px] overflow-y-auto p-4 space-y-4"
      >
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : questions.length === 0 ? (
          <p className="text-slate-400 text-sm">No questions yet. Ask one below.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <div className="rounded-xl bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  <span className="font-medium text-slate-300">USER</span>
                  <span>·</span>
                  <span>{formatDate(q.createdAt)}</span>
                </div>
                <p className="text-slate-200">{q.body}</p>
              </div>
              {q.answer && (
                <div className="ml-4 pl-4 border-l-2 border-solar-leaf/50 rounded-r-xl bg-solar-leaf/5 p-4">
                  <p className="text-sm text-slate-400 mb-1">Solar DIY</p>
                  <p className="text-slate-200">{q.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500"
        />
        <input
          type="text"
          placeholder="Ask a question…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-[2] min-w-0 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500"
          required
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
}
