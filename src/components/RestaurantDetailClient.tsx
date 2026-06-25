'use client';

import { useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { Star, Clock, MapPin, Plus, Minus, Check } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string;
  available: boolean;
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

interface RestaurantDetailProps {
  restaurant: Restaurant;
}

export default function RestaurantDetailClient({ restaurant }: RestaurantDetailProps) {
  const { items, addItem, removeItem, updateQuantity } = useCart();

  // Group menu items by category
  const categorizedMenu = useMemo(() => {
    const categories: Record<string, MenuItem[]> = {};
    restaurant.menuItems.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });
    return categories;
  }, [restaurant.menuItems]);

  // Check quantities of items in the cart belonging to this restaurant
  const cartQuantities = useMemo(() => {
    const qtyMap: Record<string, number> = {};
    items.forEach((item) => {
      if (item.restaurantId === restaurant.id) {
        qtyMap[item.menuItemId] = item.quantity;
      }
    });
    return qtyMap;
  }, [items, restaurant.id]);

  const handleAddItem = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  return (
    <div className="restaurant-detail-container animate-fade-in-up">
      {/* Restaurant Header Banner */}
      <div
        className="restaurant-header-banner"
        style={{
          position: 'relative',
          height: '320px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Overlay gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Content details overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '32px',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {restaurant.isPremium && (
              <span className="badge badge-premium">Premium Partner</span>
            )}
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
              }}
            >
              {restaurant.cuisine}
            </span>
          </div>

          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.3)', color: '#ffffff' }}>
            {restaurant.name}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '16px',
              fontSize: '0.95rem',
              opacity: 0.95,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} />
              <span>{restaurant.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  backgroundColor: 'var(--success-green)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                ★ {restaurant.rating.toFixed(1)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} />
              <span>Delivers in {restaurant.deliveryTime} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Menu List and Cart Summary placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
        {/* Menu Side */}
        <div className="menu-list">
          {Object.keys(categorizedMenu).map((categoryName) => (
            <div key={categoryName} style={{ marginBottom: '40px' }}>
              <h2
                style={{
                  fontSize: '1.5rem',
                  borderBottom: '2px solid var(--primary-glow)',
                  paddingBottom: '8px',
                  marginBottom: '20px',
                  textTransform: 'capitalize',
                }}
              >
                {categoryName}
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                {categorizedMenu[categoryName].map((item) => {
                  const qty = cartQuantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        display: 'flex',
                        gap: '20px',
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        position: 'relative',
                      }}
                    >
                      {/* Image representation if available */}
                      <div
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          backgroundColor: 'var(--neutral-100)',
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Content side */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            className={item.isVeg ? 'food-dot-veg' : 'food-dot-nonveg'}
                            style={{ display: 'inline-flex' }}
                          />
                          <h3 style={{ fontSize: '1.15rem' }}>{item.name}</h3>
                        </div>

                        <p
                          style={{
                            fontSize: '0.9rem',
                            color: 'var(--neutral-500)',
                            marginBottom: '12px',
                            lineHeight: 1.4,
                            flex: 1,
                          }}
                        >
                          {item.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                            ${item.price.toFixed(2)}
                          </span>

                          {/* Action button */}
                          {qty > 0 ? (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '14px',
                                border: '1.5px solid var(--primary)',
                                borderRadius: 'var(--radius-md)',
                                padding: '6px 12px',
                                backgroundColor: 'var(--primary-glow)',
                              }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, qty - 1)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span style={{ fontWeight: 700, color: 'var(--foreground)', minWidth: '16px', textAlign: 'center' }}>
                                {qty}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, qty + 1)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAddItem(item)}
                              disabled={!item.available}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Plus size={14} /> Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
