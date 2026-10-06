# seo Specification

## Purpose

Makes the site easy for search engines to crawl, understand and rank for local searches in TP. Hồ Chí Minh, such as the clinic name, the doctors' names and "phòng khám sản nhi" plus a district, while never publishing unsupplied facts.

## Requirements

### Requirement: Fully rendered HTML
Every page's content, headings, links and structured data SHALL be present in the HTML delivered to the browser, without requiring JavaScript to run.

#### Scenario: JavaScript disabled
- **WHEN** a page is fetched with JavaScript disabled
- **THEN** all text content, navigation links and structured data are present

### Requirement: Readable URLs
Page URLs SHALL be lowercase Vietnamese words without diacritics, separated by hyphens (for example `/san-khoa`, `/bac-si/vu-duy-minh`), and SHALL NOT change once published.

#### Scenario: URL format
- **WHEN** the sitemap is inspected
- **THEN** every URL uses only lowercase ASCII letters, digits, hyphens and slashes

### Requirement: Page metadata
Each page SHALL have a unique Vietnamese title and meta description that describe that page specifically. Titles SHALL include the clinic name, and pages about a specialty or doctor SHALL include the specialty or doctor name and the city. Each page SHALL declare a canonical URL on the configured site URL.

#### Scenario: Doctor page metadata
- **WHEN** `/bac-si/vu-duy-minh` is loaded
- **THEN** its title includes "BS. Vũ Duy Minh", "Sản khoa" and the clinic name, and its canonical URL is the configured site URL plus `/bac-si/vu-duy-minh`

#### Scenario: Unique titles
- **WHEN** the titles of all pages are compared
- **THEN** no two pages share the same title or description

### Requirement: Social sharing metadata
Each page SHALL provide Open Graph title, description, URL, locale (`vi_VN`), site name and a share image, so links shared on Zalo and Facebook show a correct preview.

#### Scenario: Sharing the home page
- **WHEN** the home page's Open Graph tags are inspected
- **THEN** title, description, URL, `og:locale` of `vi_VN`, site name and image are all present

### Requirement: Sitemap and robots
The site SHALL publish `/sitemap.xml` listing every public page with its canonical URL, and `/robots.txt` allowing crawling and pointing to the sitemap. Preview builds SHALL block indexing.

#### Scenario: Production robots
- **WHEN** `/robots.txt` is fetched from the production site
- **THEN** it allows all crawlers and references the sitemap's absolute URL

#### Scenario: Preview build
- **WHEN** a preview build is deployed
- **THEN** its pages and robots.txt tell search engines not to index it

### Requirement: Structured data from supplied facts only
The site SHALL publish Schema.org JSON-LD describing the clinic as a `MedicalClinic` (name, address, telephone, URL, opening hours, medical specialties Obstetric and Pediatric, and geo coordinates and Google Maps link when supplied), each doctor as a `Physician` linked to the clinic on their page, and a `BreadcrumbList` on every page below the home page. A property whose fact is pending SHALL be omitted rather than filled with a placeholder.

#### Scenario: Clinic structured data
- **WHEN** the home page's JSON-LD is validated
- **THEN** it parses as a valid `MedicalClinic` whose name, address and telephone exactly match the footer

#### Scenario: Pending geo coordinates
- **WHEN** the clinic's coordinates are pending
- **THEN** the JSON-LD contains no `geo` property and no placeholder value

### Requirement: Consistent clinic identity
The clinic name, address and phone number SHALL come from a single content source and appear identically in page text, footer and structured data, so they can match the clinic's Google Business Profile exactly.

#### Scenario: Changing the phone number
- **WHEN** the phone number is changed in the clinic content and the site is rebuilt
- **THEN** the footer, contact pages, action bar, call links and JSON-LD all show the new number

### Requirement: Performance
Pages SHALL meet good Core Web Vitals on a mid-range phone: Largest Contentful Paint under 2.5s, Cumulative Layout Shift under 0.1 and Interaction to Next Paint under 200ms in lab testing. Images SHALL be served in responsive sizes with explicit dimensions, and images below the first screen SHALL load lazily.

#### Scenario: Lighthouse mobile audit
- **WHEN** a mobile Lighthouse audit runs on the home page of a production build
- **THEN** the performance, accessibility, best-practices and SEO scores are each at least 90
