import { expect, test } from "@playwright/test";
import { PHONE } from "./helpers";

// Verifies the single booking destination. Needs a build with an external booking URL:
//   E2E_BOOKING_HREF=https://booking.example.vn npm run test:e2e -- booking-href
const external = process.env.E2E_BOOKING_HREF;
test.skip(!external, "set E2E_BOOKING_HREF to run");

test("every booking action points to the configured destination", async ({ page }) => {
  const checks: [string, string][] = [
    ["/", "header a.btn-primary"],
    ["/", 'section[aria-labelledby="hero-heading"] [data-booking-link]'],
    ["/bac-si/vu-duy-minh", "article [data-booking-link]"],
    ["/san-khoa", "[data-booking-link]"],
    ["/nhi-khoa", "[data-booking-link]"],
  ];
  for (const [route, selector] of checks) {
    await page.goto(route);
    await expect(page.locator(selector).first()).toHaveAttribute("href", external!);
  }
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await expect(page.locator("[data-action-bar]").getByRole("link", { name: "Đặt lịch" })).toHaveAttribute(
    "href",
    external!,
  );
});
