'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, MapPin, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface CheckoutClientProps {
  defaultAddress: string;
  userPhone: string;
}

export default function CheckoutClient({ defaultAddress, userPhone }: CheckoutClientProps) {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState(defaultAddress);
  const [phone, setPhone] = useState(userPhone);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sandbox modal state
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxOrderId, setSandboxOrderId] = useState('');
  const [sandboxAmount, setSandboxAmount] = useState(0);
  const [sandboxLoading, setSandboxLoading] = useState(false);

  const deliveryFee = items.length > 0 ? 3.99 : 0;
  const tax = cartTotal * 0.05;
  const total = cartTotal + deliveryFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          restaurantId: items[0].restaurantId,
          deliveryAddress: address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize order.');
      }

      if (data.isMock) {
        // Trigger Sandbox Simulator Modal
        setSandboxOrderId(data.orderId);
        setSandboxAmount(data.amount);
        setShowSandbox(true);
      } else {
        // Real Razorpay Flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'GourmetGo',
          description: 'Premium Food Delivery Order',
          order_id: data.orderId,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                clearCart();
                router.push('/dashboard/orders');
              } else {
                setError(verifyData.error || 'Payment verification failed.');
              }
            } catch (err: any) {
              setError('Payment verification error occurred: ' + err.message);
            }
          },
          prefill: {
            name: data.user.name,
            email: data.user.email,
            contact: phone,
          },
          theme: {
            color: '#ff5e1a',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setSandboxLoading(true);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: sandboxOrderId,
          razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 11),
          razorpaySignature: 'mock_signature',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        setShowSandbox(false);
        router.push('/dashboard/orders');
      } else {
        setError(data.error || 'Sandbox verification failed.');
        setShowSandbox(false);
      }
    } catch (err: any) {
      setError('Sandbox verification error: ' + err.message);
      setShowSandbox(false);
    } finally {
      setSandboxLoading(false);
    }
  };

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  if (items.length === 0 && !showSandbox) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '600px',
          margin: '40px auto',
        }}
      >
        <ShoppingBag size={48} style={{ color: 'var(--neutral-300)', marginBottom: '16px' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: 'var(--neutral-500)', marginTop: '8px', marginBottom: '24px' }}>
          Browse our premium catalog of restaurants and add delectable foods.
        </p>
        <Link href="/restaurants" className="btn btn-primary">
          Explore Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '32px' }}>Checkout</h1>

      {error && (
        <div className="auth-alert" style={{ marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="checkout-grid-mobile-stack">
        {/* Left Side: Details Form */}
        <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Address Box */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Delivery Address</h2>
            </div>
            <div className="form-group">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery address..."
                rows={4}
                className="form-input"
                style={{ resize: 'vertical' }}
                required
              />
            </div>
          </div>

          {/* Contact Box */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Phone size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Contact Information</h2>
            </div>
            <div className="form-group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number..."
                className="form-input"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading} style={{ padding: '16px' }}>
            {loading ? 'Processing Order...' : `Pay & Place Order ($${total.toFixed(2)})`}
          </button>
        </form>

        {/* Right Side: Order Summary */}
        <div className="card" style={{ height: 'fit-content', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--primary)' }} />
            Order Summary
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderBottom: '1px solid var(--card-border)',
              paddingBottom: '20px',
              marginBottom: '20px',
            }}
          >
            {items.map((item) => (
              <div key={item.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={item.isVeg ? 'food-dot-veg' : 'food-dot-nonveg'} />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--neutral-500)' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Taxes & GST (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1.2rem',
                borderTop: '1px solid var(--card-border)',
                paddingTop: '16px',
                marginTop: '8px',
                color: 'var(--primary)',
              }}
            >
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Custom Sandbox Simulator checkout overlay modal */}
      {showSandbox && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--glass-bg)',
              border: '1.5px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-lg)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <ShieldCheck size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <h2 style={{ marginBottom: '12px' }}>Sandbox Payment Simulator</h2>
            <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Mock credentials detected. You can simulate a successful Razorpay transaction.
            </p>

            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--background)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                border: '1px solid var(--card-border)',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--neutral-500)' }}>Order ID:</span>
                <span style={{ fontWeight: 600 }}>{sandboxOrderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--neutral-500)' }}>Total Price:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${sandboxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={() => setShowSandbox(false)}
                className="btn btn-secondary"
                disabled={sandboxLoading}
                style={{ flex: 1, padding: '12px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateSuccess}
                className="btn btn-primary"
                disabled={sandboxLoading}
                style={{ flex: 1, padding: '12px' }}
              >
                {sandboxLoading ? 'Processing...' : 'Simulate Success'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
