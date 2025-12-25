import { cn } from "@/lib/utils";

/**
 * FeatureCard Component
 * 
 * Reusable card for displaying platform features.
 * Designed for flexibility across different sections and layouts.
 * 
 * @example
 * <FeatureCard
 *   icon={<UserIcon />}
 *   title="Researcher Profiles"
 *   description="Build your academic identity..."
 * />
 */

interface FeatureCardProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional highlight/accent variant */
  variant?: "default" | "highlighted";
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  variant = "default",
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-xl border p-6 transition-all duration-200",
        variant === "default" && [
          "border-stone-200 bg-white",
          "hover:border-stone-300 hover:shadow-md",
        ],
        variant === "highlighted" && [
          "border-teal-200 bg-teal-50",
          "hover:border-teal-300 hover:shadow-md",
        ],
        className
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors",
          variant === "default" && "bg-stone-100 text-stone-600 group-hover:bg-teal-100 group-hover:text-teal-700",
          variant === "highlighted" && "bg-teal-100 text-teal-700"
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-stone-600">
        {description}
      </p>
    </article>
  );
}

