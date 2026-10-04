import { test } from "@playwright/test";
import { DESKTOP, PHONE, ROUTES, TABLET } from "./helpers";

// Full-page screenshots for design review, in both preview (markers) and production mode
// (pending facts omitted). Run with: SCREENSHOTS=1 npx playwright test screenshots
// Output: review-screenshots/<project>/<page>-<width>.png
test.skip(!process.env.SCREENSHOTS, "set SCREENSHOTS=1 to capture review screenshots");

for (const viewport of [PHONE, TABLET, DESKTOP]) {
  test(`capture all pages at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    for (const route of ROUTES) {
      await page.goto(route);
      const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "_");
      await page.screenshot({
        path: `review-screenshots/${testInfo.project.name}/${name}-${viewport.width}.png`,
        fullPage: true,
      });
    }
  });
}
