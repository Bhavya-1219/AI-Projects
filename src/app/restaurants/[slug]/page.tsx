import prisma from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RestaurantDetailClient from '@/components/RestaurantDetailClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      menuItems: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100vh - 68px - 300px)', padding: '40px 24px' }}>
        <RestaurantDetailClient restaurant={restaurant} />
      </main>
      <Footer />
    </>
  );
}
