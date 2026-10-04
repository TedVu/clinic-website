import { describe, expect, expectTypeOf, it } from "vitest";
import { isPending, isSupplied, pending, type Fact } from "@/content/pending";

describe("Fact<T>", () => {
  it("accepts a supplied value or pending(label)", () => {
    const supplied: Fact<string> = "0901 234 567";
    const missing: Fact<string> = pending("Số điện thoại phòng khám");
    expect(isSupplied(supplied)).toBe(true);
    expect(isPending(missing)).toBe(true);
    expect(missing.label).toBe("Số điện thoại phòng khám");

    expectTypeOf<Fact<string>>().toEqualTypeOf<string | ReturnType<typeof pending>>();
    // @ts-expect-error a number is not a Fact<string>
    const wrong: Fact<string> = 42;
    expect(wrong).toBe(42);
  });

  it("narrows to the supplied type", () => {
    const value: Fact<string[]> = ["Bằng A"];
    if (isSupplied(value)) {
      expectTypeOf(value).toEqualTypeOf<string[]>();
    }
  });

  it("does not treat ordinary objects as pending", () => {
    expect(isPending({ label: "x" })).toBe(false);
    expect(isPending(null)).toBe(false);
  });
});
