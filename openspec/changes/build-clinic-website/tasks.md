# Tasks

## 1. Project scaffold and tooling

- [x] 1.1 Check the current stable versions of Next.js, React, TypeScript and Tailwind CSS (`npm view <pkg> version`) and scaffold a Next.js App Router + TypeScript (strict) + Tailwind CSS v4 project in the repo root with `src/` layout, keeping the existing README and `openspec/`; verify `npm run dev` serves a page
- [x] 1.2 Configure `output: "export"` and trailing-slash behaviour in `next.config.ts`, and create the folder structure from design.md (`src/app`, `components`, `content`, `locales`, `lib`, `styles`, `scripts`, `assets/photos`, `tests/unit`, `tests/e2e`, `docs`); verify `npm run build` writes `out/index.html`
- [x] 1.3 Set up ESLint (Next.js config), Prettier, Vitest and Playwright (with `@axe-core/playwright`) and add the scripts `lint`, `typecheck`, `test`, `test:e2e` (serving `out/` statically); verify each script runs on the empty project and exits 0
- [x] 1.4 Add `src/lib/env.ts` exposing `SITE_ENV` (`production` | `preview` | `development`, default `development`) and add `.gitignore` entries for `out/`, `.next/` and generated images; verify a unit test covers the default and each valid value

## 2. Content model and content gate

- [x] 2.1 Create `src/content/schema.ts` (Clinic, Doctor, Specialty, Service with `id` and `confirmed`, PageCopy, `Fact<T>`) and `src/content/pending.ts`; verify with a type test that a `Fact<string>` accepts a string or `pending(label)` and rejects `""`-style placeholders by convention documented in the file
- [x] 2.2 Write seed Vietnamese content in `src/content/vi/clinic.ts`, `doctors.ts`, `services.ts`, `pages.ts`: both doctors' names and specialties as supplied, every credential, clinic fact and photo as `pending(...)` with a clear Vietnamese label, the brief's suggested services with `confirmed: false`, and natural-sounding copy for hero, specialty intros, principles and disclaimer with no claims; verify by review against the content-model spec's content-safety requirement
- [x] 2.3 Implement `src/lib/content-check.ts` with the `LAUNCH_BLOCKING` list (clinic name, address, phone, Zalo, opening hours, privacy text, site URL, booking instructions, at least one confirmed service per specialty) plus `checkContent()` and `reportContent()`; verify unit tests cover a missing phone (fails), all-supplied (passes with optional facts pending) and a specialty with zero confirmed services (fails)
- [x] 2.4 Add `scripts/check-content.ts` as a `prebuild` step (strict only when `SITE_ENV=production`) and the `content:report` script; verify `SITE_ENV=production npm run build` fails and lists the missing seed facts, while `npm run build` succeeds and prints the report
- [x] 2.5 Implement the `Fact` rendering component and `isSupplied` helper (value, nothing in production, dashed labelled marker otherwise) and a `confirmedServices()` selector; verify unit tests for all three environments and that unconfirmed services are excluded in production

## 3. Localization and routing

- [x] 3.1 Create `src/locales/vi.ts` with all interface strings (nav labels, buttons, section headings, aria labels) and the exported `Dictionary` type; verify a type test shows that a partial dictionary declared with `satisfies Dictionary` fails to compile
- [x] 3.2 Implement `src/lib/routes.ts` mapping route keys to Vietnamese paths (`/`, `/san-khoa`, `/nhi-khoa`, `/bac-si`, `/bac-si/<slug>`, `/phong-kham`, `/lien-he`, `/dat-lich`, `/chinh-sach-bao-mat`) with an `enabledLocales` list containing only `vi`; verify unit tests check that every path is lowercase ASCII with hyphens
- [x] 3.3 Create the `(vi)` route group with its root layout (`<html lang="vi">`) and thin placeholder route files for every Vietnamese page plus `not-found.tsx`; verify the build emits an HTML file for every route and an e2e test checks `lang="vi"` and status 200 for `/` with no redirect
- [x] 3.4 Add the guard test that fails when Vietnamese diacritic characters appear under `src/components` or `src/app`; verify it fails on a deliberately inserted string and passes after removal
- [x] 3.5 Implement `LanguageSwitcher` so it renders only when more than one locale is enabled; verify a unit test shows it renders nothing with `vi` only

## 4. Design system and site shell

- [x] 4.1 Define Tailwind v4 `@theme` tokens in `src/styles/globals.css` (palette, type scale, spacing, 4px button radius, focus ring) and load Be Vietnam Pro via `next/font/google` with `subsets: ["latin", "vietnamese"]`, weights 400/500/600; verify an e2e test renders "Nguyễn Thị Thanh Xuân — ưỡng, ặ, ộ, ữ, Ỷ" and confirms the computed font family is Be Vietnam Pro for heading and body
- [x] 4.2 Build `Header` with the clinic name, six nav items from `routes.ts`, the booking action from `booking.href`, `aria-current` on the active item and a skip-to-content link; verify e2e at 1280px shows all items in one row and marks the current page
- [x] 4.3 Build `MobileNav` (the only client component): disclosure button with `aria-expanded`, 44px touch targets, Escape closes and returns focus, transitions removed under reduced motion; verify e2e at 360px covers open, close, Escape and focus return
- [x] 4.4 Build `ActionBar` (Gọi / Zalo / Đặt lịch) for small screens with safe-area padding and matching page bottom padding; verify e2e at 360px checks the three hrefs (`tel:`, Zalo URL, booking href) and that the bar is hidden at 1280px and does not cover the footer at the end of the page
- [x] 4.5 Build `Footer` (clinic name, doctors with specialties, address, phone, hours, nav, privacy link, medical disclaimer) using `Fact` for each clinic value; verify e2e checks every item is present in a preview build
- [x] 4.6 Add a page-level e2e accessibility pass (`@axe-core/playwright`) that runs on every route; verify it reports no serious or critical violations on the shell with placeholder pages

## 5. Responsive images

- [x] 5.1 Implement `scripts/build-images.ts` (sharp) that turns `assets/photos/*` into AVIF and WebP at 480/800/1200/1600 widths plus a JSON manifest with dimensions, run before build; verify running it on a sample photo produces all variants and manifest entries
- [x] 5.2 Build `ResponsiveImage` rendering `<picture>` with `srcset`, `sizes`, explicit width/height, required `alt`, and lazy loading unless marked priority; verify a unit test of the rendered markup and that a missing manifest entry fails the build with a clear message

## 6. Home and specialty pages

- [x] 6.1 Build the home hero (headline, both specialties with doctor names, "Đặt lịch khám" and "Tìm hiểu dịch vụ", optional photo beside the text, never under it) with height bounded below the viewport; verify e2e at 360px shows the headline, specialties and booking action above the fold and the next section starting within the first screen
- [x] 6.2 Build the remaining home sections in order: specialty intros linking to their pages, doctors intro, care principles as text only, clinic info summary and booking call to action; verify e2e checks section order and the Sản khoa intro link reaches `/san-khoa`
- [x] 6.3 Build `ServiceSection` (definition-list style, one column on mobile and two on wide screens, stable `id` anchors) and the `/san-khoa` and `/nhi-khoa` pages (intro, linked doctor, confirmed services, booking call to action); verify e2e that unconfirmed seed services are absent in a production-mode render and shown as markers in preview
- [x] 6.4 Capture e2e screenshots of home and both specialty pages at 360/768/1280 in both preview (markers) and production-mode (optional facts omitted) rendering; verify by reviewing them against the restrained-design requirement (no cards-in-cards, icon grids, gradients or shadows)

## 7. Doctor profiles

- [x] 7.1 Build `DoctorProfile` in full-width alternating layout, with typographic layout when the portrait is pending, showing portrait, biography, qualifications, experience, affiliations and interests only when supplied; verify unit tests for a fully pending profile (production renders name, specialty, links only) and a partially supplied one
- [x] 7.2 Build `/bac-si` (both doctors as full-width sections) and `/bac-si/[slug]` with `generateStaticParams` from doctor content, `h1` "BS. <name>", specialty link and booking action; verify e2e for both slugs and that the overview has no multi-column card grid at 1280px

## 8. Contact and booking

- [x] 8.1 Build `ContactActions` (call and Zalo actions, opening hours directly below) and `ZaloQr` (build-time inline SVG from `zalo.url` via the `qrcode` package); verify a unit test decodes or matches the QR payload to `zalo.url`, and the action and QR share one source
- [x] 8.2 Build `/dat-lich`: plain-language booking steps, large actions on mobile, large selectable number plus QR with the caption "Quét mã bằng điện thoại để nhắn Zalo" on desktop, no form elements; verify e2e at 360 and 1280 and an assertion that the page contains no `form`, `input` or `textarea`
- [x] 8.3 Build `ClinicInformation` and `/phong-kham` (name, address with Google Maps link opening in a new tab, phone, Zalo, hours, booking instructions, and optional parking, what to bring, photos) and `/lien-he` (phone and Zalo at top, email if supplied, address, hours); verify e2e that "Liên hệ" lands on `/lien-he` with phone and Zalo above the fold and that pending parking renders no row in production mode
- [x] 8.4 Verify the single booking destination: set `booking.href` to an external URL in a test build and confirm by e2e that the header, hero, action bar, doctor and specialty pages all link to it
- [x] 8.5 Build `/chinh-sach-bao-mat` from privacy copy in content, stating that the site collects no personal data and what hosting logs may contain, marked as requiring clinic approval; verify the footer link reaches it

## 9. SEO

- [x] 9.1 Implement `buildMetadata()` and `generateMetadata` on every page (unique title with clinic, specialty or doctor and city where relevant, description, canonical on the site URL, Open Graph with `vi_VN`) and `noindex` outside production; verify a unit test that all titles and descriptions are unique and an e2e check of the doctor page's title and canonical
- [x] 9.2 Implement `app/sitemap.ts` (all public routes, absolute canonical URLs) and `app/robots.ts` (allow plus sitemap in production, disallow-all otherwise); verify both files in `out/` for production and preview builds
- [x] 9.3 Implement `src/lib/schema-org.ts` builders for `MedicalClinic`, `Physician` and `BreadcrumbList` that omit pending facts, and render them on the relevant pages; verify unit tests show pending `geo` is omitted and that name, address and telephone match the footer source, and an e2e test parses each page's JSON-LD
- [x] 9.4 Generate the default 1200x630 Open Graph image (typographic, clinic name and specialties) at build time; verify the file exists in `out/` and is referenced by `og:image`
- [x] 9.5 Add an e2e test that fetches each page with JavaScript disabled and finds its `h1`, navigation links and JSON-LD; verify it passes for all routes

## 10. Documentation for the clinic and for developers

- [x] 10.1 Write `docs/content-checklist.md` in Vietnamese for the clinic: every fact, photo and approval needed, grouped as launch-blocking and optional, with photo guidance (real, documentary-style, no stock or generated faces) and doctor review of service copy; verify every entry in `LAUNCH_BLOCKING` and every `pending(...)` label in seed content appears in it
- [ ] 10.2 Write `docs/launch-checklist.md`: Cloudflare Pages setup and env vars, domain (prefer `.vn`), Google Business Profile with identical name/address/phone, Google Search Console and Cốc Cốc sitemap submission, Sở Y tế advertising check, realistic ranking expectations, rollback; verify a teammate can follow the Cloudflare steps against a preview deploy
- [x] 10.3 Replace the README with how to run, build, update content, add photos, read the content report and add English later; verify each command in it runs as written

## 11. Integration verification

- [x] 11.1 Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:e2e` from a clean checkout; verify all pass with no errors or warnings left unexplained
- [x] 11.2 Fill the content files with complete dummy launch-blocking values on a throwaway branch, run `SITE_ENV=production npm run build`, and run Lighthouse (mobile) on home, a specialty page and a doctor page; verify each category scores at least 90, LCP is under 2.5s and CLS is under 0.1, then discard the branch
- [x] 11.3 Do a senior-product-designer review of the 360/768/1280 screenshots using the brief's Final Quality Bar (five-second clarity, hierarchy without boxes, no unnecessary cards, icons or gradients, whitespace, older-reader comfort, Vietnamese rendering, mobile quality), remove anything decorative without purpose, and record the findings and fixes in the change; verify the screenshots are re-captured after fixes

## 12. Launch (requires clinic owner)

- [x] 12.1 Collect all launch-blocking content from the clinic via `docs/content-checklist.md` and enter it; verify `npm run content:report` shows no launch-blocking items
- [ ] 12.2 Connect Cloudflare Pages (production `SITE_ENV=production`, previews `preview`) and attach the domain; verify the production URL serves `/` with status 200 and robots.txt allows indexing, and a preview URL is `noindex`
- [ ] 12.3 Create or update the Google Business Profile with name, address and phone identical to the site, and link to the site; verify the profile shows the site link and matching details
- [ ] 12.4 Submit the sitemap to Google Search Console and Cốc Cốc Webmaster Tools; verify both show the sitemap as successfully read
