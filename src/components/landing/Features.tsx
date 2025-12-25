import { Container } from "@/components/ui/container";
import { FeatureCard } from "@/components/ui/FeatureCard";

/**
 * Features Section Component
 * 
 * Displays core platform features in a responsive grid.
 * Each feature uses the reusable FeatureCard component.
 */

const features = [
  {
    id: "profiles",
    icon: <UserProfileIcon className="h-5 w-5" />,
    title: "Researcher Profiles",
    description:
      "Build a comprehensive academic identity. Showcase your publications, affiliations, and teaching contributions in one professional profile — like LinkedIn, but built for researchers.",
  },
  {
    id: "explainers",
    icon: <VideoIcon className="h-5 w-5" />,
    title: "Paper-wise Video Explainers",
    description:
      "Create short, focused explainer videos for each of your papers. Help others understand your research in minutes, not hours. Your work, your voice.",
  },
  {
    id: "teaching-score",
    icon: <ChartIcon className="h-5 w-5" />,
    title: "Teaching Credit Score",
    description:
      "Earn measurable teaching credit based on video quality, engagement, and peer feedback. A transparent metric that institutions can trust for evaluation.",
    highlighted: true,
  },
  {
    id: "vri",
    icon: <IdentifierIcon className="h-5 w-5" />,
    title: "Video Research Identifier",
    description:
      "Every explainer video gets a unique, citable VRI — like a DOI for video content. Make your teaching contributions as citable as your publications.",
  },
  {
    id: "recruitment",
    icon: <BuildingIcon className="h-5 w-5" />,
    title: "Recruitment & Evaluation Ready",
    description:
      "Hiring committees and tenure boards can assess teaching ability alongside research output. Your teaching impact, finally visible and verifiable.",
  },
];

export function Features() {
  return (
    <section id="features" className="pt-12 pb-20 sm:pt-16 sm:pb-28">
      <Container>
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium text-teal-600 mb-3 tracking-wide uppercase">
            Platform Features
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything researchers need to showcase teaching impact
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            PaperTalks bridges the gap between research excellence and teaching recognition.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant={feature.highlighted ? "highlighted" : "default"}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          All features designed with peer-review principles and academic integrity in mind.
        </p>
      </Container>
    </section>
  );
}

// Subtle, academic-style icons

function UserProfileIcon({ className }: { className?: string }) {
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

function ChartIcon({ className }: { className?: string }) {
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
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-3 3" />
    </svg>
  );
}

function IdentifierIcon({ className }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15V9" />
      <path d="M7 9h2.5a1.5 1.5 0 0 1 0 3H7" />
      <path d="M14 9v6" />
      <path d="M14 9h3" />
      <path d="M14 12h2" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
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
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

