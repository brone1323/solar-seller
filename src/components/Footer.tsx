import Link from 'next/link';
import { Sun, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="glass border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sun className="w-8 h-8 text-solar-leaf" />
              <span className="font-display font-bold text-xl">Solar DIY</span>
            </Link>
            <p className="text-slate-400 max-w-md">
              Your trusted source for premium solar equipment and DIY installation supplies.
              Power your home with clean, renewable energy.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-slate-400 hover:text-white">Shop</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white">Understanding Solar</Link></li>
              <li><Link href="/why-solar-diy" className="text-slate-400 hover:text-white">Why Solar-DIY</Link></li>
              <li><Link href="/cart" className="text-slate-400 hover:text-white">Cart</Link></li>
              <li><Link href="#contact" className="text-slate-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@solardiystore.ca</li>
            </ul>
          </div>
        </div>

        <div id="contact" className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-display text-xl font-semibold mb-2">Contact Us</h3>
          <p className="text-slate-400 mb-4 max-w-xl">
            Have questions about our solar equipment or need help with your order? We&apos;re here to help.
          </p>
          <a
            href="mailto:info@solardiystore.ca"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-solar-sky to-solar-leaf font-medium hover:opacity-90 transition-opacity"
          >
            <Mail className="w-5 h-5" /> Email us at info@solardiystore.ca
          </a>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Solar DIY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
