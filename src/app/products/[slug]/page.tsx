import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductImageCarousel } from '@/components/ProductImageCarousel';
import { ProductQuestionsBox } from '@/components/ProductQuestionsBox';
import { ProductPrice } from '@/components/ProductPrice';
import { ShareButton } from '@/components/ShareButton';
import { readProducts } from '@/lib/productStorage';
import { FileText, Youtube, ExternalLink, BookOpen, HeadphonesIcon, FileCheck, Wrench } from 'lucide-react';

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

  const specSheets = product.specSheets?.filter((s) => s.url) ?? [];
  const youtubeLinks = product.youtubeLinks?.filter((v) => v.url) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/products" className="text-slate-400 hover:text-white">Products</Link>
        <span className="mx-2 text-slate-500">/</span>
        <span className="text-solar-leaf">{product.name}</span>
      </nav>

      {/* What's included banner */}
      <div className="mb-8 grid sm:grid-cols-4 gap-3">
        {[
          { icon: <Wrench className="w-4 h-4 text-solar-amber" />, text: 'Racking & mounting hardware included' },
          { icon: <FileCheck className="w-4 h-4 text-solar-leaf" />, text: 'Custom project install manual included' },
          { icon: <HeadphonesIcon className="w-4 h-4 text-solar-sky" />, text: 'Technical expert bookable anytime' },
          { icon: <BookOpen className="w-4 h-4 text-solar-amber" />, text: 'Spec sheets & video guides included' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 glass rounded-xl border border-white/[0.07] px-4 py-3">
            <div className="flex-shrink-0">{icon}</div>
            <p className="text-sm text-slate-300">{text}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <ProductImageCarousel images={product.images} productName={product.name} />
        </div>

        <div>
          <span className="text-solar-sky font-medium">{product.category}</span>
          <h1 className="font-display text-4xl font-bold mt-2 mb-4">{product.name}</h1>
          <div className="mb-1">
            <ProductPrice price={product.price} />
          </div>
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

      {/* Spec Sheets */}
      {specSheets.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-solar-sky" /> Spec Sheets & Documents
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {specSheets.map((sheet, i) => {
              const categoryLabels: Record<string, string> = {
                'solar-panel': 'Solar Panel',
                'inverter': 'Inverter',
                'controller': 'Controller',
                'battery': 'Battery',
                'other': 'Document',
              };
              const categoryLabel = categoryLabels[sheet.category || 'other'] || 'Document';
              return (
                <a
                  key={i}
                  href={sheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl border border-white/10 hover:border-solar-sky/30 hover:bg-solar-sky/5 transition-all p-4 flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-solar-sky/10 border border-solar-sky/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-solar-sky" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors truncate">{sheet.label || 'Spec Sheet'}</span>
                    <span className="text-xs text-slate-500">{categoryLabel}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* YouTube Videos */}
      {youtubeLinks.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" /> Installation & Product Videos
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeLinks.map((video, i) => {
              // Extract YouTube video ID for thumbnail
              const ytId = video.url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
              return (
                <a
                  key={i}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all overflow-hidden group"
                >
                  {ytId && (
                    <div className="relative aspect-video overflow-hidden bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                          <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[14px] border-transparent border-l-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex items-center gap-3">
                    {!ytId && (
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Youtube className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <span className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-2">{video.title || 'Watch Video'}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-12">
        <ProductQuestionsBox productSlug={product.slug} />
      </div>
    </div>
  );
}
