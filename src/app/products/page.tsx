import { ProductCard } from '@/components/ProductCard';
import productsData from '@/data/products.json';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.products || data;
    }
  } catch (e) {
    console.error('API products fetch failed', e);
  }
  return productsData as unknown as Product[];
}

export default async function ProductsPage() {
  const products = await getProducts();

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
