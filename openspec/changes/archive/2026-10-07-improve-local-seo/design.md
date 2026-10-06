# Design

## Context

See proposal.md — Why.

Constraints that shape the approach:

- **Everything renders at build time.** The site is a static export served by a Cloudflare Worker. Anything the structured data needs must be reachable from a synchronous function at build time.
- **The `Fact<T>` / `pending()` system is the content contract.** Any new fact must be expressible as pending, must disappear from production output while pending, and must show as `[label]` on previews. `LAUNCH_BLOCKING` in `src/lib/content-check.ts` fails a production build while a listed fact is pending — the site is live, so nothing added here may go on that list.
- **One source for identity.** The existing spec requires the clinic name, address and phone to come from one content source and appear identically everywhere, so they can match the Google Business Profile. The title shortening must not weaken this.
- **`openspec/specs/` is empty.** The founding change `build-clinic-website` has not been archived, so the `seo` capability has no main spec yet. `openspec validate` already warns that this change's `MODIFIED` requirements cannot archive until it exists.

## Goals / Non-Goals

**Goals:**

- Shorten titles without weakening the Business Profile name match.
- Make the district searchable without falsifying the official address.
- Keep every new structured-data property fully governed by the pending system.

**Non-Goals:**

- Changing URLs. The existing spec forbids it, and they are already indexed.
- Changing the visual design. Copy changes only where the spec requires it.
- Adding analytics or any third-party script. The privacy notice states the site has none, and it has been approved by the clinic.

## Decisions

### 1. A `shortName` separate from `name`, not a truncated name

`brandName()` currently returns the full clinic name and is used both for the title suffix and for `MedicalClinic.name`. Those two now need different values.

Add a second content field and a second helper:

```
clinic.name       "Phòng khám sản nhi 611/95 Điện Biên Phủ TP.HCM"
                  -> footer, home page, MedicalClinic.name   (matches GBP)
clinic.shortName  "Sản Nhi Quận 3"
                  -> title suffix only
```

**Alternative rejected:** deriving the short form by truncating `name`. Truncation would silently change if the clinic renames itself on the Business Profile, and could produce a meaningless suffix.

`shortName` is a plain `string`, not a `Fact<string>`: it is the site's own choice of wording, not a fact the clinic must supply, and a pending title suffix would leave every page title broken.

### 2. The district is a content field, not a changed address

The Business Profile and the postal address both say `Phường Bàn Cờ`. Rewriting `address.ward` to say "Quận 3" would break the exact-match requirement and state a ward that no longer exists.

Add `clinic.district: string` = `"Quận 3"`, used in:

- page titles and meta descriptions,
- the home hero,
- `MedicalClinic.areaServed`.

The structured `PostalAddress` is untouched. This is accurate: Bàn Cờ is in the area formerly and commonly known as Quận 3, and `areaServed` describes who the clinic serves rather than where mail goes.

**Alternative rejected:** adding "Quận 3" to `address.ward` as `"Phường Bàn Cờ, Quận 3"`. It would contradict the Business Profile and put a defunct administrative unit into `PostalAddress`.

### 3. Credentials live in the existing `Doctor.title` field

`Doctor.title` is already documented as "Professional title shown before the name" and is already rendered everywhere the name appears. Changing its value from `"BS."` to `"BS.CKII"` / `"BS.CKI"` satisfies the consistency requirement with no structural change.

Both values are already evidenced in `qualifications`, which cite the practising-certificate listing — so this corrects a display inconsistency rather than adding an unsourced claim.

Knock-on: `src/content/vi/services.ts` and `doctors.ts` contain prose like "BS. Vũ Duy Minh, bác sĩ chuyên khoa II". Those read naturally and stay as prose; only the structured `title` field changes. `tests/unit/seo.test.ts` asserts the old prefix and must be updated.

### 4. `sameAs` is a list of individually-pending facts

```ts
profiles: {
  googleBusiness: Fact<string>;
  facebook: Fact<string>;
  directories: Fact<string[]>;
}
```

rather than one `Fact<string[]>`. Named keys let the Facebook page be supplied today while the directory links stay pending, and `npm run content:report` then names exactly which profile is missing. `sameAs` is emitted only from supplied entries, and omitted entirely when none is supplied.

None of these go in `LAUNCH_BLOCKING`.

A listing about one doctor (e.g. a directory page titled "Bác sĩ CKII Vũ Duy Minh") describes a `Physician`, not the clinic. Those go in a per-doctor `profiles: Fact<string[]>` on `Doctor` and are emitted as `Physician.sameAs`. Putting them on the clinic would assert the clinic and the doctor are the same entity.

Supplied at implementation time: clinic directories `mamnon.com.vn` (verified: shows 611/95 Điện Biên Phủ) and `kiddihub.com` (behind a bot challenge, supplied by the clinic owner); doctor directory `khamdinhkydanang.com` for BS.CKII Vũ Duy Minh (verified: shows the clinic's address and phone). Google Business Profile and Facebook URLs stay pending.

**Correctness note:** a wrong `sameAs` URL asserts that the site and some other entity are the same thing. Each URL must be opened and confirmed to be the clinic's own profile before it is entered — this is a content-collection step, not something the implementation can validate.

### 5. `availableService` is derived, not authored

`src/content/vi/services.ts` already holds 15 services with a `confirmed` flag, and `confirmedServices()` already filters them. `medicalClinicJsonLd` takes only `clinic` today, so it will take the service list as a second argument and map confirmed services to `MedicalProcedure` entries (`name`, `description` from the existing `summary`).

Using `confirmed` as the gate means structured data can never advertise a service the clinic has not confirmed — the same rule the visible page already follows.

### 6. Images in JSON-LD come from the build manifest, as absolute URLs

`loadImageManifest()` is build-time and synchronous, so `schema-org.ts` can use it. Pick the largest `webp` variant (Google Images supports WebP) and prefix it with `siteUrl()` — JSON-LD needs absolute URLs, unlike the `<img>` tags.

- `MedicalClinic.image` ← `clinic.photos.hero`
- `Physician.image` ← `doctor.portrait`

`getImage()` throws on a missing entry, which is the desired build-time failure, but it must only be called for a supplied photo.

### 6a. Doctors are typed `["Person", "Physician"]` (found during implementation)

The Schema.org validator flagged `jobTitle` and `worksFor` as unknown on `Physician`. In Schema.org, `Physician` descends from `MedicalOrganization`, so person properties are invalid on it alone. The `worksFor` warning predates this change.

Two forms validate with no errors or warnings:

- `"@type": ["Person", "Physician"]` with `jobTitle` and `worksFor`. **Chosen.** A doctor is a person, and Google builds person entities from `Person` with `jobTitle`, `worksFor` and `sameAs`. It keeps the spec's `jobTitle` and fixes the existing `worksFor` warning.
- `"@type": "IndividualPhysician"` with `practicesAt`. Rejected: no `jobTitle`, which would mean dropping a spec requirement, and newer vocabulary that consumers recognize less widely.

Tests that located the doctor block with `@type === "Physician"` now check that the type list includes `"Physician"`.

### 7. Title budget is enforced by a test, not by truncation

The spec sets a 65-character budget. Enforce it with a unit test over every route's rendered title rather than truncating at runtime: a truncating helper would hide the problem and could cut a title mid-word. If a title is too long the content is wrong and should be rewritten.

Current longest title is around 110 characters; with the `Sản Nhi Quận 3` suffix (14 characters plus separator) the budget is comfortable.

### 8. Archive ordering

`openspec validate` reports that archiving this change would be refused while `openspec/specs/seo/spec.md` does not exist, because `MODIFIED` needs a target. The requirement names here match `build-clinic-website`'s exactly, so the fix is ordering, not rewriting: sync or archive `build-clinic-website` first. Recorded as the first task.

## Risks / Trade-offs

- **Title suffix no longer carries the full clinic name** → `MedicalClinic.name`, the footer and the home page still carry it verbatim, which is what Google matches against the Business Profile. Search result titles are also frequently rewritten by Google anyway.
- **"Quận 3" is an obsolete administrative unit** → It is used only in prose and `areaServed`, never in `PostalAddress`. The official ward is stated everywhere the address appears, so nothing the site publishes is inaccurate.
- **Changing titles can cost ranking temporarily** → The site is new and barely ranks yet, so the downside is near zero and the upside is larger. Doing it now is cheaper than after it ranks.
- **`sameAs` pointing at a wrong profile** → Each URL is confirmed by opening it during content collection; unverified ones stay pending and are omitted.
- **Credential claims** → Both prefixes are already supported by the sourced `qualifications` entries. No new claim is introduced.

## Migration Plan

No data migration. Deploy is the existing Cloudflare build, and rollback is the dashboard rollback already documented in `docs/launch-checklist.md`. URLs do not change, so no redirects are needed.

After deploy, request re-indexing in Search Console for the pages whose titles changed, so the new titles are picked up sooner.

## Open Questions

- Whether to also list the clinic's Zalo OA in `profiles`. It can be added later as another named key without changing the approach.
