import Link from 'next/link';
import { ArrowRight, Zap, Shield, MapPin } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import productsData from '@/data/products.json';
import { Product } from '@/types';

const featuredProducts = (productsData as unknown as Product[]).filter((p) => p.featured);

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-solar-deep/80 via-solar-ocean/40 to-solar-forest/30" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.03%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Power Your Home with{' '}
              <span className="bg-gradient-to-r from-solar-sky to-solar-leaf bg-clip-text text-transparent">
                Solar DIY
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Premium solar panels, inverters, batteries, and mounting systems for your DIY installation.
              Save with Canadian incentives—find rebates and financing in your province.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold text-lg hover:opacity-90 transition-opacity glow-solar"
              >
                Shop Equipment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/incentives"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass border border-white/20 font-semibold hover:bg-white/10 transition-colors"
              >
                <MapPin className="w-5 h-5" /> Canadian Incentives
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-solar-sky/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-solar-sky" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Premium Equipment</h3>
            <p className="text-slate-400">High-efficiency panels, inverters, and batteries from trusted brands.</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-solar-leaf/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-solar-leaf" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">DIY Friendly</h3>
            <p className="text-slate-400">Complete mounting kits and detailed specs for confident installation.</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-solar-ocean/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-solar-ocean" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2">Canadian Incentives</h3>
            <p className="text-slate-400">Discover rebates, loans, and tax credits available in your province.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-display text-3xl font-bold">Featured Equipment</h2>
          <Link href="/products" className="text-solar-sky hover:text-solar-leaf font-medium transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass rounded-3xl p-12 lg:p-16 text-center glow-solar border border-solar-sky/20">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
            Ready to Go Solar?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Explore our full catalog of solar equipment and find the perfect incentives for your location.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-semibold hover:opacity-90 transition-opacity"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
