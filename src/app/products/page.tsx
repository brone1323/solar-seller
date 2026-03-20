import { ProductCard } from '@/components/ProductCard';
import { SolarSizer } from '@/components/SolarSizer';
import { readProducts } from '@/lib/productStorage';
import { Package, BookOpen, HeadphonesIcon, FileCheck, Wrench } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const allProducts = await readProducts();

  const byPrice = (a: typeof allProducts[0], b: typeof allProducts[0]) => a.price - b.price;
  const onGrid = allProducts.filter((p) => p.category === 'On Grid').sort(byPrice);
  const offGridLeadAcid = allProducts.filter((p) => p.category === 'Off Grid - Lead Acid').sort(byPrice);
  const offGridLithium = allProducts.filter((p) => p.category === 'Off Grid - Lithium').sort(byPrice);
  const products = [...onGrid, ...offGridLeadAcid, ...offGridLithium];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page header */}
      <div className="mb-8">
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
            <span>{products.length} product{products.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Value prop banner */}
      <div className="mb-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <Wrench className="w-5 h-5 text-solar-amber" />,
            title: 'Racking Included',
            desc: 'Every kit includes all mounting hardware and racking — nothing extra to source or buy.',
          },
          {
            icon: <FileCheck className="w-5 h-5 text-solar-leaf" />,
            title: 'Custom Install Manual',
            desc: 'Every kit ships with a project-specific installation manual drawn up for your exact system.',
          },
          {
            icon: <HeadphonesIcon className="w-5 h-5 text-solar-sky" />,
            title: 'Technical Expert On-Call',
            desc: 'Book a session with a certified solar technician for guidance at any point in your project.',
          },
          {
            icon: <BookOpen className="w-5 h-5 text-solar-amber" />,
            title: 'Step-by-Step Resources',
            desc: 'Spec sheets, wiring diagrams, and curated video guides are included with every order.',
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="glass rounded-2xl border border-white/[0.07] p-5 flex gap-4 items-start">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-1">{title}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Solar sizer calculator */}
      <SolarSizer products={products} />

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-24 glass rounded-3xl border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg font-medium mb-2">No products yet</p>
          <p className="text-slate-600 text-sm">Add some products in the Admin panel to get started.</p>
        </div>
      ) : (
        <div className="space-y-14">
          {/* On Grid */}
          {onGrid.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-6">On Grid</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {onGrid.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Off Grid */}
          {(offGridLeadAcid.length > 0 || offGridLithium.length > 0) && (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-8">Off Grid</h2>
              <div className="space-y-10">
                {offGridLeadAcid.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">Lead Acid</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {offGridLeadAcid.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
                {offGridLithium.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">Lithium</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {offGridLithium.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
