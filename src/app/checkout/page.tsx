import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import CheckoutClient from '@/components/CheckoutClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/checkout');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      defaultAddress: true,
      phone: true,
    },
  });

  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100vh - 68px - 300px)', padding: '40px 24px' }}>
        <CheckoutClient
          defaultAddress={user?.defaultAddress || ''}
          userPhone={user?.phone || ''}
        />
      </main>
      <Footer />
    </>
  );
}
