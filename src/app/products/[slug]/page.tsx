import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductQuestionsBox } from '@/components/ProductQuestionsBox';
import { ShareButton } from '@/components/ShareButton';
import { readProducts } from '@/lib/productStorage';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.solar-diy.com';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await readProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  const images = product.images?.filter(Boolean) || [];
  const ogImages = images.length > 0
    ? images.map((url) => ({ url, width: 1200, height: 630, alt: product.name }))
    : [{ url: `${SITE_URL}/icon.png`, width: 1200, height: 630, alt: product.name }];

  return {
    title: `${product.name} | Solar DIY`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${SITE_URL}/products/${slug}`,
      siteName: 'Solar DIY',
      images: ogImages,
      type: 'website',
    },
  };
}

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
        <div>
          <ProductImageCarousel images={product.images} productName={product.name} />
        </div>

        <div>
          <span className="text-solar-sky font-medium">{product.category}</span>
          <h1 className="font-display text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-solar-leaf mb-1">
            {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(product.price / 100)}
          </p>
          {product.priceSubtext && (
            <p className="text-slate-400 text-sm mb-6">{product.priceSubtext}</p>
          )}
          <p className={`text-slate-300 text-lg mb-6 ${product.priceSubtext ? '' : 'mt-5'}`}>{product.description}</p>
          {product.longDescription && (
            <p className="text-slate-400 mb-8">{product.longDescription}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <AddToCartButton product={product} />
            </div>
            <ShareButton url={`/products/${product.slug}`} className="px-6 py-4 rounded-xl glass shrink-0" />
          </div>

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

      <div className="mt-12">
        <ProductQuestionsBox productSlug={product.slug} />
      </div>
    </div>
  );
}
