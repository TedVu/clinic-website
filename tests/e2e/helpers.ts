import type { Page, TestInfo } from "@playwright/test";
import { getContent } from "../../src/content";
import { isSupplied } from "../../src/content/pending";

export const ROUTES = [
  "/",
  "/san-khoa",
  "/nhi-khoa",
  "/bac-si",
  "/bac-si/vu-duy-minh",
  "/bac-si/nguyen-thi-thanh-xuan",
  "/phong-kham",
  "/lien-he",
  "/dat-lich",
  "/chinh-sach-bao-mat",
] as const;

export const PHONE = { width: 360, height: 740 };
export const TABLET = { width: 768, height: 1024 };
export const DESKTOP = { width: 1280, height: 800 };

/** True when running against the production-mode build (pending facts hidden). */
export const isProductionBuild = (testInfo: TestInfo) => testInfo.project.name === "production";

export async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((text) => JSON.parse(text) as Record<string, unknown>);
}

// Expectations are computed from the content files, so tests stay valid as the clinic supplies facts.
export const content = getContent("vi");
export { isSupplied };
