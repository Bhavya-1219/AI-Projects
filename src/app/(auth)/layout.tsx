import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your GourmetGo account to order premium food delivery.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      {/* Visual side */}
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-emojis">
            <span>🍕</span>
            <span>🍔</span>
            <span>🍣</span>
          </div>
          <h1>Delicious Food, Delivered Fast</h1>
          <p>
            Join thousands of food lovers who trust GourmetGo for premium meals
            from the best restaurants, delivered hot to your door.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">{children}</div>
      </div>
    </div>
  );
}
