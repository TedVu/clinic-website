# content-model Specification

## Purpose

Keeps all clinic, doctor, service and copy content separate from the UI and guarantees that the live site never shows invented medical facts or unfilled placeholders.

## Requirements

### Requirement: Content is stored separately from UI
All user-visible text and clinic facts SHALL live in content and locale files, not inside UI components. This covers clinic details, doctor data, service data, page copy and interface labels. Changing any of them MUST NOT require editing a component.

#### Scenario: Editing a service name
- **WHEN** an editor changes a service name in the service content file and rebuilds
- **THEN** every page that shows that service shows the new name, and no component file was modified

#### Scenario: No hard-coded Vietnamese in components
- **WHEN** the component source files are scanned for Vietnamese characters with diacritics
- **THEN** none are found outside content and locale files

### Requirement: Unsupplied facts are represented explicitly
Any fact the clinic has not yet supplied SHALL be recorded as an explicit "pending" value with a human-readable label describing what is needed, never as an empty string, invented value or lorem ipsum.

#### Scenario: Doctor qualifications not yet supplied
- **WHEN** a doctor's qualifications have not been provided
- **THEN** the content records that field as pending with a label such as "Bằng cấp, chứng chỉ chuyên môn"

### Requirement: Launch-blocking facts stop the production build
The production build SHALL fail when any launch-blocking fact is pending, and SHALL print the list of missing facts. Launch-blocking facts are: clinic name, street address, phone number, Zalo contact, opening hours, privacy notice text, public site URL, booking instructions, and at least one confirmed service for each specialty.

#### Scenario: Phone number missing
- **WHEN** a production build runs while the clinic phone number is pending
- **THEN** the build exits with an error that names the phone number as missing

#### Scenario: All launch-blocking facts supplied
- **WHEN** a production build runs and every launch-blocking fact is supplied
- **THEN** the content check passes, even if optional facts are still pending

### Requirement: Optional pending facts are hidden in production and visible elsewhere
Optional facts that are pending (for example qualifications, hospital affiliations, years of experience, areas of interest, biography, portraits, clinic photos, parking information, email) SHALL be omitted from production pages, with the surrounding layout still reading as complete. In development and preview builds they SHALL appear as clearly marked placeholders showing their label.

#### Scenario: Production page with missing affiliations
- **WHEN** a doctor's hospital affiliations are pending and the site is built for production
- **THEN** the doctor's page shows no affiliations row, no empty heading and no placeholder text

#### Scenario: Preview page with missing affiliations
- **WHEN** the same page is viewed in development or a preview build
- **THEN** a visibly marked placeholder shows the affiliations label so reviewers can see what is missing

#### Scenario: Missing portrait
- **WHEN** a doctor's portrait is pending in production
- **THEN** the profile renders as a typographic layout without an image frame or generic avatar

### Requirement: Services are listed only when confirmed
Each service entry SHALL carry a confirmation state. Only services the clinic has confirmed it offers SHALL appear on production pages. Unconfirmed suggestions from the brief MAY exist in content but MUST NOT be presented as clinic offerings in production.

#### Scenario: Unconfirmed service
- **WHEN** "Tư vấn dinh dưỡng" exists in content but is not confirmed
- **THEN** it does not appear on any production page

### Requirement: Content safety
The site content SHALL NOT contain invented qualifications, affiliations, years of experience, achievements, treatments, outcomes, patient reviews, ratings or statistics, and SHALL NOT make medical guarantees or superlative claims such as "tốt nhất" or "số 1".

#### Scenario: Reviewing seed content
- **WHEN** the seed content shipped with this change is reviewed
- **THEN** every doctor credential, clinic fact and service confirmation is either pending or supplied by the clinic, and no review, rating or statistic appears anywhere

### Requirement: Content report
The project SHALL provide a command that lists every pending fact, grouped into launch-blocking and optional, so the clinic can see what remains to supply.

#### Scenario: Running the report
- **WHEN** a developer runs the content report command
- **THEN** it prints each pending fact with its label and whether it blocks launch, and exits successfully regardless of what is missing
