import { describe, expect, it } from "vitest";
import { getContent } from "@/content";
import { allPaths, doctorHref, enabledLocales, href, NAV_KEYS } from "@/lib/routes";

describe("routes", () => {
  const paths = allPaths("vi", getContent("vi").doctors.map((d) => d.slug));

  it("serves Vietnamese at the root without a locale prefix", () => {
    expect(href("home")).toBe("/");
    expect(href("obstetrics")).toBe("/san-khoa");
    expect(paths.some((p) => p.startsWith("/vi"))).toBe(false);
  });

  it("uses lowercase ASCII words separated by hyphens", () => {
    for (const path of paths) expect(path).toMatch(/^\/([a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*)?$/);
  });

  it("has a page per doctor", () => {
    expect(doctorHref("vu-duy-minh")).toBe("/bac-si/vu-duy-minh");
    expect(paths).toContain("/bac-si/nguyen-thi-thanh-xuan");
  });

  it("navigation has the six items from the brief, in order", () => {
    expect(NAV_KEYS).toEqual(["home", "obstetrics", "pediatrics", "doctors", "clinic", "contact"]);
  });

  it("publishes Vietnamese only for now", () => {
    expect(enabledLocales).toEqual(["vi"]);
  });
});
