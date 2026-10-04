import { describe, expect, it } from "vitest";
import { getDictionary, type Dictionary } from "@/locales";

describe("dictionaries", () => {
  it("rejects an incomplete translation at compile time", () => {
    // `npm run typecheck` fails if this partial dictionary ever type-checks.
    // @ts-expect-error missing keys (nav, a11y, actions, ...)
    const partial = { languageName: "English" } satisfies Dictionary;
    expect(partial.languageName).toBe("English");
  });

  it("provides the Vietnamese dictionary", () => {
    expect(getDictionary("vi").actions.book).toBe("Đặt lịch khám");
  });
});
