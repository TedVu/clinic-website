import { expect, test } from "@playwright/test";
import { content, isProductionBuild, isSupplied, jsonLd, ROUTES } from "./helpers";

test("doctor page title and canonical", async ({ page }) => {
  await page.goto("/bac-si/vu-duy-minh");
  await expect(page).toHaveTitle(/^BS\.CKII Vũ Duy Minh.*Sản khoa/);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/bac-si\/vu-duy-minh$/);
});

test("home page H1 names both specialties and the district", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  for (const term of ["Sản", "Nhi", content.clinic.district]) await expect(h1).toContainText(term);
});

for (const doctor of content.doctors) {
  test(`${doctor.slug}: H1, title and Physician JSON-LD share the credential prefix`, async ({
    page,
  }) => {
    const fullName = `${doctor.title} ${doctor.name}`;
    await page.goto(`/bac-si/${doctor.slug}`);
    await expect(page.locator("h1")).toHaveText(fullName);
    expect(await page.title()).toMatch(new RegExp(`^${fullName.replace(/\./g, "\\.")} `));
    const physician = (await jsonLd(page)).find((b) => [b["@type"]].flat().includes("Physician"));
    expect(physician!.name).toBe(fullName);
  });
}

test("every page has a unique title and description", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
  }
  expect(titles.size).toBe(ROUTES.length);
  expect(descriptions.size).toBe(ROUTES.length);
});

test("Open Graph metadata and share image", async ({ page, request }) => {
  await page.goto("/");
  for (const property of ["og:title", "og:description", "og:url", "og:site_name", "og:image"]) {
    await expect(page.locator(`meta[property="${property}"]`)).toHaveAttribute("content", /.+/);
  }
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "vi_VN");
  const image = await request.get("/og.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");
});

test("indexing follows the build type", async ({ page, request }, testInfo) => {
  await page.goto("/");
  const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");
  const robotsTxt = await (await request.get("/robots.txt")).text();
  if (isProductionBuild(testInfo)) {
    expect(robotsMeta).toBe("index, follow");
    expect(robotsTxt).toMatch(/Allow: \//);
    expect(robotsTxt).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
  } else {
    expect(robotsMeta).toBe("noindex, nofollow");
    expect(robotsTxt).toMatch(/Disallow: \//);
  }
});

test("sitemap lists every page with clean URLs", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  expect(paths.sort()).toEqual([...ROUTES].sort());
  for (const path of paths) expect(path).toMatch(/^[a-z0-9/-]+$/);
});

test.describe("structured data", () => {
  for (const route of ROUTES) {
    test(`${route} has valid JSON-LD`, async ({ page }) => {
      await page.goto(route);
      const blocks = await jsonLd(page);
      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) expect(block["@context"]).toBe("https://schema.org");
      if (route !== "/") {
        expect(blocks.map((b) => b["@type"])).toContain("BreadcrumbList");
      }
    });
  }

  test("home page describes a MedicalClinic with only supplied facts", async ({ page }) => {
    await page.goto("/");
    const clinic = (await jsonLd(page)).find((b) => b["@type"] === "MedicalClinic");
    expect(clinic).toBeDefined();
    expect(clinic!.medicalSpecialty).toEqual(["https://schema.org/Obstetric", "https://schema.org/Pediatric"]);
    const facts = content.clinic;
    const expected = {
      name: isSupplied(facts.name),
      telephone: isSupplied(facts.phone),
      address: isSupplied(facts.address.street) && isSupplied(facts.address.ward),
      geo: isSupplied(facts.geo),
      openingHoursSpecification: isSupplied(facts.hours),
    };
    for (const [key, present] of Object.entries(expected)) {
      expect(Object.hasOwn(clinic!, key), key).toBe(present);
    }
    if (isSupplied(facts.phone)) expect(clinic!.telephone).toBe(facts.phone);
    expect(JSON.stringify(clinic)).not.toMatch(/pending|Cần bổ sung/);
  });

  test("doctor page describes a Physician linked to the clinic", async ({ page }) => {
    await page.goto("/bac-si/nguyen-thi-thanh-xuan");
    const physician = (await jsonLd(page)).find((b) => [b["@type"]].flat().includes("Physician"));
    expect(physician).toMatchObject({
      name: "BS.CKI Nguyễn Thị Thanh Xuân",
      medicalSpecialty: "https://schema.org/Pediatric",
      worksFor: { "@id": expect.stringMatching(/#clinic$/) },
    });
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ROUTES) {
    test(`${route} has its heading, navigation and structured data in the HTML`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).not.toBeEmpty();
      expect(await page.locator('nav a[href="/san-khoa"]').count()).toBeGreaterThan(0);
      expect((await jsonLd(page)).length).toBeGreaterThan(0);
    });
  }
});
