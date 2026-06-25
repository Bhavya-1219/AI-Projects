import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardSidebar from '@/components/DashboardSidebar';
import './dashboard.css';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100vh - 68px - 320px)', padding: '40px 24px' }}>
        <div className="dashboard-container">
          <DashboardSidebar
            user={{
              name: session.user.name,
              email: session.user.email,
              role: session.user.role,
            }}
          />
          <div className="dashboard-content">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
