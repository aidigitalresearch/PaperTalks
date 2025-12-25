import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/**
 * Hero Section Component
 * 
 * Core value proposition for PaperTalks landing page.
 * Reusable with customizable props for A/B testing headlines/CTAs.
 * 
 * @example
 * <Hero />
 * <Hero headline="Custom Headline" primaryCtaText="Sign Up" />
 */

interface HeroProps {
  /** Main headline text */
  headline?: string;
  /** Supporting sub-headline text */
  subheadline?: string;
  /** Primary CTA button text */
  primaryCtaText?: string;
  /** Primary CTA link destination */
  primaryCtaHref?: string;
  /** Secondary CTA button text */
  secondaryCtaText?: string;
  /** Secondary CTA link destination */
  secondaryCtaHref?: string;
}

export function Hero({
  headline = "Where Research Meets Teaching Impact",
  subheadline = "Researchers showcase their papers through short explainer videos — earning measurable teaching credit that institutions trust.",
  primaryCtaText = "Create Research Profile",
  primaryCtaHref = "#early-access",
  secondaryCtaText = "Watch Explainers",
  secondaryCtaHref = "#explainers",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36">
      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(20,184,166,0.08),transparent)]" 
        aria-hidden="true"
      />
      
      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="max-w-2xl">
            {/* Status badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" aria-hidden="true" />
              Now accepting early access requests
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              {headline}
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-teal-600 text-white hover:bg-teal-700 px-8 h-12 text-base"
              >
                {/* TODO: Link to actual signup/profile creation flow */}
                <Link href={primaryCtaHref}>{primaryCtaText}</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="px-8 h-12 text-base"
              >
                {/* TODO: Link to video gallery or featured explainers */}
                <Link href={secondaryCtaHref}>
                  <PlayIcon className="mr-2 h-4 w-4" />
                  {secondaryCtaText}
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-teal-600" />
                <span>Peer-review aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-teal-600" />
                <span>ORCID integrated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-teal-600" />
                <span>DOI compatible</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Academic-themed illustration placeholder.
 * Shows a stylized representation of video + paper + teaching.
 * Replace with actual illustration asset when ready.
 */
function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Background glow */}
      <div 
        className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-teal-100/50 to-teal-50/30 blur-2xl" 
        aria-hidden="true"
      />
      
      {/* Main illustration container */}
      <div className="relative rounded-2xl border border-stone-200 bg-white p-6 shadow-lg">
        {/* Video player mockup */}
        <div className="aspect-video rounded-lg bg-gradient-to-br from-stone-800 to-stone-900 border border-stone-700 flex items-center justify-center relative overflow-hidden">
          {/* Video thumbnail overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Play button */}
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors cursor-pointer">
              <PlayIcon className="h-6 w-6 text-teal-600 ml-0.5" />
            </div>
            <span className="text-xs text-white/80 font-medium">3:42</span>
          </div>
          
          {/* Video title overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white text-sm font-medium truncate">Research Explainer Video</p>
            <p className="text-white/60 text-xs">Dr. Sarah Chen • MIT</p>
          </div>
        </div>
        
        {/* Paper info card */}
        <div className="mt-6 rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <DocumentIcon className="h-5 w-5 text-teal-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                Neural Networks for Climate Modeling
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Nature • 2024 • DOI: 10.1038/s41586
              </p>
            </div>
          </div>
        </div>
        
        {/* Teaching score indicator */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-stone-200 bg-gradient-to-r from-teal-50 to-white p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <StarIcon className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900">Teaching Score</span>
              <p className="text-xs text-stone-500">Top 10% in field</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-full">
            <span className="text-lg font-bold">92</span>
            <span className="text-xs opacity-80">/100</span>
          </div>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-teal-100/50 blur-xl" aria-hidden="true" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-amber-100/30 blur-xl" aria-hidden="true" />
    </div>
  );
}

// Icon components
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
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
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

