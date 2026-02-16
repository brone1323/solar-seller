'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import { Product } from '@/types';

const ADMIN_KEY = 'solar-admin-2024';

export default function AdminPage() {
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
    category: 'Solar Kits',
    images: ['', '', ''],
    specifications: {},
    featured: false,
  });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

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
        const res = await fetch(`/api/products/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Save failed');
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
        );
        setEditing(null);
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Save failed');
        const created = await res.json();
        setProducts((prev) => [...prev, created]);
        setShowForm(false);
      }
      setSaveMessage('Kit saved!');
      setTimeout(() => setSaveMessage(null), 3000);
      const fresh = await fetch('/api/products').then((r) => r.json());
      setProducts(Array.isArray(fresh) ? fresh : []);
      resetForm();
    } catch (e) {
      setSaveMessage('Save failed. Check that Blob storage is configured in Vercel.');
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setEditing(null);
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      longDescription: '',
      price: 0,
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
      category: p.category,
      images: [imgs[0] || '', imgs[1] || '', imgs[2] || ''],
      specifications: p.specifications || {},
      featured: p.featured,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-2">Admin</h1>
      <p className="text-slate-400 mb-8">Manage kits, specifications, and images.</p>
      {saveMessage && (
        <div className={`mb-6 px-4 py-2 rounded-lg ${saveMessage.includes('failed') ? 'bg-red-500/20 text-red-300' : 'bg-solar-leaf/20 text-solar-leaf'}`}>
          {saveMessage}
        </div>
      )}

      {loading ? (
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
                                      const res = await fetch('/api/upload', { method: 'POST', body: fd });
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
