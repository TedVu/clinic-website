import { expect, test } from "@playwright/test";

test("home page is served directly at / in Vietnamese", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  expect(response?.request().redirectedFrom()).toBeNull();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
});

test("unknown paths return the 404 page", async ({ page }) => {
  const response = await page.goto("/khong-ton-tai");
  expect(response?.status()).toBe(404);
});
