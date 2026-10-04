import { afterEach, describe, expect, it, vi } from "vitest";
import { pending } from "@/content/pending";
import {
  factText,
  fill,
  formatDays,
  formatHours,
  fullAddress,
  mapsHref,
  telHref,
} from "@/lib/content-helpers";
import { getDictionary } from "@/locales";
import { pendingClinic } from "./fixtures";

afterEach(() => vi.unstubAllEnvs());
const t = getDictionary("vi");

describe("telHref", () => {
  it("converts a Vietnamese number to E.164", () => {
    expect(telHref("0901 234 567")).toBe("tel:+84901234567");
    expect(telHref("028.3822.1234")).toBe("tel:+842838221234");
    expect(telHref("+84 901 234 567")).toBe("tel:+84901234567");
  });

  it("returns undefined while the phone is pending", () => {
    expect(telHref(pending("Số điện thoại"))).toBeUndefined();
  });
});

describe("factText", () => {
  it("shows the label in brackets on previews and nothing in production", () => {
    vi.stubEnv("SITE_ENV", "preview");
    expect(factText(pending("Tên phòng khám"))).toBe("[Tên phòng khám]");
    vi.stubEnv("SITE_ENV", "production");
    expect(factText(pending("Tên phòng khám"))).toBe("");
    expect(factText("Phòng khám A")).toBe("Phòng khám A");
  });
});

describe("opening hours", () => {
  it("collapses consecutive days into a range", () => {
    expect(formatDays(["mon", "tue", "wed", "thu", "fri"], t)).toBe("Thứ Hai – Thứ Sáu");
  });

  it("lists non-consecutive days", () => {
    expect(formatDays(["sat", "mon"], t)).toBe("Thứ Hai, Thứ Bảy");
  });

  it("formats rows", () => {
    expect(formatHours([{ days: ["sun"], opens: "08:00", closes: "11:30" }], t)).toEqual([
      "Chủ nhật: 08:00 – 11:30",
    ]);
  });
});

describe("address and maps", () => {
  it("stays pending until street and ward are supplied", () => {
    expect(fullAddress(pendingClinic())).toMatchObject({ kind: "pending" });
    expect(mapsHref(pendingClinic())).toBeUndefined();
  });

  it("builds a Maps search from the address when no Maps link is supplied", () => {
    const clinic = {
      ...pendingClinic(),
      name: "Phòng khám A",
      address: { street: "1 Lê Lợi", ward: "Phường Bến Thành", city: "TP. Hồ Chí Minh", country: "VN" as const },
    };
    expect(fullAddress(clinic)).toBe("1 Lê Lợi, Phường Bến Thành, TP. Hồ Chí Minh");
    expect(mapsHref(clinic)).toMatch(/^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/);
    expect(mapsHref({ ...clinic, mapsUrl: "https://maps.app.goo.gl/abc" })).toBe(
      "https://maps.app.goo.gl/abc",
    );
  });
});

describe("fill", () => {
  it("replaces tokens and leaves unknown ones", () => {
    expect(fill("{name} – {specialty} {x}", { name: "BS. A", specialty: "Nhi khoa" })).toBe(
      "BS. A – Nhi khoa {x}",
    );
  });
});
