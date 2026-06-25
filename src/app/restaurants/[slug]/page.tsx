import prisma from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantDetailClient from '@/components/RestaurantDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let restaurant = null;

  try {
    restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      include: {
        menuItems: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });
  } catch (error) {
    console.log("Database not available", error);
  }

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <main
          className="container"
          style={{
            minHeight: "calc(100vh - 68px - 300px)",
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          <h1>Restaurant Not Available</h1>
          <p>The database is not connected yet.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        className="container"
        style={{
          minHeight: "calc(100vh - 68px - 300px)",
          padding: "40px 24px",
        }}
      >
        <RestaurantDetailClient restaurant={restaurant} />
      </main>
      <Footer />
    </>
  );
}