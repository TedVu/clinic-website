import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Fact } from "@/components/Fact";
import { getContent } from "@/content";
import { pending } from "@/content/pending";
import { confirmedServices, visibleServices } from "@/lib/content-helpers";

afterEach(() => vi.unstubAllEnvs());

const render = (value: string | ReturnType<typeof pending>) =>
  renderToStaticMarkup(<Fact value={value}>{(v) => <strong>{v}</strong>}</Fact>);

describe("<Fact>", () => {
  it.each(["production", "preview", "development"])("renders a supplied value in %s", (env) => {
    vi.stubEnv("SITE_ENV", env);
    expect(render("0901 234 567")).toBe("<strong>0901 234 567</strong>");
  });

  it("renders nothing for a pending fact in production", () => {
    vi.stubEnv("SITE_ENV", "production");
    expect(render(pending("Thông tin gửi xe"))).toBe("");
  });

  it.each(["preview", "development"])("renders a labelled marker for a pending fact in %s", (env) => {
    vi.stubEnv("SITE_ENV", env);
    const html = render(pending("Thông tin gửi xe"));
    expect(html).toContain("data-pending");
    expect(html).toContain("Cần bổ sung: Thông tin gửi xe");
  });
});

describe("service selectors", () => {
  const { services } = getContent("vi");

  it("hides unconfirmed services in production", () => {
    vi.stubEnv("SITE_ENV", "production");
    const unconfirmed = services.map((s) => ({ ...s, confirmed: false }));
    expect(visibleServices(unconfirmed, "pediatrics")).toEqual([]);
  });

  it("shows unconfirmed services on previews so they can be reviewed", () => {
    vi.stubEnv("SITE_ENV", "preview");
    const unconfirmed = services.map((s) => ({ ...s, confirmed: false }));
    expect(visibleServices(unconfirmed, "pediatrics").length).toBeGreaterThan(0);
  });

  it("confirmedServices returns only confirmed entries", () => {
    const mixed = services.map((s, i) => ({ ...s, confirmed: i === 0 }));
    expect(confirmedServices(mixed, "obstetrics").map((s) => s.id)).toEqual([services[0]!.id]);
  });
});
