import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { readProducts } from '@/lib/productStorage';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await readProducts();
  const product = products.find((p) => p.slug === slug) ?? null;

  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/products" className="text-slate-400 hover:text-white">Products</Link>
        <span className="mx-2 text-slate-500">/</span>
        <span className="text-solar-leaf">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden glass">
            <Image
              src={product.images[0] || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-solar-sky font-medium">{product.category}</span>
          <h1 className="font-display text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-solar-leaf mb-6">
            {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(product.price / 100)}
          </p>
          <p className="text-slate-300 text-lg mb-6">{product.description}</p>
          {product.longDescription && (
            <p className="text-slate-400 mb-8">{product.longDescription}</p>
          )}

          <AddToCartButton product={product} />

          {Object.keys(product.specifications).length > 0 && (
            <div className="mt-12">
              <h3 className="font-display font-semibold text-xl mb-4">Specifications</h3>
              <div className="glass rounded-xl p-6 space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-slate-400">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
