import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { collectPending, LAUNCH_BLOCKING } from "@/lib/content-check";

// Keeps the clinic's checklist in sync with the content model.
const checklist = readFileSync("docs/content-checklist.md", "utf8");

describe("docs/content-checklist.md", () => {
  it("lists every pending fact with its exact label and field code", () => {
    for (const item of collectPending(getContent("vi"))) {
      expect(checklist, item.path).toContain(item.label);
      expect(checklist, item.path).toContain(`\`${item.path}\``);
    }
  });

  it("covers every launch-blocking field, the services rule and privacy approval", () => {
    for (const path of LAUNCH_BLOCKING) expect(checklist).toContain(`\`${path}\``);
    expect(checklist).toContain("`services`");
    expect(checklist).toContain("`copy.privacy.approved`");
  });

  it("lists every suggested service for confirmation", () => {
    for (const service of getContent("vi").services) expect(checklist).toContain(service.name);
  });
});
