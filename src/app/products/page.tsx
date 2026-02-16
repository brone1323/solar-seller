import { ProductCard } from '@/components/ProductCard';
import { readProducts } from '@/lib/productStorage';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await readProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold mb-4">Solar Equipment</h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Premium panels, inverters, batteries, and mounting systems for your DIY solar installation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-slate-400 text-lg">No products yet. Add some in the Admin panel.</p>
        </div>
      )}
    </div>
  );
}
