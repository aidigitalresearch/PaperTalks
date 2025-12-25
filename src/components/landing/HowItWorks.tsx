import { Container } from "@/components/ui/container";

/**
 * How It Works Section
 * 
 * Displays the 4-step process for researchers to use PaperTalks.
 * - Desktop: Vertical timeline with alternating layout
 * - Mobile: Stacked cards with connecting line
 */

const steps = [
  {
    number: 1,
    title: "Create Your Research Profile",
    description:
      "Sign up with your ORCID or institution email. Import your publications automatically and build your academic identity in minutes.",
    icon: <ProfileIcon className="h-6 w-6" />,
    // TODO: Connect to Supabase auth + ORCID OAuth
  },
  {
    number: 2,
    title: "Add Your Paper Details",
    description:
      "Link your published papers with DOI lookup. We'll fetch metadata automatically — title, abstract, co-authors, and citation info.",
    icon: <PaperIcon className="h-6 w-6" />,
    // TODO: Integrate DOI resolver API (CrossRef/DataCite)
  },
  {
    number: 3,
    title: "Record a Short Explainer Video",
    description:
      "Use our simple recorder to create a 3-5 minute video explaining your research. No editing skills needed — just share your expertise.",
    icon: <VideoIcon className="h-6 w-6" />,
    // TODO: Integrate Mux or Cloudflare Stream for video upload
  },
  {
    number: 4,
    title: "Earn Your Teaching Credit Score",
    description:
      "Get a measurable Teaching Credit Score based on video quality and engagement. Plus, receive a citable Video Research Identifier (VRI).",
    icon: <AwardIcon className="h-6 w-6" />,
    // TODO: Implement scoring algorithm + VRI generation system
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-stone-50">
      <Container>
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium text-teal-600 mb-3 tracking-wide uppercase">
            Simple Process
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            From profile to published explainer in four simple steps.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line - visible on all screens */}
          <div 
            className="absolute left-6 top-0 bottom-0 w-px bg-stone-200 sm:left-1/2 sm:-translate-x-px"
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.number}
                step={step}
                position={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-stone-600 mb-4">
            Ready to showcase your research?
          </p>
          <a
            href="#early-access"
            className="inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            Get Started — It&apos;s Free
          </a>
        </div>
      </Container>
    </section>
  );
}

interface TimelineStepProps {
  step: {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
  };
  position: "left" | "right";
}

function TimelineStep({ step, position }: TimelineStepProps) {
  return (
    <div className="relative flex items-start gap-6 sm:gap-0">
      {/* Mobile: Icon on left, content on right */}
      {/* Desktop: Alternating sides */}
      
      {/* Left content (desktop only, for even steps) */}
      <div 
        className={`hidden sm:block sm:w-1/2 sm:pr-12 sm:text-right ${
          position === "right" ? "sm:invisible" : ""
        }`}
      >
        {position === "left" && <StepContent step={step} align="right" />}
      </div>

      {/* Center node */}
      <div className="relative z-10 flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-600 bg-white text-teal-600 shadow-sm">
          {step.icon}
        </div>
        {/* Step number badge */}
        <span 
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          {step.number}
        </span>
      </div>

      {/* Right content (always visible on mobile, only for odd steps on desktop) */}
      <div 
        className={`flex-1 sm:w-1/2 sm:pl-12 ${
          position === "left" ? "sm:invisible" : ""
        }`}
      >
        {/* Mobile: Always show content here */}
        <div className="sm:hidden">
          <StepContent step={step} align="left" />
        </div>
        {/* Desktop: Only show for right-positioned steps */}
        {position === "right" && (
          <div className="hidden sm:block">
            <StepContent step={step} align="left" />
          </div>
        )}
      </div>
    </div>
  );
}

interface StepContentProps {
  step: {
    number: number;
    title: string;
    description: string;
  };
  align: "left" | "right";
}

function StepContent({ step, align }: StepContentProps) {
  return (
    <div 
      className={`rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        align === "right" ? "sm:text-right" : ""
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
        Step {step.number}
      </span>
      <h3 className="mt-2 font-serif text-lg font-semibold text-stone-900">
        {step.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        {step.description}
      </p>
    </div>
  );
}

// Icons

function ProfileIcon({ className }: { className?: string }) {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PaperIcon({ className }: { className?: string }) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
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
      <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function AwardIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

