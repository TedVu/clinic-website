import type { ReactNode } from "react";

/**
 * Editorial section: heading in a narrow left column, content in the wide right column on desktop;
 * stacked on phones. Sections are separated by a hairline rule, not boxes.
 */
export function Section({
  id,
  heading,
  intro,
  children,
  tone = "plain",
}: {
  id?: string;
  heading: string;
  intro?: ReactNode;
  children: ReactNode;
  tone?: "plain" | "surface";
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`border-t border-rule ${tone === "surface" ? "bg-surface" : ""}`}
    >
      <div className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 id={headingId} className="text-h2">
            {heading}
          </h2>
          {intro && <div className="mt-4 max-w-md text-ink-muted">{intro}</div>}
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
