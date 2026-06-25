'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, CheckCircle, Package, Truck, Calendar, ShoppingBag } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
    isVeg: boolean;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  restaurant: {
    name: string;
  };
  orderItems: OrderItem[];
}

interface OrdersListClientProps {
  orders: Order[];
}

export default function OrdersListClient({ orders }: OrdersListClientProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Helper to map status to tracker index and label details
  const getTrackerData = (status: string) => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed', icon: ClipboardListIcon },
      { key: 'PREPARING', label: 'Preparing', icon: PackageIcon },
      { key: 'OUT_FOR_DELIVERY', label: 'On the Way', icon: TruckIcon },
      { key: 'DELIVERED', label: 'Delivered', icon: CheckIcon },
    ];

    let currentIndex = 0;
    if (status === 'PREPARING') currentIndex = 1;
    else if (status === 'OUT_FOR_DELIVERY') currentIndex = 2;
    else if (status === 'DELIVERED') currentIndex = 3;

    return { steps, currentIndex };
  };

  function ClipboardListIcon() { return <Clock size={16} />; }
  function PackageIcon() { return <Package size={16} />; }
  function TruckIcon() { return <Truck size={16} />; }
  function CheckIcon() { return <CheckCircle size={16} />; }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { bg: 'var(--warning-bg)', text: 'var(--warning-amber)' };
      case 'PREPARING':
      case 'OUT_FOR_DELIVERY':
        return { bg: 'var(--info-bg)', text: 'var(--info-blue)' };
      case 'DELIVERED':
        return { bg: 'var(--success-bg)', text: 'var(--success-green)' };
      case 'CANCELLED':
      default:
        return { bg: 'var(--error-bg)', text: 'var(--error-red)' };
    }
  };

  if (orders.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <ShoppingBag size={48} style={{ color: 'var(--neutral-300)', marginBottom: '16px' }} />
        <h3>No orders placed yet</h3>
        <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>
          Explore restaurants and place your first order.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {orders.map((order) => {
        const isExpanded = expandedOrderId === order.id;
        const statusColors = getStatusColor(order.status);
        const { steps, currentIndex } = getTrackerData(order.status);
        const isOrderActive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

        return (
          <div
            key={order.id}
            className="card card-hover"
            style={{ padding: '24px', cursor: 'pointer' }}
            onClick={() => toggleOrder(order.id)}
          >
            {/* Header summary info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{order.restaurant.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--neutral-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>ID: {order.id.substring(order.id.length - 8)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary)' }}>
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      textTransform: 'uppercase',
                    }}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {/* Live Tracking UI (Active order only) */}
            {isOrderActive && (
              <div
                className="tracking-container"
                onClick={(e) => e.stopPropagation()} // prevent double toggles
                style={{ cursor: 'default' }}
              >
                <h4 style={{ fontSize: '0.95rem' }}>Live Order Status</h4>
                <div className="tracking-bar">
                  <div
                    className="tracking-bar-fill"
                    style={{ width: `${(currentIndex / 3) * 100}%` }}
                  />
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    let stepClass = '';
                    if (idx === currentIndex) stepClass = 'active';
                    else if (idx < currentIndex) stepClass = 'completed';

                    return (
                      <div key={step.key} className={`tracking-step ${stepClass}`}>
                        <div className="tracking-dot">
                          <StepIcon />
                        </div>
                        <span className="tracking-label">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Expanded items list details */}
            {isExpanded && (
              <div
                style={{
                  marginTop: '20px',
                  borderTop: '1px solid var(--card-border)',
                  paddingTop: '16px',
                  cursor: 'default',
                }}
                onClick={(e) => e.stopPropagation()} // prevent collapse on details click
              >
                <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Items Details</h4>
                <table className="order-details-table">
                  <thead>
                    <tr>
                      <th>Dish Name</th>
                      <th>Quantity</th>
                      <th>Price per unit</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={item.menuItem.isVeg ? 'food-dot-veg' : 'food-dot-nonveg'} />
                            <span>{item.menuItem.name}</span>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
