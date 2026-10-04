import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteEnv, isProduction } from "@/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteEnv", () => {
  it("defaults to development when unset", () => {
    vi.stubEnv("SITE_ENV", undefined);
    expect(getSiteEnv()).toBe("development");
  });

  it.each(["production", "preview", "development"] as const)("accepts %s", (value) => {
    vi.stubEnv("SITE_ENV", value);
    expect(getSiteEnv()).toBe(value);
  });

  it("falls back to development for unknown values", () => {
    vi.stubEnv("SITE_ENV", "staging");
    expect(getSiteEnv()).toBe("development");
    expect(isProduction()).toBe(false);
  });
});
