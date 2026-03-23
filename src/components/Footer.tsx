import Link from 'next/link';
import { Sun, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/products', label: 'Shop All Equipment' },
  { href: '/blog', label: 'Understanding Solar' },
  { href: '/why-solar-diy', label: 'Why Solar-DIY' },
  { href: '/cart', label: 'Shopping Cart' },
];

const categories = [
  { href: '/products?category=panels', label: 'Solar Panels' },
  { href: '/products?category=inverters', label: 'Inverters' },
  { href: '/products?category=batteries', label: 'Batteries' },
  { href: '/products?category=mounting', label: 'Mounting Systems' },
  { href: '/products?category=kits', label: 'Complete Kits' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.08]" style={{ background: 'rgba(6,10,24,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-solar-sky to-solar-forest group-hover:scale-105 transition-transform">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Solar<span className="text-solar-leaf">DIY</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Canada&apos;s trusted source for premium solar equipment. Power your home with clean, renewable energy — on your own terms.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:info@solar-diy.com"
                className="flex items-center gap-2 text-slate-500 hover:text-solar-sky text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> info@solar-diy.com
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">Equipment</h4>
            <ul className="space-y-3">
              {categories.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-500 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-5 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-solar-sky mt-0.5 flex-shrink-0" />
                <a href="mailto:info@solar-diy.com" className="hover:text-white transition-colors">
                  info@solar-diy.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-solar-sky mt-0.5 flex-shrink-0" />
                <span>Canada-wide shipping</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div
          id="contact"
          className="glass rounded-2xl p-8 mb-10 border-solar-sky/15"
          style={{ background: 'rgba(14,165,233,0.04)' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-lg font-bold mb-1">Have questions before you buy?</h3>
              <p className="text-slate-400 text-sm max-w-md">
                Our solar experts are happy to help you choose the right kit for your home and budget.
              </p>
            </div>
            <a
              href="mailto:info@solar-diy.com"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-solar font-semibold text-sm text-white whitespace-nowrap"
            >
              <Mail className="w-4 h-4" /> Email us
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} SolarDIY. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
