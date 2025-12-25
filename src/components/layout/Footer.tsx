import Link from "next/link";
import { Container } from "@/components/ui/container";

/**
 * Footer Component
 * 
 * Compliance-ready footer with:
 * - About & Mission
 * - Open Science commitment
 * - Contact information
 * - Privacy/Terms placeholders
 * 
 * Designed for academic credibility and regulatory compliance.
 */

const footerLinks = {
  platform: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Teaching Score", href: "#teaching-score" },
    { label: "For Institutions", href: "#institutions" },
  ],
  resources: [
    { label: "Documentation", href: "#", disabled: true },
    { label: "API (Coming Soon)", href: "#", disabled: true },
    { label: "Research Guidelines", href: "#", disabled: true },
    { label: "Help Center", href: "#", disabled: true },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR Compliance", href: "/gdpr" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      {/* Main footer content */}
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand & Mission - Takes more space */}
            <div className="lg:col-span-5">
              {/* Logo */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-stone-900"
              >
                <LogoIcon className="h-7 w-7 text-teal-600" />
                <span>PaperTalks</span>
              </Link>

              {/* Mission statement */}
              <p className="mt-4 text-sm leading-relaxed text-stone-600 max-w-sm">
                Making research accessible through author-led explainer videos. 
                We believe every paper deserves to be understood, and every researcher 
                deserves recognition for their teaching impact.
              </p>

              {/* Open Science commitment */}
              <div className="mt-6 p-4 rounded-lg bg-white border border-stone-200">
                <div className="flex items-start gap-3">
                  <OpenAccessIcon className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900">
                      Open Science Commitment
                    </h4>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      We support open access principles and believe in making 
                      research knowledge freely accessible. PaperTalks is designed 
                      to complement, not replace, traditional peer review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Links columns */}
            <div className="lg:col-span-7">
              <div className="grid gap-8 sm:grid-cols-3">
                {/* Platform links */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-4">
                    Platform
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.platform.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-stone-600 hover:text-teal-600 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources links */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-4">
                    Resources
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.resources.map((link) => (
                      <li key={link.label}>
                        {link.disabled ? (
                          <span className="text-sm text-stone-400 cursor-not-allowed">
                            {link.label}
                          </span>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-sm text-stone-600 hover:text-teal-600 transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal links */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 mb-4">
                    Legal
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link) => (
                      <li key={link.label}>
                        {/* TODO: Create actual legal pages */}
                        <Link
                          href={link.href}
                          className="text-sm text-stone-600 hover:text-teal-600 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contact section */}
              <div className="mt-10 pt-8 border-t border-stone-200">
                <h4 className="text-sm font-semibold text-stone-900 mb-3">
                  Contact
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-stone-600">
                  <a
                    href="mailto:hello@papertalks.ai"
                    className="inline-flex items-center gap-2 hover:text-teal-600 transition-colors"
                  >
                    <MailIcon className="h-4 w-4" />
                    hello@papertalks.ai
                  </a>
                  <span className="hidden sm:inline text-stone-300">•</span>
                  <a
                    href="https://twitter.com/papertalks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-teal-600 transition-colors"
                  >
                    <XTwitterIcon className="h-4 w-4" />
                    @papertalks
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-stone-200 bg-white">
        <Container>
          <div className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-stone-500">
              © {currentYear} PaperTalks. All rights reserved.
            </p>
            <p className="text-xs text-stone-400">
              Built with ❤️ for the research community
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

// Icons

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <polygon points="10 12 10 18 15 15 10 12" />
    </svg>
  );
}

function OpenAccessIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
      <path d="M8 12h8" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

