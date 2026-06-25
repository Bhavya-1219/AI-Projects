import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Star, MessageSquare } from 'lucide-react';

export default async function ReviewsHistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const reviews = await prisma.review.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>My Reviews</h1>
        <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem' }}>
          See reviews and ratings you have shared for restaurants.
        </p>
      </div>

      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => (
            <div key={review.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{review.restaurant.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning-amber)' }}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      fill={idx < review.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--neutral-800)', lineHeight: 1.5 }}>
                &ldquo;{review.comment}&rdquo;
              </p>
              <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                Posted on {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <MessageSquare size={48} style={{ color: 'var(--neutral-300)', marginBottom: '16px' }} />
          <h3>No reviews written yet</h3>
          <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>
            Once you write feedback on your delivered orders, they will show up here.
          </p>
        </div>
      )}
    </>
  );
}
