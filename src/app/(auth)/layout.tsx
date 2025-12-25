/**
 * Auth Layout
 * 
 * Shared layout for authentication pages (login, signup, etc.)
 * Can include a different header/footer or simpler design.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      {children}
    </div>
  );
}

