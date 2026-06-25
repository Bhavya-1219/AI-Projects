import prisma from '@/lib/db';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CuisineCarousel from '@/components/CuisineCarousel';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';

export default async function HomePage() {
  let premiumRestaurants: any[] = [];

  try {
    premiumRestaurants = await prisma.restaurant.findMany({
      where: { isPremium: true },
      orderBy: { rating: 'desc' },
      take: 8,
    });
  } catch (error) {
    console.log("Database not available", error);
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CuisineCarousel />

        <section className="restaurant-section animate-fade-in-up">
          <div className="section-header">
            <h2>Featured Premium Restaurants</h2>
            <Link href="/restaurants">View All →</Link>
          </div>

          <div className="grid-responsive">
            {premiumRestaurants.length > 0 ? (
              premiumRestaurants.map((restaurant) => (
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
                      <Clock
                        size={12}
                        style={{
                          display: "inline",
                          marginRight: "4px",
                          verticalAlign: "middle",
                        }}
                      />
                      {restaurant.deliveryTime} mins
                    </span>
                  </div>

                  <div className="restaurant-card-body">
                    <h3>{restaurant.name}</h3>

                    <div className="restaurant-card-meta">
                      <span className="restaurant-card-rating">
                        <Star
                          size={12}
                          fill="currentColor"
                          style={{
                            verticalAlign: "middle",
                            marginRight: "2px",
                          }}
                        />
                        {restaurant.rating.toFixed(1)}
                      </span>

                      <span>•</span>

                      <span>{restaurant.cuisine}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>🍕 Restaurants will appear here once the database is connected.</h2>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}