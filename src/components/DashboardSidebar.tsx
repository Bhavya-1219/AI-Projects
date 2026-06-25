'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ClipboardList, MapPin, Star, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: User },
    { name: 'Order History', href: '/dashboard/orders', icon: ClipboardList },
    { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
    { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  ];

  return (
    <aside className="dashboard-sidebar">
      {/* User greeting */}
      <div className="dashboard-user-card">
        <span className="name">{user.name || 'Gourmet Lover'}</span>
        <span className="role">{user.role || 'CUSTOMER'}</span>
      </div>

      {/* Nav list */}
      <ul className="dashboard-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li
              key={item.href}
              className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
            >
              <Link href={item.href}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
        
        {/* Logout button */}
        <li className="dashboard-nav-item">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--error-red)',
              background: 'none',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition-normal)',
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
