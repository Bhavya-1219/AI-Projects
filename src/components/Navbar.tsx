'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          🍽️ Gourmet<span>Go</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/restaurants">Restaurants</Link></li>
          <li><Link href="/about">About</Link></li>
          {session && <li><Link href="/dashboard">Dashboard</Link></li>}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <Link href="/checkout" className="cart-btn" aria-label="Shopping cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {session ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}

          {/* Mobile burger */}
          <button
            className={`burger-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/restaurants" onClick={() => setMenuOpen(false)}>Restaurants</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        {session ? (
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
