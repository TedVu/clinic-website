# Proposal

## Why

The site is live on `phongkhamsannhi.com` and technically sound (server-rendered HTML, sitemap, canonicals, JSON-LD), but it is losing the searches it should win most easily. Every page title runs 90–110 characters because a 47-character clinic-name suffix is appended, so Google truncates the part that identifies the page. No page mentions **Quận 3**, the district name people still search by after the 2025 ward merger, although the clinic's previous site did. Both doctors are shown as `BS.` while their actual, verifiable credentials are BS.CKII and BS.CKI — the form used on the Business Profile, the practising-certificate listing and every external directory.

Separately, the structured data describes the clinic in isolation: it never links the site to the Google Business Profile, the Facebook page or the directory listings that already rank for the clinic, so Google has no explicit signal that these are one entity.

## What Changes

**Metadata and on-page copy**

- Replace the long title suffix with a short brand suffix, `Sản Nhi Quận 3`, keeping titles under roughly 60 characters. The full clinic name stays in the footer, the home page and structured data so it continues to match the Business Profile exactly.
- Add the district as a searchable term ("Quận 3") to page titles, meta descriptions and the home hero, alongside the official ward ("Phường Bàn Cờ"), so the site matches both the current administrative name and how people actually search.
- Give the home page an H1 that names what the clinic does and where, instead of the current purely emotive headline. The existing headline stays on the page as supporting copy.
- Show each doctor's real credential prefix (`BS.CKII` / `BS.CKI`) wherever the name is rendered — headings, titles, structured data, cards.

**Structured data**

- Add `sameAs` to the clinic, listing the Google Business Profile, Facebook page and external directory listings, as supplied facts that stay absent while unsupplied.
- Add `image` (clinic photo), `areaServed` (the district and city), `priceRange` omission notwithstanding, and `availableService` built from the already-confirmed service list.
- Add `image`, `jobTitle` and `knowsAbout` to each `Physician`, from content that already exists.
- Do **not** add `aggregateRating` or `review`: Google disallows self-serving review markup for the business publishing it, and it risks a manual action.

**Out of scope** (deliberately deferred to a later change, both need doctor-written and doctor-approved content, and may need Sở Y tế advertising approval): per-service landing pages such as `/san-khoa/sieu-am-thai`, and an article/blog section.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `seo`: page metadata gains a district requirement and a title-length budget; structured data gains entity-linking (`sameAs`), service and area properties, and an explicit prohibition on self-served ratings; a new requirement covers rendering professional credentials consistently.

Note: `openspec/specs/` is still empty because the founding change `build-clinic-website` has not been archived, so the `seo` capability currently exists only as that change's delta. This change's delta is written against those requirement names so the two merge cleanly when the capabilities are synced.

## Impact

**Content** (`src/content/vi/`)

- `clinic.ts`: doctor-independent facts gain `profiles` (sameAs URLs) and `district`. New facts are **not** launch-blocking — the site is already live and must keep building while they are pending.
- `doctors.ts`: `title` changes from `BS.` to `BS.CKII` / `BS.CKI`.
- `pages.ts`: titles, descriptions and hero copy.

**Code** (`src/`)

- `lib/metadata.ts`: a short brand suffix distinct from the full clinic name.
- `lib/schema-org.ts`: new clinic and physician properties; needs the service list and the image manifest, which it does not currently receive.
- `content/schema.ts`: two new `Clinic` fields.
- `lib/content-check.ts`: new optional pending facts appear in `npm run content:report`.

**Tests**

- `tests/unit/seo.test.ts` asserts the current doctor-title format and will need updating.
- `tests/e2e/seo.spec.ts` and `tests/unit/content-separation.test.ts` may assert titles or copy.

**External, outside this repo** (recorded so they are not forgotten; they are not code tasks)

- Business Profile categories, services and website URL.
- Change of address in Search Console from `sannhigiadinh.com`.

**Risks**

- The clinic name in structured data must keep matching the Business Profile exactly; shortening the *display* suffix must not shorten `MedicalClinic.name`.
- `sameAs` URLs must be correct. A wrong URL links the site to the wrong entity, which is worse than omitting the property.
