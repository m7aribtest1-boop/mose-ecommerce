"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { track } from '@/lib/analytics';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/categories', label: 'الفئات' },
  { href: '/products', label: 'المنتجات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'اتصل بنا' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-secondary-200 transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button
            className="lg:hidden p-2 -mr-2 text-secondary-700 hover:bg-secondary-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="القائمة"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">م</span>
            <span className="text-2xl font-bold text-primary-900">موسى<span className="text-primary-600">.</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2" aria-label="القائمة الرئيسية">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:ms-2">
            <button
              className="p-2.5 text-secondary-700 hover:bg-secondary-100 rounded-full relative"
              aria-label="البحث"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/wishlist" className="p-2.5 text-secondary-700 hover:bg-secondary-100 rounded-full relative" aria-label="المفضلة">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
              )}
            </Link>
            <Link href="/account" className="p-2.5 text-secondary-700 hover:bg-secondary-100 rounded-full" aria-label="حسابي">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link href="/cart" className="p-2.5 text-secondary-700 hover:bg-secondary-100 rounded-full relative" aria-label="سلة التسوق">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>
            <Link href="/checkout" className="hidden sm:block btn-primary px-5 py-2.5 text-sm">
              اطلب الآن
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="lg:hidden border-t border-secondary-200 bg-white px-4 py-3 space-y-1" aria-label="قائمة الجوال">
          {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2.5 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
          <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium">
            ❤ المفضلة
          </Link>
          <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg font-medium">
            👤 حسابي
          </Link>
          <Link href="/checkout" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-center bg-primary-600 text-white rounded-lg font-medium mt-2">
            اطلب الآن
          </Link>
        </nav>
      )}

      {searchOpen && (
        <div className="border-t border-secondary-200 bg-white">
          <form
            className="container-custom py-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = search.trim();
              if (q) {
                track('SEARCH', { query: q });
                router.push(`/products?q=${encodeURIComponent(q)}`);
              }
              setSearchOpen(false);
            }}
          >
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن جلابة، قفطان، تكشيطة..."
              className="flex-1 border border-secondary-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <button type="submit" className="btn-primary px-5 py-2 text-sm">بحث</button>
          </form>
        </div>
      )}
    </header>
  );
}
