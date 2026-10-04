import { isPending } from "@/content/pending";
import type { SiteContent, SpecialtyKey } from "@/content/schema";

/**
 * Facts the site cannot go live without. A production build fails while any of these is pending.
 * Everything else that is pending is optional: hidden on the live site, flagged on previews.
 */
export const LAUNCH_BLOCKING = [
  "clinic.name",
  "clinic.address.street",
  "clinic.address.ward",
  "clinic.phone",
  "clinic.zaloUrl",
  "clinic.hours",
  "clinic.siteUrl",
  "clinic.bookingSteps",
] as const;

export type PendingItem = { path: string; label: string; blocking: boolean };
export type ContentIssue = { path: string; message: string };

export type ContentCheckResult = {
  ok: boolean;
  /** Problems that block a production launch. */
  blocking: ContentIssue[];
  /** Every pending fact, launch-blocking or not. */
  pending: PendingItem[];
};

function walk(value: unknown, path: string, visit: (path: string, value: unknown) => boolean) {
  if (!visit(path, value)) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, visit));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      walk(child, path ? `${path}.${key}` : key, visit);
    }
  }
}

/** Lists every pending fact in the content, with doctors addressed by slug. */
export function collectPending(content: SiteContent): PendingItem[] {
  const blockingPaths = new Set<string>(LAUNCH_BLOCKING);
  const items: PendingItem[] = [];
  const roots: [string, unknown][] = [
    ["clinic", content.clinic],
    ...content.doctors.map((d): [string, unknown] => [`doctors.${d.slug}`, d]),
  ];
  for (const [rootPath, root] of roots) {
    walk(root, rootPath, (path, value) => {
      if (isPending(value)) {
        items.push({ path, label: value.label, blocking: blockingPaths.has(path) });
        return false;
      }
      return true;
    });
  }
  return items;
}

function emptyStrings(content: SiteContent): ContentIssue[] {
  const issues: ContentIssue[] = [];
  walk(content, "", (path, value) => {
    if (typeof value === "string" && value.trim() === "" && !path.endsWith("bookingHref")) {
      issues.push({ path, message: 'Empty text. Use pending("...") for facts not supplied yet.' });
    }
    return !isPending(value);
  });
  return issues;
}

export function checkContent(content: SiteContent): ContentCheckResult {
  const pending = collectPending(content);
  const blocking: ContentIssue[] = pending
    .filter((item) => item.blocking)
    .map((item) => ({ path: item.path, message: `Missing: ${item.label}` }));

  for (const key of Object.keys(content.specialties) as SpecialtyKey[]) {
    const confirmed = content.services.filter((s) => s.specialty === key && s.confirmed);
    if (confirmed.length === 0) {
      blocking.push({
        path: `services[${key}]`,
        message: `No confirmed service for ${content.specialties[key].name}. Set confirmed: true on at least one.`,
      });
    }
  }

  if (!content.copy.privacy.approved) {
    blocking.push({
      path: "copy.privacy.approved",
      message: "Privacy notice not yet approved by the clinic.",
    });
  }

  blocking.push(...emptyStrings(content));

  return { ok: blocking.length === 0, blocking, pending };
}

export function formatReport(result: ContentCheckResult): string {
  const optional = result.pending.filter((item) => !item.blocking);
  const lines = [
    `Launch-blocking: ${result.blocking.length}`,
    ...result.blocking.map((issue) => `  x ${issue.path}: ${issue.message}`),
    "",
    `Optional pending (hidden on the live site): ${optional.length}`,
    ...optional.map((item) => `  - ${item.path}: ${item.label}`),
  ];
  return lines.join("\n");
}
