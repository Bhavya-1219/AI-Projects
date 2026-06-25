'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const PARTICLE_DATA = [
  { emoji: '🍕', top: '10%', left: '5%', delay: '0s', duration: '7s' },
  { emoji: '🍔', top: '20%', left: '90%', delay: '1s', duration: '9s' },
  { emoji: '🌮', top: '60%', left: '8%', delay: '2s', duration: '8s' },
  { emoji: '🍣', top: '75%', left: '85%', delay: '0.5s', duration: '10s' },
  { emoji: '🍩', top: '30%', left: '80%', delay: '3s', duration: '7.5s' },
  { emoji: '🥗', top: '80%', left: '15%', delay: '1.5s', duration: '9s' },
  { emoji: '🍦', top: '15%', left: '70%', delay: '2.5s', duration: '8.5s' },
  { emoji: '🥤', top: '50%', left: '3%', delay: '4s', duration: '7s' },
];

export default function HeroSection() {
  // Defer particle rendering until after hydration to prevent mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="hero">
      {/* Floating food particles — only rendered client-side */}
      {mounted && (
        <div className="hero-particles" aria-hidden="true">
          {PARTICLE_DATA.map((p, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                top: p.top,
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      <div className="hero-inner">
        <span className="hero-tagline">🔥 #1 Food Delivery Platform</span>

        <h1 className="hero-heading">
          Cravings{' '}
          <span className="gradient-text">Delivered Fast!</span>
        </h1>

        <p className="hero-description">
          Discover the best restaurants near you. From gourmet sushi to crispy burgers,
          we bring premium meals to your doorstep — hot, fresh, and tracked in real time.
        </p>

        {/* Search bar */}
        <div className="hero-search">
          <div className="hero-search-icon">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search restaurants, cuisines, dishes…"
            aria-label="Search restaurants"
          />
          <button type="button">Search</button>
        </div>

        {/* CTAs */}
        <div className="hero-ctas">
          <Link href="/restaurants" className="btn btn-primary btn-lg">
            Explore Restaurants
          </Link>
          <Link href="/register" className="btn btn-outline btn-lg">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}
