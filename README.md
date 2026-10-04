# clinic-website

Website for a private Obstetrics & Pediatrics clinic in TP. Hồ Chí Minh: BS. Vũ Duy Minh (Sản khoa) and BS. Nguyễn Thị Thanh Xuân (Nhi khoa).

Next.js (App Router, static export) · TypeScript · Tailwind CSS v4. Vietnamese is served at the site root; English can be added later under `/en`. There is no backend: booking is by phone and Zalo until a separate booking app exists.

## Commands

```bash
npm install
npm run dev              # local development at http://localhost:3000
npm run content:report   # what the clinic still needs to supply
npm run build            # static site in out/ (runs the image and content steps first)
npm run serve            # serve out/ at http://localhost:4000 (or: npx wrangler dev, after a build)
npm run lint
npm run typecheck
npm test                 # unit tests (Vitest)
npm run test:e2e         # builds preview + production-mode sites, runs Playwright against both
```

First-time e2e setup: `npx playwright install chromium`.

Review screenshots of every page at 360/768/1280px, in both preview and production mode:

```bash
npm run test:e2e         # once, to build .e2e/
SCREENSHOTS=1 npx playwright test screenshots   # writes review-screenshots/
```

## Build modes (`SITE_ENV`)

| `SITE_ENV` | Used for | Missing facts | Indexing | Content gate |
| --- | --- | --- | --- | --- |
| `development` (default) | `npm run dev`, local builds | shown as "Cần bổ sung" markers | noindex | report only |
| `preview` | Cloudflare branch deploys | shown as markers | noindex | report only |
| `production` | the live site | hidden | indexed | **build fails** if anything launch-blocking is missing |

## Updating content

All text and clinic facts live in `src/content/vi/`. Interface labels live in `src/locales/vi.ts`. Components contain no copy (a test enforces this).

| File | Contents |
| --- | --- |
| `src/content/vi/clinic.ts` | name, address, phone, Zalo, hours, maps, parking, booking steps, site URL, booking destination |
| `src/content/vi/doctors.ts` | each doctor's summary, biography, qualifications, experience, affiliations, interests, portrait |
| `src/content/vi/services.ts` | specialty introductions and services |
| `src/content/vi/pages.ts` | page copy, page titles and descriptions, principles, privacy notice, disclaimer |

Rules:

- A fact the clinic hasn't supplied is `pending("what is needed")`. Never an empty string, a guess or filler text. When the clinic supplies it, replace `pending(...)` with the value.
- Never add qualifications, years of experience, affiliations, reviews, ratings or statistics that the clinic hasn't provided in writing.
- A service appears on the live site only when `confirmed: true`, which requires the responsible doctor's confirmation.
- Set `privacy.approved: true` in `pages.ts` once the clinic has approved the privacy notice.
- The clinic's name, address and phone must match its Google Business Profile exactly.

`docs/content-checklist.md` is the checklist to send to the clinic (Vietnamese). A test keeps it in sync with the content files.

## Photos

Put real, clinic-supplied photos in `assets/photos/` (JPG, PNG or WebP, at least 1200px wide), then reference them by file name without the extension:

```ts
portrait: { image: "bs-vu-duy-minh", alt: "Chân dung BS. Vũ Duy Minh" },
```

The build (`scripts/build-images.ts`) generates AVIF and WebP versions at 480/800/1200/1600px into `public/images/`. A photo referenced in content but missing from `assets/photos/` fails the build with a message naming the file. Never use stock, generated or illustrated faces.

## Booking app

Every "Đặt lịch khám" action uses `clinic.bookingHref` in `src/content/vi/clinic.ts` (currently `/dat-lich`). When the booking app exists, either set it to the app's URL or keep `/dat-lich` and link to the app from that page.

## Adding English later

1. Add an `en` entry to the paths in `src/lib/routes.ts` (paths under `/en/...`) and add `"en"` to `enabledLocales`. The language switcher then appears automatically.
2. Add `src/locales/en.ts` declared `satisfies Dictionary`, and register it in `src/locales/index.ts`. Missing keys fail the type check.
3. Add `src/content/en/` with the same shape as `src/content/vi/`, and register it in `src/content/index.ts`.
4. Add `src/app/(en)/en/layout.tsx` with `<html lang="en">`, and thin route files that render the shared page components with `locale="en"`.
5. Add `en_US` to `OG_LOCALE` in `src/lib/metadata.ts`, and add hreflang alternates.

Vietnamese URLs do not change.

## Structure

```
src/app/          route files only (thin); (vi)/ is the Vietnamese root layout
src/components/   Header, MobileNav (only client component), ActionBar, Footer, DoctorProfile,
                  ServiceSection, ClinicInformation, ContactActions, ZaloQr, ResponsiveImage, Fact, pages/
src/content/      content schema, pending(), vi/ content
src/locales/      interface strings
src/lib/          routes, env, content check, metadata, Schema.org, helpers
scripts/          build-images, check-content, build-e2e, serve-static
docs/             content checklist (for the clinic), launch checklist
```

Deployment, domain, Google Business Profile and search-console steps are in [docs/launch-checklist.md](docs/launch-checklist.md).
