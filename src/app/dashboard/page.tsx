import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ClipboardList, Clock, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  // Fetch the 3 most recent orders for this user
  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      restaurant: true,
    },
  });

  const activeOrders = recentOrders.filter(
    (o) => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY'
  );

  return (
    <>
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <h1>Welcome back, {session.user.name || 'Gourmet Lover'}!</h1>
        <p>
          Ready to order some delicious food? Explore our premium selection of partner restaurants and satisfy your cravings today.
        </p>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock style={{ color: 'var(--primary)' }} size={20} />
            Active Orders
          </h2>
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderLeft: '4px solid var(--primary)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{order.restaurant.name}</h3>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--info-bg)',
                    color: 'var(--info-blue)',
                    textTransform: 'uppercase',
                  }}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', marginLeft: '12px' }}>
                  Total Paid: ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              <Link href="/dashboard/orders" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Track Order <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Overview stats & actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="checkout-grid-mobile-stack">
        {/* Quick order card */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ShoppingBag size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Order Delicious Food</h3>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Choose from a curated catalog of standard and premium restaurants offering authentic cuisines.
            </p>
          </div>
          <Link href="/restaurants" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
            Browse Restaurants
          </Link>
        </div>

        {/* Recent orders placeholder/list */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ClipboardList size={32} style={{ color: 'var(--primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Recent Activity</h3>
            {recentOrders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentOrders.map((order) => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                    <div>
                      <strong>{order.restaurant.name}</strong>
                      <div style={{ color: 'var(--neutral-500)' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                You haven&apos;t placed any orders yet. Once you order, they will appear here!
              </p>
            )}
          </div>
          {recentOrders.length > 0 && (
            <Link href="/dashboard/orders" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              View History
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
