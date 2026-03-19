'use client';

import Link from 'next/link';
import { Sun, ShoppingCart, Menu, X, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Understanding Solar' },
  { href: '/why-solar-diy', label: 'Why Solar-DIY' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href !== '/' && pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-solar-sky to-solar-forest group-hover:scale-105 transition-transform duration-200">
              <Sun className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-solar-sky to-solar-forest opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Solar<span className="text-solar-leaf">DIY</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(link.href)
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Get a Quote CTA */}
            <Link
              href="/why-solar-diy"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-solar-sky/15 border border-solar-sky/30 text-solar-sky text-sm font-semibold hover:bg-solar-sky/25 hover:border-solar-sky/50 transition-all duration-200"
            >
              <Zap className="w-3.5 h-3.5" />
              Get a Quote
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-white/10 transition-colors duration-150 group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-solar-sky transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-solar-leaf text-xs font-bold flex items-center justify-center text-white animate-fade-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hidden admin link */}
            <Link
              href="/admin"
              className="text-transparent hover:text-white/20 text-xs transition-colors p-1"
              aria-label="Admin"
            >
              ·
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 animate-fade-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-white/10">
                <Link
                  href="/why-solar-diy"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-solar-sky bg-solar-sky/10 border border-solar-sky/20 hover:bg-solar-sky/20 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <Zap className="w-4 h-4" />
                  Get a Quote
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
