import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { fullAddress } from "../../src/lib/content-helpers";
import { content, DESKTOP, isProductionBuild, isSupplied, PHONE, ROUTES } from "./helpers";

test.describe("language and routing", () => {
  for (const route of ROUTES) {
    test(`${route} is served in Vietnamese`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "vi");
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  test("no language switcher while only Vietnamese is published", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Chọn ngôn ngữ" })).toHaveCount(0);
    await expect(page.locator('a[href^="/en"]')).toHaveCount(0);
  });
});

test.describe("header on desktop", () => {
  test.use({ viewport: DESKTOP });

  test("shows all six navigation items in one row plus the booking action", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Điều hướng chính" }).first();
    const links = nav.getByRole("link");
    await expect(links).toHaveText(["Trang chủ", "Sản khoa", "Nhi khoa", "Bác sĩ", "Phòng khám", "Liên hệ"]);
    const tops = await links.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    await expect(page.locator("header").getByRole("link", { name: "Đặt lịch khám" })).toBeVisible();
  });

  test("marks the current page", async ({ page }) => {
    await page.goto("/nhi-khoa");
    const current = page.locator('header nav a[aria-current="page"]').first();
    await expect(current).toHaveText("Nhi khoa");
  });

  test("hides the mobile action bar", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-action-bar]")).toBeHidden();
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: PHONE });

  test("opens and closes with touch-sized targets", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Mở menu" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    const closeButton = page.getByRole("button", { name: "Đóng menu" });
    await expect(closeButton).toHaveAttribute("aria-expanded", "true");

    const panelLinks = page.locator("header [id] nav a");
    await expect(panelLinks.first()).toBeVisible();
    const heights = await panelLinks.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
    expect(heights.length).toBe(7); // six pages + booking
    for (const height of heights) expect(height).toBeGreaterThanOrEqual(44);

    await closeButton.click();
    await expect(panelLinks.first()).toBeHidden();
  });

  test("open menu covers the page below the header and stops it scrolling", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    const panel = page.locator("header [id]:has(nav)");
    const box = (await panel.boundingBox())!;
    const header = (await page.locator("header").boundingBox())!;
    // Starts at the header's bottom edge and reaches the bottom of the screen, so nothing shows through.
    expect(Math.abs(box.y - (header.y + header.height))).toBeLessThanOrEqual(1);
    expect(box.y + box.height).toBeGreaterThanOrEqual(PHONE.height - 1);
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });

  test("Escape closes the menu and returns focus to the button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator("header [id] nav a").first().focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("header [id] nav a").first()).toBeHidden();
    await expect(page.getByRole("button", { name: "Mở menu" })).toBeFocused();
  });

  test("action bar offers call, Zalo and booking without covering the footer", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("[data-action-bar]");
    await expect(bar).toBeVisible();
    await expect(bar.locator("li")).toHaveText([/Gọi/, /Zalo/, /Đặt lịch/]);
    await expect(bar.getByRole("link", { name: "Đặt lịch" })).toHaveAttribute("href", "/dat-lich");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const barTop = await bar.evaluate((el) => el.getBoundingClientRect().top);
    const footerBottom = await page
      .locator("footer")
      .evaluate((el) => el.getBoundingClientRect().bottom);
    expect(footerBottom).toBeLessThanOrEqual(barTop + 1);
  });
});

test.describe("footer", () => {
  test("contains clinic details, doctors, navigation, privacy and disclaimer", async ({ page }, testInfo) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "BS.CKII Vũ Duy Minh" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "BS.CKI Nguyễn Thị Thanh Xuân" })).toBeVisible();
    await expect(footer.getByText("Sản khoa", { exact: true }).first()).toBeVisible();
    await expect(footer.getByRole("link", { name: "Chính sách bảo mật" })).toBeVisible();
    await expect(footer.getByText(/không thay thế cho việc thăm khám/)).toBeVisible();
    for (const label of ["Trang chủ", "Sản khoa", "Nhi khoa", "Bác sĩ", "Phòng khám", "Liên hệ", "Đặt lịch"]) {
      await expect(footer.getByRole("navigation").getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    const { clinic } = content;
    const address = fullAddress(clinic);
    if (isSupplied(address)) await expect(footer.locator("[data-footer-address]")).toHaveText(address);
    if (isSupplied(clinic.phone)) await expect(footer.locator("[data-footer-phone]")).toHaveText(clinic.phone);
    const pendingCount = [address, clinic.phone, clinic.hours].filter((f) => !isSupplied(f)).length;
    await expect(footer.locator("[data-pending]")).toHaveCount(isProductionBuild(testInfo) ? 0 : pendingCount);
  });

  test("privacy link opens the privacy notice", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Chính sách bảo mật" }).click();
    await expect(page).toHaveURL(/\/chinh-sach-bao-mat$/);
    await expect(page.locator("h1")).toHaveText("Chính sách bảo mật");
  });
});

test.describe("accessibility", () => {
  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", "#main");
    await expect(focused).toBeVisible();
  });

  test("no transitions when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const duration = await page
      .locator("header nav a")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(duration.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
  });

  for (const route of ROUTES) {
    test(`${route} has no serious or critical axe violations`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("Vietnamese typography", () => {
  const sample = "Nguyễn Thị Thanh Xuân — ưỡng, ặ, ộ, ữ, Ỷ";

  test("loads Be Vietnam Pro with its Vietnamese glyphs for headings and body", async ({ page }) => {
    await page.goto("/");
    const result = await page.evaluate(async (text) => {
      const h = document.createElement("h2");
      const p = document.createElement("p");
      h.textContent = text;
      p.textContent = text;
      document.querySelector("main")!.prepend(h, p);
      await document.fonts.ready;
      const family = (el: Element) => getComputedStyle(el).fontFamily;
      const vietnameseFaceLoaded = [...document.fonts].some(
        (face) => /Be Vietnam Pro/i.test(face.family) && /U\+1EA0/i.test(face.unicodeRange) && face.status === "loaded",
      );
      return {
        heading: family(h),
        body: family(p),
        vietnameseFaceLoaded,
        allGlyphsAvailable: document.fonts.check(`600 32px ${family(h).split(",")[0]}`, text),
      };
    }, sample);
    expect(result.heading).toMatch(/Be Vietnam Pro/i);
    expect(result.body).toMatch(/Be Vietnam Pro/i);
    expect(result.vietnameseFaceLoaded).toBe(true);
    expect(result.allGlyphsAvailable).toBe(true);
  });
});
