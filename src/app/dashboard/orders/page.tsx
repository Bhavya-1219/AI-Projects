import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import OrdersListClient from '@/components/OrdersListClient';

export default async function OrdersHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
      orderItems: {
        include: {
          menuItem: {
            select: {
              name: true,
              isVeg: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Your Orders</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          Manage your active orders, track deliveries, and view historical transactions.
        </p>
      </div>

      <OrdersListClient orders={orders} />
    </>
  );
}
