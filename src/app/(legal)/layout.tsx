/**
 * Legal Pages Layout
 * 
 * Shared layout for legal pages (privacy, terms, etc.)
 */

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

