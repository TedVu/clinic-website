import { expect, test } from "@playwright/test";
import { content, DESKTOP, isProductionBuild, isSupplied, PHONE } from "./helpers";

test.describe("home page", () => {
  test("hero fits the first screen on a phone, with the next section starting inside it", async ({
    page,
  }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Chăm sóc sức khỏe cho mẹ và bé, từ những ngày đầu tiên.");
    await expect(page.locator("#hero-heading ~ p")).toContainText("BS. Vũ Duy Minh");
    await expect(page.locator("#hero-heading ~ p")).toContainText("BS. Nguyễn Thị Thanh Xuân");

    const book = page.locator('section[aria-labelledby="hero-heading"] a', {
      hasText: "Đặt lịch khám",
    });
    const bookBox = await book.boundingBox();
    expect(bookBox!.y + bookBox!.height).toBeLessThanOrEqual(PHONE.height);

    const nextSection = await page.locator("#chuyen-khoa").boundingBox();
    expect(nextSection!.y).toBeLessThan(PHONE.height);
  });

  test("sections appear in the specified order", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main h2")).toHaveText([
      "Chuyên khoa",
      "Bác sĩ",
      "Cách chúng tôi chăm sóc",
      "Đến phòng khám",
      "Đặt lịch khám",
    ]);
  });

  test("care principles are text only, without icons or numbers", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section", {
      has: page.getByRole("heading", { name: "Cách chúng tôi chăm sóc" }),
    });
    await expect(section.locator("h3")).toHaveCount(4);
    await expect(section.locator("svg, img")).toHaveCount(0);
    expect(await section.innerText()).not.toMatch(/\d/);
  });

  test("Sản khoa introduction leads to the Sản khoa page", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-specialty="obstetrics"] h3 a').click();
    await expect(page).toHaveURL(/\/san-khoa$/);
    await expect(page.locator("h1")).toHaveText("Sản khoa");
  });

  test("'Tìm hiểu dịch vụ' jumps to the specialties", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Tìm hiểu dịch vụ" })).toHaveAttribute(
      "href",
      "#chuyen-khoa",
    );
  });
});

test.describe("specialty pages", () => {
  for (const [path, doctor, key] of [
    ["/san-khoa", "BS. Vũ Duy Minh", "obstetrics"],
    ["/nhi-khoa", "BS. Nguyễn Thị Thanh Xuân", "pediatrics"],
  ] as const) {
    test(`${path} introduces the specialty and links its doctor`, async ({ page }, testInfo) => {
      await page.goto(path);
      await expect(page.locator("main").getByRole("heading", { name: doctor })).toBeVisible();
      await expect(
        page.locator("main").getByRole("link", { name: "Đặt lịch khám" }).first(),
      ).toBeVisible();
      const services = page.locator("[data-service]");
      const all = content.services.filter((s) => s.specialty === key);
      const confirmed = all.filter((s) => s.confirmed);
      if (isProductionBuild(testInfo)) {
        // Only confirmed services may appear on the live site.
        await expect(services).toHaveCount(confirmed.length);
        for (const s of confirmed)
          await expect(page.locator(`[data-service="${s.id}"]`)).toBeVisible();
      } else {
        // Previews show every suggestion, marking the unconfirmed ones.
        await expect(services).toHaveCount(all.length);
        await expect(page.locator("[data-service] [data-pending]")).toHaveCount(
          all.length - confirmed.length,
        );
      }
    });
  }

  test("services read as a single column on a phone", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/san-khoa");
    const lefts = await page
      .locator("[data-service]")
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().left)));
    expect(new Set(lefts).size).toBe(1);
  });
});

test.describe("doctors", () => {
  for (const [slug, name, specialty, index] of [
    ["vu-duy-minh", "BS. Vũ Duy Minh", "Sản khoa", 0],
    ["nguyen-thi-thanh-xuan", "BS. Nguyễn Thị Thanh Xuân", "Nhi khoa", 1],
  ] as const) {
    test(`/bac-si/${slug} shows name, specialty and booking`, async ({ page }, testInfo) => {
      await page.goto(`/bac-si/${slug}`);
      await expect(page.locator("h1")).toHaveText(name);
      await expect(
        page.locator("article").getByRole("link", { name: specialty }).first(),
      ).toBeVisible();
      await expect(
        page.locator("article").getByRole("link", { name: "Đặt lịch khám" }),
      ).toBeVisible();
      const doctor = content.doctors[index]!;
      const details = [
        doctor.bio,
        doctor.qualifications,
        doctor.experience,
        doctor.affiliations,
        doctor.interests,
      ];
      if (isProductionBuild(testInfo)) {
        // Only supplied credentials get a section; pending ones leave no trace.
        await expect(page.locator("[data-detail]")).toHaveCount(
          details.filter((d) => isSupplied(d)).length,
        );
        await expect(page.locator("article img")).toHaveCount(isSupplied(doctor.portrait) ? 1 : 0);
        await expect(page.locator("[data-pending]")).toHaveCount(0);
      } else {
        await expect(page.locator("[data-detail]")).toHaveCount(5);
      }
      if (isSupplied(doctor.affiliations)) {
        for (const item of doctor.affiliations)
          await expect(page.getByText(item, { exact: true })).toBeVisible();
      }
    });
  }

  test("overview gives each doctor a full-width row, not a card grid", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/bac-si");
    const boxes = await page
      .locator("article[data-doctor]")
      .evaluateAll((els) =>
        els
          .map((el) => el.getBoundingClientRect())
          .map((r) => ({ top: r.top, bottom: r.bottom, width: r.width })),
      );
    expect(boxes).toHaveLength(2);
    expect(boxes[1]!.top).toBeGreaterThanOrEqual(boxes[0]!.bottom);
    for (const box of boxes) expect(box.width).toBeGreaterThan(1000);
  });
});

test.describe("booking", () => {
  test("no form and no data collection", async ({ page }) => {
    await page.goto("/dat-lich");
    await expect(page.locator("form, input, textarea, select")).toHaveCount(0);
  });

  test("phone layout shows the two contact actions with hours below", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(PHONE);
    await page.goto("/dat-lich");
    await expect(page.locator('[data-booking="desktop"]')).toBeHidden();
    const { clinic } = content;
    const mobile = page.locator('[data-booking="mobile"]');
    if (isSupplied(clinic.phone)) {
      const call = mobile.locator('[data-contact="call"]');
      await expect(call).toHaveAttribute("href", /^tel:\+84/);
      expect((await call.boundingBox())!.y).toBeLessThan(PHONE.height);
    }
    if (isSupplied(clinic.zaloUrl)) {
      await expect(mobile.locator('[data-contact="zalo"]')).toHaveAttribute("href", clinic.zaloUrl);
    }
    if (isSupplied(clinic.hours)) {
      await expect(mobile.locator('[data-contact="hours"]')).toContainText(clinic.hours[0]!.opens);
    }
    // Facts still pending are marked on previews and omitted in production.
    const pendingCount = [clinic.phone, clinic.zaloUrl, clinic.hours].filter(
      (f) => !isSupplied(f),
    ).length;
    await expect(mobile.locator("[data-pending]")).toHaveCount(
      isProductionBuild(testInfo) ? 0 : pendingCount,
    );
  });

  test("desktop layout shows number and QR columns", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/dat-lich");
    await expect(page.locator('[data-booking="desktop"]')).toBeVisible();
    await expect(page.locator('[data-booking="mobile"]')).toBeHidden();
    await expect(page.locator('[data-booking="desktop"] h2')).toHaveText(["Điện thoại", "Zalo"]);
  });
});

test.describe("clinic and contact pages", () => {
  test("Liên hệ leads to the contact page with contact options first", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(PHONE);
    await page.goto("/");
    await page.getByRole("button", { name: "Mở menu" }).click();
    await page.locator("header [id] nav").getByRole("link", { name: "Liên hệ" }).click();
    await expect(page).toHaveURL(/\/lien-he$/);
    // The phone action (or, on previews, its marker) comes first and is on the first screen.
    const phoneSupplied = isSupplied(content.clinic.phone);
    if (phoneSupplied || !isProductionBuild(testInfo)) {
      const first = phoneSupplied
        ? page.locator('main [data-contact="call"]')
        : page.locator("main [data-pending]").first();
      expect((await first.boundingBox())!.y).toBeLessThan(PHONE.height);
    }
  });

  test("pending optional rows are omitted in production", async ({ page }, testInfo) => {
    await page.goto("/phong-kham");
    // Each optional row appears when supplied, is marked on previews when pending, and is
    // omitted from production when pending.
    const { clinic } = content;
    for (const [field, value] of [
      ["parking", clinic.parking],
      ["whatToBring", clinic.whatToBring],
    ] as const) {
      const expected = isSupplied(value) || !isProductionBuild(testInfo) ? 1 : 0;
      await expect(page.locator(`[data-field="${field}"]`)).toHaveCount(expected);
    }
    await page.goto("/lien-he");
    // No email configured at all means no row, in every build.
    const emailExpected =
      clinic.email === undefined
        ? 0
        : isSupplied(clinic.email) || !isProductionBuild(testInfo)
          ? 1
          : 0;
    await expect(page.locator('[data-field="email"]')).toHaveCount(emailExpected);
  });
});

test("the 404 page keeps the site frame", async ({ page }) => {
  const response = await page.goto("/trang-khong-co");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator("h1")).toHaveText("Không tìm thấy trang");
  await expect(page.getByRole("link", { name: "Về trang chủ" })).toBeVisible();
});
