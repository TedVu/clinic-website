# Tasks

## 1. Unblock archiving

- [x] 1.1 Sync or archive `build-clinic-website` so `openspec/specs/seo/spec.md` exists; verify `openspec validate improve-local-seo` no longer reports "target spec does not exist"

## 2. Content fields

- [x] 2.1 Add `shortName: string`, `district: string` and `profiles: { googleBusiness: Fact<string>; facebook: Fact<string>; directories: Fact<string[]> }` to the `Clinic` type in `src/content/schema.ts`; verify `npm run typecheck` fails only where `src/content/vi/clinic.ts` has yet to supply them
- [x] 2.2 Set `shortName: "Sản Nhi Quận 3"` and `district: "Quận 3"` in `src/content/vi/clinic.ts`, and add `profiles` with `googleBusiness` and `facebook` as `pending(...)` and `directories: ["https://mamnon.com.vn/danh-ba/tp-ho-chi-minh/quan-3/co-so/25165-phong-kham-san-phu-khoa-sieu-am-bac-si-vu-duy-minh", "https://kiddihub.com/chi-tiet/phong-kham-san-phu-khoa-sieu-am-bac-si-vu-duy-minh"]`; verify `npm run content:report` lists the two pending profile entries under optional pending and still shows `Launch-blocking: 0`
- [x] 2.2a Add `profiles: Fact<string[]>` to the `Doctor` type; set it to `["https://khamdinhkydanang.com/bac-si-ckii-vu-duy-minh-chuyen-khoa-san-phu/"]` for `vu-duy-minh` and `pending(...)` for `nguyen-thi-thanh-xuan`; verify `npm run typecheck` passes
- [x] 2.3 Add a unit test asserting none of the new `profiles` paths appears in `LAUNCH_BLOCKING`; verify it passes with `npm test`
- [x] 2.4 Change `title` to `"BS.CKII"` for `vu-duy-minh` and `"BS.CKI"` for `nguyen-thi-thanh-xuan` in `src/content/vi/doctors.ts`; verify `npm test` now fails on the doctor-title assertion in `tests/unit/seo.test.ts`, confirming the prefix is wired through metadata

## 3. Metadata and copy

- [x] 3.1 Add a `shortBrand()` helper beside `brandName()` in `src/lib/metadata.ts` returning `clinic.shortName`, and use it for the title suffix in `buildMetadata`, leaving `brandName()` for Open Graph `siteName` and all clinic-name rendering; verify a unit test asserts `buildMetadata` suffixes with the short name while `medicalClinicJsonLd` still emits the full name
- [x] 3.2 Rewrite `copy.meta` titles and descriptions in `src/content/vi/pages.ts` so each is unique, names the district, and fits the budget once the suffix is appended; verify `npm test` passes the uniqueness test
- [x] 3.3 Add a unit test asserting every route's and both doctors' rendered title is at most 65 characters; verify it passes with `npm test`
- [x] 3.4 Add a unit test asserting every page's title and description together contain `"Quận 3"`; verify it passes with `npm test`
- [x] 3.5 Update `copy.hero` in `src/content/vi/pages.ts` so the home H1 names both specialties and the district while the current headline moves to supporting copy; verify the rendered home page shows one H1 containing "Sản" , "Nhi" and "Quận 3" via an e2e assertion in `tests/e2e/seo.spec.ts`
- [x] 3.6 Update the doctor-title assertion in `tests/unit/seo.test.ts` to the new `BS.CKII` prefix and add an assertion that the doctor page H1, title and `Physician` JSON-LD name share one prefix; verify `npm test` passes

## 4. Structured data

- [x] 4.1 Emit `sameAs` in `medicalClinicJsonLd` from supplied `clinic.profiles` entries only, omitting the property when none is supplied; verify unit tests cover both the all-pending case (no `sameAs` key, no label text in the JSON) and the partly-supplied case
- [x] 4.2 Add `areaServed` from `clinic.district` and `clinic.address.city`, leaving `PostalAddress` unchanged; verify a unit test asserts `areaServed` names the district and that `address.addressLocality` is still the ward
- [x] 4.3 Pass the service list into `medicalClinicJsonLd` and emit `availableService` from confirmed services only; verify a unit test asserts an unconfirmed service never appears
- [x] 4.4 Add an absolute-URL image helper over `loadImageManifest()` in `src/lib/schema-org.ts` and set `MedicalClinic.image` from `clinic.photos.hero`, omitting it when the photo is pending; verify a unit test asserts the URL is absolute and that a pending photo yields no `image` key
- [x] 4.5 Add `image`, `jobTitle`, `knowsAbout` and `sameAs` to `physicianJsonLd` from the doctor's portrait, specialty, interests and profiles, omitting each when pending; verify unit tests cover a complete doctor, a doctor with a pending portrait, and that a doctor's profile URL never appears in the clinic's `sameAs`
- [x] 4.6 Add a unit test asserting no page's JSON-LD contains `aggregateRating` or `review`; verify it passes with `npm test`
- [x] 4.7 Update the call sites in `src/components/pages/HomePage.tsx`, `ClinicPage.tsx`, `ContactPage.tsx` and `DoctorPage.tsx` for the new `medicalClinicJsonLd` signature; verify `npm run typecheck` and `npm test` pass

## 5. Integration

- [x] 5.1 Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run test:e2e`; verify all four pass
- [x] 5.2 Build and serve with `SITE_ENV=production npm run build && npm run serve`, then paste the home and both doctor pages' JSON-LD into the Schema.org validator; verify each parses with no errors and `MedicalClinic.name` still matches the Google Business Profile name character for character
- [x] 5.3 Record in `docs/launch-checklist.md` the post-deploy step of requesting re-indexing in Search Console for the pages whose titles changed, and the content-collection step of confirming each `sameAs` URL opens the clinic's own profile; verify the file renders and `npm test` still passes `tests/unit/docs.test.ts`
