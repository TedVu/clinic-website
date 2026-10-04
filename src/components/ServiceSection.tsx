import type { Service } from "@/content/schema";
import { isProduction } from "@/lib/env";
import { PendingMarker } from "./Fact";

/**
 * Services as a typographic definition list: name, then a plain-language summary.
 * One column on phones, two on wide screens. Each item keeps a stable anchor id so it can later
 * become its own page without changing links.
 */
export function ServiceSection({
  services,
  columns = 2,
  unconfirmedLabel,
}: {
  services: Service[];
  columns?: 1 | 2;
  /** Marker text shown on previews for services the clinic hasn't confirmed yet. */
  unconfirmedLabel: string;
}) {
  return (
    <dl className={`grid gap-x-10 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {services.map((service) => (
        <div key={service.id} id={service.id} data-service={service.id} className="border-t border-rule py-5">
          <dt className="font-medium">{service.name}</dt>
          <dd className="mt-1.5 text-ink-muted">{service.summary}</dd>
          {!service.confirmed && !isProduction() && (
            <dd className="mt-2">
              <PendingMarker label={unconfirmedLabel} inline />
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}
