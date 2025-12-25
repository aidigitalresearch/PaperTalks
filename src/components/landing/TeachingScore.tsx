import { Container } from "@/components/ui/container";

/**
 * Teaching Credit Score Section
 * 
 * Explains the unique Teaching Credit Score methodology:
 * - What it measures
 * - Why it's better than traditional teaching statements
 * - How institutions can use it
 * 
 * Includes static scoring visualization and beta disclaimers.
 */

export function TeachingScore() {
  return (
    <section id="teaching-score" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left: Content */}
          <div className="max-w-xl">
            {/* Section header */}
            <p className="text-sm font-medium text-teal-600 mb-3 tracking-wide uppercase">
              Your Teaching Impact, Quantified
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Teaching Credit Score
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              A transparent, measurable metric that captures your ability to communicate research effectively.
            </p>

            {/* What it measures */}
            <div className="mt-10">
              <h3 className="font-serif text-xl font-semibold text-stone-900 mb-4">
                What We Measure
              </h3>
              <ul className="space-y-3">
                {scoringFactors.map((factor) => (
                  <li key={factor.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircleIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <span className="font-medium text-stone-900">{factor.label}</span>
                      <span className="text-stone-600"> — {factor.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why it's better */}
            <div className="mt-10">
              <h3 className="font-serif text-xl font-semibold text-stone-900 mb-4">
                Why It&apos;s Better
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ComparisonCard
                  type="old"
                  title="Traditional Statements"
                  points={[
                    "Self-reported, unverifiable",
                    "Subjective descriptions",
                    "No standardized metrics",
                    "Updated once per year",
                  ]}
                />
                <ComparisonCard
                  type="new"
                  title="Teaching Credit Score"
                  points={[
                    "Evidence-based, verifiable",
                    "Objective measurements",
                    "Standardized across fields",
                    "Updates with each video",
                  ]}
                />
              </div>
            </div>

            {/* For institutions */}
            <div className="mt-10 p-6 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <InstitutionIcon className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    For Institutions
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                    Use Teaching Credit Scores in hiring decisions, tenure reviews, and faculty development. 
                    Access aggregate analytics and compare candidates objectively — no more relying solely on teaching statements.
                  </p>
                  <a
                    href="#institutions"
                    className="mt-3 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    Learn about institutional access
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Score Visualization */}
          <div className="lg:sticky lg:top-24">
            <ScoreVisualization />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-stone-200">
          <p className="text-xs text-stone-500 text-center max-w-2xl mx-auto leading-relaxed">
            <strong>Beta Methodology Notice:</strong> The Teaching Credit Score is currently in development. 
            Our scoring algorithm is being refined with input from academic institutions and researchers. 
            Scores shown are illustrative and subject to change as we validate our methodology through peer review.
          </p>
        </div>
      </Container>
    </section>
  );
}

const scoringFactors = [
  {
    label: "Clarity & Structure",
    description: "How well you organize and present complex ideas",
  },
  {
    label: "Engagement Metrics",
    description: "Watch time, completion rates, and viewer retention",
  },
  {
    label: "Peer Feedback",
    description: "Ratings and reviews from fellow researchers",
  },
  {
    label: "Accessibility",
    description: "Captions, visual aids, and inclusive presentation",
  },
];

interface ComparisonCardProps {
  type: "old" | "new";
  title: string;
  points: string[];
}

function ComparisonCard({ type, title, points }: ComparisonCardProps) {
  return (
    <div
      className={`rounded-lg p-4 ${
        type === "old"
          ? "bg-stone-100 border border-stone-200"
          : "bg-teal-50 border border-teal-200"
      }`}
    >
      <h4
        className={`text-sm font-semibold mb-3 ${
          type === "old" ? "text-stone-600" : "text-teal-700"
        }`}
      >
        {type === "old" ? "❌ " : "✓ "}
        {title}
      </h4>
      <ul className="space-y-1.5">
        {points.map((point, i) => (
          <li
            key={i}
            className={`text-xs ${
              type === "old" ? "text-stone-500" : "text-teal-600"
            }`}
          >
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Static score visualization component
 * Shows a sample Teaching Credit Score breakdown
 */
function ScoreVisualization() {
  const overallScore = 87;
  const breakdown = [
    { label: "Clarity", score: 92, color: "bg-teal-500" },
    { label: "Engagement", score: 85, color: "bg-teal-400" },
    { label: "Peer Rating", score: 88, color: "bg-teal-500" },
    { label: "Accessibility", score: 82, color: "bg-teal-400" },
  ];

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
          Sample Score
        </p>
        <h4 className="font-serif text-lg font-semibold text-stone-900">
          Dr. Sarah Chen
        </h4>
        <p className="text-sm text-stone-600">
          Computational Biology, MIT
        </p>
      </div>

      {/* Main score circle */}
      <div 
        className="relative mx-auto w-40 h-40 mb-8"
        role="img"
        aria-label={`Teaching Credit Score: ${overallScore} out of 100`}
      >
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#e7e5e4"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#0d9488"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${overallScore * 2.64} 264`}
            className="transition-all duration-1000"
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
          <span className="text-4xl font-bold text-stone-900">{overallScore}</span>
          <span className="text-xs text-stone-500 font-medium">out of 100</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-stone-600">{item.label}</span>
              <span className="font-semibold text-stone-900">{item.score}</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="mt-8 pt-6 border-t border-stone-100">
        <p className="text-xs text-stone-500 text-center mb-3">Achievements</p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge label="Top 10%" icon="🏆" />
          <Badge label="5 Videos" icon="🎬" />
          <Badge label="Peer Verified" icon="✓" />
        </div>
      </div>

      {/* VRI Example */}
      <div className="mt-6 p-4 bg-stone-50 rounded-lg">
        <p className="text-xs text-stone-500 text-center mb-1">Video Research Identifier</p>
        <p className="text-sm font-mono text-center text-teal-600 font-medium">
          VRI:10.papertalks/2024.chen.0042
        </p>
      </div>
    </div>
  );
}

function Badge({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-xs font-medium text-stone-700">
      <span>{icon}</span>
      {label}
    </span>
  );
}

// Icons

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function InstitutionIcon({ className }: { className?: string }) {
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
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

