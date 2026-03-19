import Link from 'next/link';
import { ArrowRight, Zap, Shield, Wrench, Mail, Star, Sun, Battery, Cpu } from 'lucide-react';
import { readProducts } from '@/lib/productStorage';
import { HomeGridSelector } from '@/components/HomeGridSelector';
import { FeaturedKitsGrid } from '@/components/FeaturedKitsGrid';
import { ProductsGridLink } from '@/components/ProductsGridLink';

export const dynamic = 'force-dynamic';

const stats = [
  { value: '500+', label: 'Systems Sold' },
  { value: '25yr', label: 'Panel Warranty' },
  { value: 'CAD', label: 'Pricing — No Surprises' },
  { value: '24/7', label: 'Expert Support' },
];

const features = [
  {
    icon: Zap,
    color: 'sky',
    iconBg: 'bg-solar-sky/20',
    iconColor: 'text-solar-sky',
    title: 'Premium Equipment',
    desc: 'High-efficiency panels, inverters, and batteries from globally trusted brands — rated for Canadian climates.',
  },
  {
    icon: Wrench,
    color: 'leaf',
    iconBg: 'bg-solar-leaf/20',
    iconColor: 'text-solar-leaf',
    title: 'Full DIY Support',
    desc: 'Every kit ships with engineering drawings, step-by-step guides, and access to a live solar expert.',
  },
  {
    icon: Shield,
    color: 'ocean',
    iconBg: 'bg-solar-ocean/20',
    iconColor: 'text-solar-ocean',
    title: 'Complete Packages',
    desc: 'Off-grid or grid-tied — we package everything you need so nothing is missing on installation day.',
  },
];

const trustItems = [
  { icon: Star, label: '4.9 / 5 rating', sub: 'From 200+ customers' },
  { icon: Sun, label: 'Canadian Owned', sub: 'Local expertise, local pricing' },
  { icon: Battery, label: 'In-Stock Inventory', sub: 'Ships within 3–5 business days' },
  { icon: Cpu, label: 'Engineered Packages', sub: 'Every kit is pre-vetted' },
];

export default async function HomePage() {
  const products = await readProducts();
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div>
      {/* ── HERO ──────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d1f] via-[#082240]/80 to-[#041a0f]/70" />
        <div className="absolute inset-0 hero-grid-pattern opacity-60" />

        {/* Floating orbs */}
        <div className="orb orb-sky w-[600px] h-[600px] top-[-120px] left-[-200px] animate-orb-float opacity-70" />
        <div className="orb orb-leaf w-[500px] h-[500px] bottom-[-100px] right-[-150px] animate-orb-float2 opacity-60" />
        <div className="orb orb-deep w-[400px] h-[400px] top-[40%] left-[40%] opacity-40" />

        {/* Sun ring decoration */}
        <div className="absolute top-12 right-12 hidden lg:block opacity-10 animate-spin-slow">
          <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
            <circle cx="140" cy="140" r="138" stroke="url(#sunGrad)" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="140" cy="140" r="90" stroke="url(#sunGrad)" strokeWidth="0.8" />
            <circle cx="140" cy="140" r="50" stroke="url(#sunGrad)" strokeWidth="0.5" />
            <defs>
              <linearGradient id="sunGrad" x1="0" y1="0" x2="280" y2="280">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#22c55e" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="max-w-4xl">
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-up">
              <span className="badge-sky">
                <span className="w-1.5 h-1.5 rounded-full bg-solar-sky animate-pulse-glow" />
                Canada&apos;s Solar DIY Store
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight animate-fade-up delay-100">
              Go Solar.{' '}
              <br className="hidden sm:block" />
              <span className="gradient-text">Do It Yourself.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed animate-fade-up delay-200">
              Complete solar kits with engineering drawings, step-by-step instructions,
              and expert support — so you can power your home on your own terms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
              <ProductsGridLink className="btn-solar inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-lg text-white glow-btn">
                Shop Kits <ArrowRight className="w-5 h-5" />
              </ProductsGridLink>
              <Link
                href="/why-solar-diy"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl glass border border-white/15 font-semibold text-lg hover:bg-white/10 hover:border-white/25 transition-all duration-200"
              >
                Why Solar-DIY?
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="mt-12 flex flex-wrap gap-6 animate-fade-up delay-400">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display font-bold text-2xl gradient-text">{s.value}</span>
                  <span className="text-slate-400 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID SELECTOR ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <HomeGridSelector />
      </div>

      {/* ── FEATURED PRODUCTS ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="section-label mb-2">Top picks</p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Featured Equipment</h2>
          </div>
          <ProductsGridLink className="text-solar-sky hover:text-solar-leaf font-semibold transition-colors text-sm flex items-center gap-1.5">
            View all <ArrowRight className="w-4 h-4" />
          </ProductsGridLink>
        </div>
        <FeaturedKitsGrid featuredProducts={featuredProducts} />
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Why Solar-DIY</p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Everything you need to go solar
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            We&apos;re not just selling parts — we&apos;re giving you a complete path from zero to powered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-8 flex flex-col gap-4"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${f.iconBg} flex items-center justify-center`}>
                <f.icon className={`w-7 h-7 ${f.iconColor}`} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="divider mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((t) => (
            <div key={t.label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <t.icon className="w-5 h-5 text-solar-sky" />
              </div>
              <div>
                <div className="font-semibold text-sm text-white">{t.label}</div>
                <div className="text-slate-500 text-xs">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="divider mt-10" />
      </section>

      {/* ── CTA BANNER ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-12 lg:p-16 text-center border-solar-sky/20 glow-solar">
          {/* Background orbs inside CTA */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-solar-sky/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-solar-leaf/10 blur-3xl pointer-events-none" />

          <div className="relative">
            <p className="section-label mb-4">Get started today</p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4 tracking-tight">
              Ready to cut your{' '}
              <span className="gradient-text">power bill in half?</span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Browse our complete catalog of solar kits — designed for Canadian homes,
              priced transparently, and backed by real support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProductsGridLink className="btn-solar inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-lg text-white glow-btn">
                Browse All Kits <ArrowRight className="w-5 h-5" />
              </ProductsGridLink>
              <a
                href="mailto:info@solar-diy.ca"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl glass border border-white/15 font-semibold text-lg hover:bg-white/10 transition-all duration-200"
              >
                <Mail className="w-5 h-5" /> Email us at info@solar-diy.ca
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
