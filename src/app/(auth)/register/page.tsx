'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    else if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';

    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';

    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters.';

    if (phone && !/^\+?[\d\s-]{7,15}$/.test(phone)) errs.phone = 'Enter a valid phone number.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        // Registration succeeded but login failed — redirect to login page
        router.push('/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function clearError(field: keyof FormErrors) {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  return (
    <>
      <div className="auth-form-header">
        <div className="auth-brand">🍽️ GourmetGo</div>
        <h2>Create your account</h2>
        <p>Start ordering your favorite meals today</p>
      </div>

      {serverError && <div className="auth-alert">{serverError}</div>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="John Doe"
            value={name}
            onChange={(e) => { setName(e.target.value); clearError('name'); }}
            autoComplete="name"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            autoComplete="email"
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
            autoComplete="new-password"
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-phone">Phone Number <span style={{ fontWeight: 400, color: 'var(--neutral-500)' }}>(optional)</span></label>
          <input
            id="reg-phone"
            type="tel"
            className={`form-input ${errors.phone ? 'input-error' : ''}`}
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
            autoComplete="tel"
          />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-address">Default Delivery Address <span style={{ fontWeight: 400, color: 'var(--neutral-500)' }}>(optional)</span></label>
          <input
            id="reg-address"
            type="text"
            className="form-input"
            placeholder="123 Main St, Apt 4B, New York, NY"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
          />
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account?{' '}
        <Link href="/login">Sign in</Link>
      </div>
    </>
  );
}
