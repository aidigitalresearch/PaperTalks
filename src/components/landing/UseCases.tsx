import { Container } from "@/components/ui/container";

/**
 * Trust & Use-Cases Section
 * 
 * Builds credibility by showing:
 * - Institutional use-cases
 * - Placeholder partner logos
 * - Trust language for academic audience
 */

const useCases = [
  {
    id: "recruitment",
    icon: <BriefcaseIcon className="h-6 w-6" />,
    title: "Faculty Recruitment",
    description:
      "Evaluate candidates' teaching abilities with objective, comparable metrics. Go beyond the teaching statement.",
  },
  {
    id: "phd-postdoc",
    icon: <GraduateIcon className="h-6 w-6" />,
    title: "PhD & Postdoc Evaluation",
    description:
      "Assess early-career researchers on their ability to communicate complex research to diverse audiences.",
  },
  {
    id: "fellowship",
    icon: <AwardIcon className="h-6 w-6" />,
    title: "Fellowship Review",
    description:
      "Include teaching impact evidence in fellowship applications with citable, verifiable VRI identifiers.",
  },
  {
    id: "grants",
    icon: <ChartBarIcon className="h-6 w-6" />,
    title: "Grant Impact Reporting",
    description:
      "Demonstrate broader impact through measurable public engagement and knowledge dissemination metrics.",
  },
];

// Institution data with colors
const institutions = [
  // Universities
  { name: "Stanford", abbr: "S", color: "#8C1515", category: "university" },
  { name: "MIT", abbr: "MIT", color: "#A31F34", category: "university" },
  { name: "Oxford", abbr: "Ox", color: "#002147", category: "university" },
  { name: "Cambridge", abbr: "Cam", color: "#A3C1AD", category: "university" },
  { name: "ETH Zürich", abbr: "ETH", color: "#1F407A", category: "university" },
  { name: "Harvard", abbr: "H", color: "#A51C30", category: "university" },
  // Journals
  { name: "Nature", abbr: "N", color: "#C8102E", category: "journal" },
  { name: "Science", abbr: "Sci", color: "#003366", category: "journal" },
  { name: "Cell", abbr: "C", color: "#0077B6", category: "journal" },
  { name: "PLOS", abbr: "P", color: "#3EB489", category: "journal" },
  // Funding
  { name: "NIH", abbr: "NIH", color: "#20558A", category: "funding" },
  { name: "NSF", abbr: "NSF", color: "#003366", category: "funding" },
  { name: "ERC", abbr: "ERC", color: "#003399", category: "funding" },
  { name: "Wellcome", abbr: "W", color: "#F0AB00", category: "funding" },
];

export function UseCases() {
  return (
    <section id="institutions" className="py-20 sm:py-28 bg-stone-50">
      <Container>
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium text-teal-600 mb-3 tracking-wide uppercase">
            Built for Academia
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Trusted by Institutions Worldwide
          </h2>
          <p className="mt-4 text-lg text-stone-600">
            From hiring committees to grant reviewers, PaperTalks provides the evidence-based 
            teaching metrics that modern academic evaluation demands.
          </p>
        </div>

        {/* Use-cases grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.id} {...useCase} />
          ))}
        </div>

        {/* Logo cloud section - light, dynamic */}
        <div className="mt-8 pt-12 border-t border-stone-200">
          <h3 className="text-center text-lg font-serif font-semibold text-stone-900 mb-2">
            Designed for Seamless Integration
          </h3>
          <p className="text-center text-sm text-stone-500 mb-10 max-w-lg mx-auto">
            Built to work with the institutions and standards researchers already trust
          </p>

          {/* Animated logo marquee */}
          <div className="relative overflow-hidden py-6">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling container */}
            <div className="flex animate-marquee gap-6" aria-label="Partner institutions carousel">
              {/* First set */}
              {institutions.map((inst) => (
                <InstitutionLogo key={`a-${inst.name}`} {...inst} />
              ))}
              {/* Duplicate for seamless loop */}
              {institutions.map((inst) => (
                <InstitutionLogo key={`b-${inst.name}`} {...inst} aria-hidden="true" />
              ))}
            </div>
          </div>

          {/* Trust note */}
          <p className="mt-8 text-center text-xs text-stone-400 max-w-xl mx-auto">
            <em>
              Logos shown represent integration goals and academic alignment. 
              Formal partnerships to be announced.
            </em>
          </p>
        </div>

        {/* Credibility statement */}
        <figure className="mt-16 p-10 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-sm text-center">
          <QuoteIcon className="h-10 w-10 text-teal-500 mx-auto mb-6" aria-hidden="true" />
          <blockquote className="font-serif text-xl sm:text-2xl text-stone-800 max-w-2xl mx-auto leading-relaxed">
            &ldquo;Teaching impact has always been hard to measure. PaperTalks offers a 
            transparent, scalable approach that aligns with how we already evaluate research.&rdquo;
          </blockquote>
          <figcaption className="mt-8">
            <span className="font-semibold text-stone-900 text-lg">Advisory Board Member</span>
            <br />
            <cite className="text-sm text-stone-500 not-italic">Major Research University</cite>
          </figcaption>
          <p className="mt-6 text-xs text-stone-400 inline-block px-3 py-1.5 rounded-full bg-stone-100">
            * Quote represents intended positioning. Advisory board forming.
          </p>
        </figure>
      </Container>
    </section>
  );
}

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function UseCaseCard({ icon, title, description }: UseCaseCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-stone-600">
        {description}
      </p>
    </div>
  );
}

interface InstitutionLogoProps {
  name: string;
  abbr: string;
  color: string;
  category: string;
}

function InstitutionLogo({ name, abbr, color, category }: Omit<InstitutionLogoProps, 'index'>) {
  // Category icons
  const categoryIcon = {
    university: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3L2 9l10 6 10-6-10-6z" />
        <path d="M2 17l10 6 10-6" />
        <path d="M2 13l10 6 10-6" />
      </svg>
    ),
    journal: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    funding: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </svg>
    ),
  };

  return (
    <div 
      className="group flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl 
                 bg-white border border-stone-200 shadow-sm
                 transition-all duration-300 hover:shadow-md hover:border-stone-300 hover:-translate-y-1"
    >
      {/* Institution icon/badge */}
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-sm
                   transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {abbr.length <= 2 ? abbr : abbr.slice(0, 2)}
      </div>
      
      {/* Name and category */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-stone-800 whitespace-nowrap">
          {name}
        </span>
        <span className="flex items-center gap-1 text-xs text-stone-400 capitalize">
          {categoryIcon[category as keyof typeof categoryIcon]}
          {category}
        </span>
      </div>
    </div>
  );
}

// Icons

function BriefcaseIcon({ className }: { className?: string }) {
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
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12v.01" />
    </svg>
  );
}

function GraduateIcon({ className }: { className?: string }) {
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
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
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

function ChartBarIcon({ className }: { className?: string }) {
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
      <rect x="7" y="10" width="3" height="8" rx="1" />
      <rect x="12" y="6" width="3" height="12" rx="1" />
      <rect x="17" y="12" width="3" height="6" rx="1" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

