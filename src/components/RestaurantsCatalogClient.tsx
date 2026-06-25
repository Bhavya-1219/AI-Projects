'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Star, Clock, Flame, SlidersHorizontal } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  isVeg: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  cuisine: string;
  coverImage: string;
  deliveryTime: number;
  isPremium: boolean;
  menuItems: MenuItem[];
}

interface CatalogProps {
  initialRestaurants: Restaurant[];
}

export default function RestaurantsCatalogClient({ initialRestaurants }: CatalogProps) {
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'default'>('default');

  const cuisines = useMemo(() => {
    const list = new Set<string>();
    initialRestaurants.forEach((r) => list.add(r.cuisine));
    return ['All', ...Array.from(list)];
  }, [initialRestaurants]);

  const filteredRestaurants = useMemo(() => {
    let result = [...initialRestaurants];

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }

    // Filter by cuisine
    if (selectedCuisine !== 'All') {
      result = result.filter((r) => r.cuisine === selectedCuisine);
    }

    // Filter by veg-only (every item in restaurant is veg)
    if (vegOnly) {
      result = result.filter((r) => r.menuItems.every((item) => item.isVeg));
    }

    // Sort by selection
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      result.sort((a, b) => a.deliveryTime - b.deliveryTime);
    }

    return result;
  }, [initialRestaurants, search, selectedCuisine, vegOnly, sortBy]);

  return (
    <div className="catalog-container animate-fade-in-up">
      {/* Page Header */}
      <div className="catalog-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>All Restaurants</h1>
        <p style={{ color: 'var(--neutral-500)' }}>
          Discover culinary delights and order from the best places near you
        </p>
      </div>

      {/* Filters Toolbar */}
      <div
        className="catalog-toolbar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          {/* Search bar */}
          <div
            className="search-input-wrapper"
            style={{
              flex: '1 1 300px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                color: 'var(--neutral-500)',
              }}
            />
            <input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                fontSize: '0.95rem',
                border: '1.5px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
              }}
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--neutral-500)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '12px 16px',
                fontSize: '0.95rem',
                border: '1.5px solid var(--neutral-200)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="default">Sort by: Relevance</option>
              <option value="rating">Sort by: Top Rated</option>
              <option value="deliveryTime">Sort by: Fastest Delivery</option>
            </select>
          </div>

          {/* Veg-only filter checkbox */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--success-green)',
                cursor: 'pointer',
              }}
            />
            <span className="food-dot-veg" style={{ display: 'inline-flex' }} />
            Veg Only
          </label>
        </div>

        {/* Cuisine quick pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--neutral-500)', marginRight: '8px' }}>
            CUISINES:
          </span>
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid transparent',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: selectedCuisine === cuisine ? 'var(--primary)' : 'var(--neutral-100)',
                color: selectedCuisine === cuisine ? '#ffffff' : 'var(--neutral-800)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid-responsive">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              className="restaurant-card"
            >
              <div className="restaurant-card-image">
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  loading="lazy"
                />
                {restaurant.isPremium && (
                  <span className="badge badge-premium restaurant-card-premium">
                    Premium
                  </span>
                )}
                <span className="restaurant-card-delivery">
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {restaurant.deliveryTime} mins
                </span>
              </div>
              <div className="restaurant-card-body">
                <h3 style={{ marginBottom: '8px' }}>{restaurant.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginBottom: '12px' }}>
                  {restaurant.address}
                </p>
                <div className="restaurant-card-meta">
                  <span className="restaurant-card-rating">
                    <Star size={12} fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{restaurant.cuisine}</span>
                  {restaurant.menuItems.every((item) => item.isVeg) && (
                    <>
                      <span>•</span>
                      <span className="badge badge-veg">Veg Only</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Flame size={48} style={{ color: 'var(--neutral-300)', marginBottom: '16px' }} />
          <h3>No restaurants found</h3>
          <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>
            Try adjusting your filters or searching for something else.
          </p>
        </div>
      )}
    </div>
  );
}
