'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, FileText, Package, LogOut, MessageCircle } from 'lucide-react';
import { Product, ProductQuestion } from '@/types';

const authFetch = (url: string, init?: RequestInit) =>
  fetch(url, { ...init, credentials: 'include' as RequestCredentials });

type BlogArticle = {
  id?: string;
  slug: string;
  title: string;
  sections: { heading: string; content: string[] }[];
  cta: string;
};

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [tab, setTab] = useState<'kits' | 'blog' | 'questions'>('kits');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    priceSubtext: '',
    category: 'Solar Kits',
    images: ['', '', ''],
    specifications: {},
    featured: false,
  });

  const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [newBlog, setNewBlog] = useState<BlogArticle>({
    slug: '',
    title: '',
    sections: [{ heading: '', content: [''] }],
    cta: '',
  });

  const [questionsList, setQuestionsList] = useState<ProductQuestion[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [answerDraft, setAnswerDraft] = useState<Record<string, string>>({});
  const [newQuestion, setNewQuestion] = useState({ productSlug: '', author: 'Guest', body: '', scheduledFor: '' });

  useEffect(() => {
    authFetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(!!data.authenticated);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await authFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoginError(data.error || 'Login failed');
      return;
    }
    setAuthenticated(true);
    setLoginForm({ username: '', password: '' });
  };

  const handleLogout = async () => {
    await authFetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  useEffect(() => {
    if (!authenticated) return;
    authFetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [authenticated]);

  useEffect(() => {
    if (tab === 'blog' && authenticated) {
      setBlogLoading(true);
      authFetch('/api/blog')
        .then((r) => r.json())
        .then((data) => setBlogPosts(Array.isArray(data) ? data : []))
        .finally(() => setBlogLoading(false));
    }
  }, [tab, authenticated]);

  useEffect(() => {
    if (tab === 'questions' && authenticated) {
      setQuestionsLoading(true);
      authFetch('/api/questions')
        .then((r) => r.json())
        .then((data) => setQuestionsList(Array.isArray(data) ? data : []))
        .finally(() => setQuestionsLoading(false));
    }
  }, [tab, authenticated]);

  const saveProduct = async () => {
    if (!newProduct.name) return;
    const payload = {
      ...newProduct,
      slug: (newProduct.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      specifications: typeof newProduct.specifications === 'object' ? newProduct.specifications : {},
      images: Array.isArray(newProduct.images) ? newProduct.images.filter(Boolean) : [],
    };
    try {
      if (editing) {
        const res = await authFetch(`/api/products/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Save failed');
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
        );
        setEditing(null);
      } else {
        const res = await authFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Save failed');
        }
        const created = await res.json();
        setProducts((prev) => [...prev, created]);
        setShowForm(false);
      }
      setSaveMessage('Kit saved!');
      setTimeout(() => setSaveMessage(null), 3000);
      const fresh = await authFetch('/api/products').then((r) => r.json());
      setProducts(Array.isArray(fresh) ? fresh : []);
      resetForm();
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Save failed');
      setTimeout(() => setSaveMessage(null), 6000);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setEditing(null);
      setSaveMessage('Deleted');
      setTimeout(() => setSaveMessage(null), 2000);
    } else {
      const data = await res.json().catch(() => ({}));
      setSaveMessage(data.error || 'Delete failed');
      setTimeout(() => setSaveMessage(null), 5000);
      const fresh = await authFetch('/api/products').then((r) => r.json());
      setProducts(Array.isArray(fresh) ? fresh : []);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      longDescription: '',
      price: 0,
      priceSubtext: '',
      category: 'Solar Kits',
      images: ['', '', ''],
      specifications: {},
      featured: false,
    });
  };

  const addSpec = () => {
    const key = prompt('Spec name (e.g. Power Output):');
    if (key) {
      setNewProduct((p) => ({
        ...p,
        specifications: { ...(p.specifications || {}), [key]: '' },
      }));
    }
  };

  const updateSpec = (key: string, value: string) => {
    setNewProduct((p) => {
      const spec = { ...(p.specifications || {}) };
      if (value) spec[key] = value;
      else delete spec[key];
      return { ...p, specifications: spec };
    });
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    const imgs = p.images?.filter(Boolean) || [];
    setNewProduct({
      name: p.name,
      description: p.description,
      longDescription: p.longDescription,
      price: p.price,
      priceSubtext: p.priceSubtext ?? '',
      category: p.category,
      images: [imgs[0] || '', imgs[1] || '', imgs[2] || ''],
      specifications: p.specifications || {},
      featured: p.featured,
    });
    setShowForm(true);
  };

  const saveBlog = async () => {
    if (!newBlog.title) return;
    const slug = newBlog.slug || newBlog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const sections = newBlog.sections.filter((s) => s.heading.trim() || s.content.some((c) => c.trim()));
    if (sections.length === 0) sections.push({ heading: 'Content', content: [''] });
    const payload = { ...newBlog, slug, sections };
    try {
      if (editingBlog?.id) {
        const res = await authFetch(`/api/blog/${editingBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      } else {
        const res = await authFetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      }
      setSaveMessage('Article saved!');
      setTimeout(() => setSaveMessage(null), 3000);
      const fresh = await authFetch('/api/blog').then((r) => r.json());
      setBlogPosts(Array.isArray(fresh) ? fresh : []);
      setEditingBlog(null);
      setShowBlogForm(false);
      setNewBlog({ slug: '', title: '', sections: [{ heading: '', content: [''] }], cta: '' });
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Save failed');
      setTimeout(() => setSaveMessage(null), 6000);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    const res = await authFetch(`/api/blog/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogPosts((prev) => prev.filter((b) => b.id !== id));
      setEditingBlog(null);
      setSaveMessage('Deleted');
      setTimeout(() => setSaveMessage(null), 2000);
    } else {
      setSaveMessage((await res.json().catch(() => ({}))).error || 'Delete failed');
      setTimeout(() => setSaveMessage(null), 5000);
      const fresh = await authFetch('/api/blog').then((r) => r.json());
      setBlogPosts(Array.isArray(fresh) ? fresh : []);
    }
  };

  const startEditBlog = (b: BlogArticle) => {
    setEditingBlog(b);
    setNewBlog({
      slug: b.slug,
      title: b.title,
      sections: b.sections?.length ? b.sections : [{ heading: '', content: [''] }],
      cta: b.cta || '',
    });
    setShowBlogForm(true);
  };

  const addBlogSection = () => {
    setNewBlog((n) => ({
      ...n,
      sections: [...n.sections, { heading: '', content: [''] }],
    }));
  };

  const updateBlogSection = (i: number, heading: string, content: string[]) => {
    setNewBlog((n) => {
      const s = [...n.sections];
      s[i] = { heading, content };
      return { ...n, sections: s };
    });
  };

  const removeBlogSection = (i: number) => {
    setNewBlog((n) => ({
      ...n,
      sections: n.sections.filter((_, j) => j !== i),
    }));
  };

  const saveAnswer = async (id: string) => {
    const answer = answerDraft[id] ?? '';
    try {
      const res = await authFetch(`/api/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim() || '' }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      setQuestionsList((prev) =>
        prev.map((q) => (q.id === id ? { ...q, answer: answer.trim() || undefined } : q))
      );
      setAnswerDraft((d) => ({ ...d, [id]: '' }));
      setSaveMessage('Answer saved');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Failed to save answer');
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const addScheduledQuestion = async () => {
    if (!newQuestion.productSlug.trim() || !newQuestion.body.trim()) {
      setSaveMessage('Product and question text required');
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    try {
      const res = await authFetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: newQuestion.productSlug.trim(),
          author: newQuestion.author.trim() || 'Guest',
          body: newQuestion.body.trim(),
          scheduledFor: newQuestion.scheduledFor.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
      const created = await res.json();
      setQuestionsList((prev) => [...prev, created]);
      setNewQuestion({ productSlug: '', author: 'Guest', body: '', scheduledFor: '' });
      setSaveMessage('Question added');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (e) {
      setSaveMessage(e instanceof Error ? e.message : 'Failed to add question');
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  if (!authChecked) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="glass rounded-2xl p-8">
          <h1 className="font-display text-2xl font-bold mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-bold">Admin</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <LogOut className="w-5 h-5" /> Log out
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setTab('kits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === 'kits' ? 'bg-solar-leaf text-white' : 'glass hover:bg-white/10'}`}
        >
          <Package className="w-5 h-5" /> Kits
        </button>
        <button
          onClick={() => setTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === 'questions' ? 'bg-solar-leaf text-white' : 'glass hover:bg-white/10'}`}
        >
          <MessageCircle className="w-5 h-5" /> Questions
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === 'blog' ? 'bg-solar-leaf text-white' : 'glass hover:bg-white/10'}`}
        >
          <FileText className="w-5 h-5" /> Understanding Solar
        </button>
      </div>
      {saveMessage && (
        <div className={`mb-6 px-4 py-2 rounded-lg ${saveMessage.includes('failed') ? 'bg-red-500/20 text-red-300' : 'bg-solar-leaf/20 text-solar-leaf'}`}>
          {saveMessage}
        </div>
      )}

      {tab === 'questions' ? (
        questionsLoading ? (
          <div className="text-slate-400">Loading questions...</div>
        ) : (
          <>
            <div className="glass rounded-2xl p-8 mb-8">
              <h2 className="font-display text-xl font-semibold mb-6">Add scheduled question</h2>
              <p className="text-slate-400 text-sm mb-4">Add a question as if from a customer (e.g. to simulate activity). Optionally set when it appears.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Product (slug)</label>
                  <select
                    value={newQuestion.productSlug}
                    onChange={(e) => setNewQuestion((n) => ({ ...n, productSlug: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Author name</label>
                  <input
                    type="text"
                    value={newQuestion.author}
                    onChange={(e) => setNewQuestion((n) => ({ ...n, author: e.target.value }))}
                    placeholder="Guest"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-slate-400 mb-1">Question text</label>
                  <input
                    type="text"
                    value={newQuestion.body}
                    onChange={(e) => setNewQuestion((n) => ({ ...n, body: e.target.value }))}
                    placeholder="e.g. Does this kit include mounting hardware?"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Show after (optional, ISO date)</label>
                  <input
                    type="datetime-local"
                    value={newQuestion.scheduledFor ? newQuestion.scheduledFor.slice(0, 16) : ''}
                    onChange={(e) => setNewQuestion((n) => ({ ...n, scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addScheduledQuestion}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest"
                  >
                    <Plus className="w-4 h-4" /> Add question
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">All questions — click to answer</h2>
              {questionsList
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((q) => (
                  <div
                    key={q.id}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-400 text-sm mb-1">
                          {q.productSlug} · {q.author} · {new Date(q.createdAt).toLocaleString()}
                        </p>
                        <p className="text-slate-200 font-medium">{q.body}</p>
                        {q.answer && (
                          <p className="text-solar-leaf text-sm mt-2 border-l-2 border-solar-leaf/50 pl-3">{q.answer}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <textarea
                        value={answerDraft[q.id] ?? q.answer ?? ''}
                        onChange={(e) => setAnswerDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                        placeholder="Type your answer…"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-500"
                      />
                      <button
                        type="button"
                        onClick={() => saveAnswer(q.id)}
                        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest text-sm"
                      >
                        <Save className="w-4 h-4" /> Save answer
                      </button>
                    </div>
                  </div>
                ))}
              {questionsList.length === 0 && (
                <p className="text-slate-400">No questions yet. Add one above or wait for customers to ask on product pages.</p>
              )}
            </div>
          </>
        )
      ) : tab === 'blog' ? (
        blogLoading ? (
          <div className="text-slate-400">Loading articles...</div>
        ) : (
          <>
            {!showBlogForm ? (
              <button
                onClick={() => {
                  setEditingBlog(null);
                  setNewBlog({ slug: '', title: '', sections: [{ heading: '', content: [''] }], cta: '' });
                  setShowBlogForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest transition-colors mb-8"
              >
                <Plus className="w-5 h-5" /> Add Article
              </button>
            ) : (
              <div className="glass rounded-2xl p-8 mb-8">
                <h2 className="font-display text-xl font-semibold mb-6">
                  {editingBlog ? 'Edit Article' : 'New Article'}
                </h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog((n) => ({ ...n, title: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Slug (URL)</label>
                    <input
                      type="text"
                      value={newBlog.slug}
                      onChange={(e) => setNewBlog((n) => ({ ...n, slug: e.target.value }))}
                      placeholder="Auto from title"
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  {newBlog.sections.map((sec, i) => (
                    <div key={i} className="p-4 rounded-xl glass">
                      <div className="flex justify-between items-center mb-2">
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => updateBlogSection(i, e.target.value, sec.content)}
                          placeholder="Section heading"
                          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeBlogSection(i)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        value={sec.content.join('\n')}
                        onChange={(e) => updateBlogSection(i, sec.heading, e.target.value.split('\n'))}
                        rows={6}
                        placeholder="One bullet per line"
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBlogSection}
                    className="text-solar-sky text-sm hover:underline"
                  >
                    + Add section
                  </button>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">CTA (call to action)</label>
                    <input
                      type="text"
                      value={newBlog.cta}
                      onChange={(e) => setNewBlog((n) => ({ ...n, cta: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={saveBlog}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => { setShowBlogForm(false); setEditingBlog(null); }}
                      className="px-6 py-2 rounded-lg glass"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {blogPosts.map((b) => (
                <div
                  key={b.id || b.slug}
                  className="glass rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-slate-400 text-sm">/blog/{b.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditBlog(b)}
                      className="p-2 rounded-lg hover:bg-white/10"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteBlog(b.id!)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      ) : loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <>
          {!showForm ? (
            <button
              onClick={() => {
                setEditing(null);
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest transition-colors mb-8"
            >
              <Plus className="w-5 h-5" /> Add Kit
            </button>
          ) : (
            <div className="glass rounded-2xl p-8 mb-8">
              <h2 className="font-display text-xl font-semibold mb-6">
                {editing ? 'Edit Kit' : 'New Kit'}
              </h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Category</label>
                  <select
                    value={newProduct.category || ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  >
                    <option>Solar Kits</option>
                    <option>Solar Panels</option>
                    <option>Inverters</option>
                    <option>Batteries</option>
                    <option>Mounting & Racking</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Price (cents, e.g. 34900 = $349)</label>
                  <input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Text below price (optional)</label>
                  <input
                    type="text"
                    value={newProduct.priceSubtext || ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, priceSubtext: e.target.value }))}
                    placeholder="e.g. Average installed price: $12,000"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Long Description</label>
                  <textarea
                    value={newProduct.longDescription || ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, longDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-3">Kit Images (up to 3 — scroll through on product page)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => {
                      const imgs = newProduct.images || ['', '', ''];
                      const url = imgs[i] || '';
                      return (
                        <div key={i} className="space-y-2">
                          <span className="text-xs text-slate-500">Image {i + 1}</span>
                          <div className="relative aspect-square rounded-lg overflow-hidden glass border border-white/20">
                            {url ? (
                              <>
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(newProduct.images || ['', '', ''])];
                                    next[i] = '';
                                    setNewProduct((p) => ({ ...p, images: next }));
                                  }}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white text-sm hover:bg-red-500"
                                >
                                  ×
                                </button>
                              </>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-2">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/gif"
                                  className="text-xs file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-solar-sky file:text-white file:text-xs file:cursor-pointer"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append('file', file);
                                    try {
                                      const res = await authFetch('/api/upload', { method: 'POST', body: fd });
                                      const data = await res.json();
                                      if (data.url) {
                                        const next = [...(newProduct.images || ['', '', ''])];
                                        next[i] = data.url;
                                        setNewProduct((p) => ({ ...p, images: next }));
                                      } else {
                                        alert(data.error || 'Upload failed');
                                      }
                                    } catch (err) {
                                      alert('Upload failed');
                                    }
                                    e.target.value = '';
                                  }}
                                />
                                <span className="text-xs mt-1">or</span>
                                <input
                                  type="text"
                                  placeholder="Paste URL"
                                  className="w-full mt-1 px-2 py-1 rounded text-xs bg-white/10 border border-white/20 text-white"
                                  onBlur={(e) => {
                                    const v = e.target.value.trim();
                                    if (v) {
                                      const next = [...(newProduct.images || ['', '', ''])];
                                      next[i] = v;
                                      setNewProduct((p) => ({ ...p, images: next }));
                                      e.target.value = '';
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const v = (e.target as HTMLInputElement).value.trim();
                                      if (v) {
                                        const next = [...(newProduct.images || ['', '', ''])];
                                        next[i] = v;
                                        setNewProduct((p) => ({ ...p, images: next }));
                                        (e.target as HTMLInputElement).value = '';
                                      }
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Featured</label>
                  <input
                    type="checkbox"
                    checked={!!newProduct.featured}
                    onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-slate-300">Show on homepage</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-400">Specifications</label>
                    <button
                      onClick={addSpec}
                      className="text-solar-sky text-sm hover:underline"
                    >
                      + Add spec
                    </button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(newProduct.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="w-1/3 px-3 py-2 rounded-lg bg-white/5 text-slate-400"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSpec(key, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                          placeholder="Value"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={saveProduct}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-solar-leaf hover:bg-solar-forest"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                    }}
                    className="px-6 py-2 rounded-lg glass"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="glass rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-slate-400 text-sm">
                    {p.category} • {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(p.price / 100)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="p-2 rounded-lg hover:bg-white/10"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
