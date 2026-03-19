import { ProductCard } from '@/components/ProductCard';
import { readProducts } from '@/lib/productStorage';
import { SlidersHorizontal, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await readProducts();

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page header */}
      <div className="mb-12">
        <p className="section-label mb-3">Our catalog</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-3">
              Solar Equipment
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Premium panels, inverters, batteries, and mounting systems — all priced transparently in CAD, with expert support included.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{products.length} product{products.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Products grid — by category if any exist */}
      {products.length === 0 ? (
        <div className="text-center py-24 glass rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg font-medium mb-2">No products yet</p>
          <p className="text-slate-600 text-sm">Add some products in the Admin panel to get started.</p>
        </div>
      ) : categories.length > 1 ? (
        /* Show by category */
        <div className="space-y-14">
          {categories.map((cat) => {
            const catProducts = products.filter((p) => p.category === cat);
            return (
              <section key={cat}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display font-bold text-xl text-white">{cat}</h2>
                  <span className="badge-sky">{catProducts.length}</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Simple grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
