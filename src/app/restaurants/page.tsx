import prisma from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantsCatalogClient from '@/components/RestaurantsCatalogClient';

export default async function RestaurantsPage() {
  let restaurants: any[] = [];

try {
  restaurants = await prisma.restaurant.findMany({
  include: {
    menuItems: true,
  },
  orderBy: {
    rating: "desc",
  },
});
} catch (error) {
  console.log("Database not available", error);
};

  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100vh - 68px - 300px)', padding: '40px 24px' }}>
        <RestaurantsCatalogClient initialRestaurants={restaurants} />
      </main>
      <Footer />
    </>
  );
}
