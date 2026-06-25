'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface AddressesClientProps {
  initialAddress: string;
  initialPhone: string;
}

export default function AddressesClient({ initialAddress, initialPhone }: AddressesClientProps) {
  const router = useRouter();
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/user/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(data.error || 'Failed to update address.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Delivery Details</h1>
      <p style={{ color: 'var(--neutral-500)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Manage your default delivery address and primary phone number used during checkout.
      </p>

      {success && (
        <div className="badge badge-veg" style={{ width: '100%', padding: '12px', fontSize: '0.9rem', marginBottom: '20px', display: 'flex', gap: '8px', textTransform: 'none' }}>
          <CheckCircle2 size={18} />
          <span>Delivery details saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="auth-alert" style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span>Default Delivery Address</span>
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your street address, building number, city, and zip code..."
            className="form-input"
            rows={4}
            style={{ resize: 'vertical' }}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Phone size={16} style={{ color: 'var(--primary)' }} />
            <span>Phone Number</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number..."
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading} style={{ alignSelf: 'flex-start', width: 'auto', padding: '12px 24px' }}>
          {loading ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
