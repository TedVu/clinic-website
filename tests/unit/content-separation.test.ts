import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Vietnamese-specific letters (with diacritics). Any of these in UI code means copy has leaked
// out of src/content or src/locales, which would block translation.
const VIETNAMESE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export function findVietnamese(root: string): string[] {
  const hits: string[] = [];
  const visit = (path: string) => {
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path)) visit(join(path, entry));
      return;
    }
    if (!/\.(tsx?|css)$/.test(path)) return;
    readFileSync(path, "utf8")
      .split("\n")
      .forEach((line, index) => {
        if (VIETNAMESE.test(line)) hits.push(`${relative(process.cwd(), path)}:${index + 1}: ${line.trim()}`);
      });
  };
  visit(root);
  return hits;
}

describe("content separation", () => {
  it("keeps Vietnamese text out of components and routes", () => {
    expect([...findVietnamese("src/components"), ...findVietnamese("src/app")]).toEqual([]);
  });

  it("detects a Vietnamese string when one is present", () => {
    expect(VIETNAMESE.test('<button>Đặt lịch</button>')).toBe(true);
    expect(VIETNAMESE.test("<button>{t.actions.book}</button>")).toBe(false);
  });
});
