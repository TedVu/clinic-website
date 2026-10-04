/**
 * A fact the clinic has not supplied yet. Use `pending("what is needed")` instead of an
 * empty string, a guess, or lorem ipsum. The label is shown to reviewers on preview builds
 * and listed by `npm run content:report`; production pages omit pending facts entirely.
 */
export type Pending = { readonly kind: "pending"; readonly label: string };

/** A value that is either supplied by the clinic or explicitly pending. */
export type Fact<T> = T | Pending;

export function pending(label: string): Pending {
  return { kind: "pending", label };
}

export function isPending(value: unknown): value is Pending {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { kind?: unknown }).kind === "pending" &&
    typeof (value as { label?: unknown }).label === "string"
  );
}

export function isSupplied<T>(value: Fact<T>): value is T {
  return !isPending(value);
}
