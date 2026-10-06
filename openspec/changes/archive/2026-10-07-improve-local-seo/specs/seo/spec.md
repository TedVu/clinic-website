# Spec Delta

## MODIFIED Requirements

### Requirement: Page metadata
Each page SHALL have a unique Vietnamese title and meta description that describe that page specifically. Titles SHALL include a short brand suffix rather than the clinic's full legal name, and the rendered title SHALL NOT exceed 65 characters so search engines display it without truncation. Pages about a specialty or doctor SHALL include the specialty or doctor name. Every page's title or meta description SHALL name the clinic's district in the form people search for it, in addition to the official ward name used in the address. Each page SHALL declare a canonical URL on the configured site URL.

#### Scenario: Doctor page metadata
- **WHEN** `/bac-si/vu-duy-minh` is loaded
- **THEN** its title includes "BS.CKII Vũ Duy Minh" and "Sản khoa", and its canonical URL is the configured site URL plus `/bac-si/vu-duy-minh`

#### Scenario: Title length budget
- **WHEN** the rendered `<title>` of every page is measured
- **THEN** each one is at most 65 characters

#### Scenario: District is searchable
- **WHEN** the title and meta description of any page are read together
- **THEN** they contain the clinic's district term ("Quận 3")

#### Scenario: Unique titles
- **WHEN** the titles of all pages are compared
- **THEN** no two pages share the same title or description

### Requirement: Structured data from supplied facts only
The site SHALL publish Schema.org JSON-LD describing the clinic as a `MedicalClinic` (name, address, telephone, URL, opening hours, medical specialties Obstetric and Pediatric, and geo coordinates, Google Maps link, clinic image, area served and available services when supplied), each doctor as both a `Person` and a `Physician` (Schema.org defines `Physician` as an organization type, so `Person` is what makes person properties such as `jobTitle` and `worksFor` valid) linked to the clinic on their page, and a `BreadcrumbList` on every page below the home page. A property whose fact is pending SHALL be omitted rather than filled with a placeholder.

The clinic's `name` in structured data SHALL be the full clinic name, independent of the shortened brand suffix used in page titles, so it keeps matching the clinic's Google Business Profile exactly.

The site SHALL NOT publish `aggregateRating`, `review` or any other rating markup describing itself, because search engines disallow self-serving review markup.

#### Scenario: Clinic structured data
- **WHEN** the home page's JSON-LD is validated
- **THEN** it parses as a valid `MedicalClinic` whose name, address and telephone exactly match the footer

#### Scenario: Available services
- **WHEN** the clinic JSON-LD is inspected
- **THEN** it lists one entry per confirmed service, each naming that service, and lists no unconfirmed service

#### Scenario: Area served
- **WHEN** the clinic JSON-LD is inspected
- **THEN** it declares the clinic's district and city as the area served

#### Scenario: No self-served ratings
- **WHEN** any page's JSON-LD is inspected
- **THEN** it contains no `aggregateRating` and no `review` property

#### Scenario: Pending geo coordinates
- **WHEN** the clinic's coordinates are pending
- **THEN** the JSON-LD contains no `geo` property and no placeholder value

## ADDED Requirements

### Requirement: Entity links to external profiles
The clinic's structured data SHALL declare `sameAs` links to the clinic's own profiles on external platforms, such as its Google Business Profile, Facebook page and medical directory listings, so search engines can resolve the website and those profiles to one entity. Each link SHALL be a supplied fact; while a profile URL is not supplied it SHALL be omitted, and when none is supplied the `sameAs` property SHALL be absent entirely.

#### Scenario: Profiles supplied
- **WHEN** the clinic's profile URLs are supplied and the home page JSON-LD is inspected
- **THEN** its `sameAs` is an array containing exactly those URLs

#### Scenario: No profiles supplied
- **WHEN** every profile URL is pending
- **THEN** the JSON-LD has no `sameAs` property and no placeholder value

Profiles describing an individual doctor rather than the clinic SHALL be linked from that doctor's `Physician` JSON-LD `sameAs`, never from the clinic's, under the same supplied-only rule.

#### Scenario: Doctor profile
- **WHEN** a doctor has a supplied profile URL and their page's JSON-LD is inspected
- **THEN** the `Physician` `sameAs` contains that URL and the clinic's `sameAs` does not

### Requirement: Professional credentials shown consistently
Wherever a doctor's name is rendered — page headings, page titles, cards, and structured data — it SHALL carry that doctor's actual credential prefix as recorded in content, and the same prefix SHALL appear in every one of those places. The prefix SHALL come from a single content source, so correcting it once corrects the whole site.

#### Scenario: Credential prefix on a doctor page
- **WHEN** `/bac-si/vu-duy-minh` is loaded
- **THEN** its H1, its `<title>` and its `Physician` JSON-LD `name` all begin with the same credential prefix recorded for that doctor

#### Scenario: Correcting a credential
- **WHEN** a doctor's credential prefix is changed in content and the site is rebuilt
- **THEN** every heading, title, card and JSON-LD entry naming that doctor shows the new prefix

### Requirement: Doctor structured data detail
Each doctor's `Physician` JSON-LD SHALL include their portrait image, their job title and the subjects they are stated to focus on, built only from facts already supplied for that doctor. A doctor whose portrait or focus areas are pending SHALL have the corresponding property omitted.

#### Scenario: Complete doctor
- **WHEN** a doctor with a portrait and stated interests is rendered
- **THEN** their `Physician` JSON-LD includes an absolute `image` URL, a `jobTitle` and a `knowsAbout` list

#### Scenario: Pending portrait
- **WHEN** a doctor's portrait is pending
- **THEN** their `Physician` JSON-LD has no `image` property
