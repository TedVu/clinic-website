import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { pending } from "@/content/pending";
import { checkContent, collectPending, formatReport, LAUNCH_BLOCKING } from "@/lib/content-check";
import { completeContent, pendingClinic, pendingDoctor } from "./fixtures";

describe("checkContent", () => {
  it("fails when every clinic fact is pending and names each one", () => {
    const result = checkContent({ ...completeContent(), clinic: pendingClinic() });
    expect(result.ok).toBe(false);
    expect(result.blocking.map((i) => i.path).sort()).toEqual([...LAUNCH_BLOCKING].sort());
  });

  it("fails when only the phone number is missing", () => {
    const content = completeContent();
    content.clinic.phone = pending("Số điện thoại phòng khám");
    const result = checkContent(content);
    expect(result.ok).toBe(false);
    expect(result.blocking).toEqual([
      { path: "clinic.phone", message: "Missing: Số điện thoại phòng khám" },
    ]);
  });

  it("passes when all launch-blocking facts are supplied, even with optional facts pending", () => {
    const content = completeContent();
    content.clinic.parking = pending("Thông tin gửi xe");
    const result = checkContent(content);
    expect(result.ok).toBe(true);
    expect(result.pending.map((i) => i.path)).toEqual(["clinic.parking"]);
    expect(result.pending.every((item) => !item.blocking)).toBe(true);
  });

  it("fails when a specialty has no confirmed service", () => {
    const content = completeContent();
    content.services = content.services.map((s) =>
      s.specialty === "pediatrics" ? { ...s, confirmed: false } : s,
    );
    const result = checkContent(content);
    expect(result.ok).toBe(false);
    expect(result.blocking.map((i) => i.path)).toEqual(["services[pediatrics]"]);
  });

  it("fails when the privacy notice is not approved", () => {
    const content = completeContent();
    content.copy.privacy.approved = false;
    expect(checkContent(content).blocking.map((i) => i.path)).toEqual(["copy.privacy.approved"]);
  });

  it("rejects empty strings used as placeholders", () => {
    const content = completeContent();
    content.clinic.parking = "";
    expect(checkContent(content).blocking.map((i) => i.path)).toEqual(["clinic.parking"]);
  });
});

describe("collectPending", () => {
  it("addresses doctor facts by slug and marks them optional", () => {
    const items = collectPending({ ...getContent("vi"), doctors: [pendingDoctor(0)] });
    const item = items.find((i) => i.path === "doctors.vu-duy-minh.qualifications");
    expect(item).toMatchObject({ blocking: false });
  });
});

describe("formatReport", () => {
  it("lists launch-blocking and optional items separately", () => {
    const report = formatReport(checkContent({ ...completeContent(), clinic: pendingClinic() }));
    expect(report).toMatch(/^Launch-blocking: \d+/);
    expect(report).toContain("Optional pending");
    expect(report).toContain("x clinic.phone: Missing:");
    expect(report).toContain("- clinic.parking:");
  });
});
