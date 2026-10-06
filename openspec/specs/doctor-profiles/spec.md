# doctor-profiles Specification

## Purpose

Presents each doctor credibly and with enough space, on an overview page and on a dedicated page per doctor that people searching for the doctor by name can land on.

## Requirements

### Requirement: Doctors overview page
The site SHALL provide `/bac-si` introducing both doctors, each with name, specialty, a short introduction and a link to their own page. Doctors SHALL be presented as full-width editorial sections, not as small cards in a grid.

#### Scenario: Overview on desktop
- **WHEN** `/bac-si` is viewed at 1280px wide
- **THEN** each doctor occupies their own full-width section rather than sharing a row in a multi-column card grid

### Requirement: Dedicated page per doctor
Each doctor SHALL have a page at `/bac-si/<slug>` (`/bac-si/vu-duy-minh`, `/bac-si/nguyen-thi-thanh-xuan`) whose `h1` is the doctor's name with the "BS." title. The page SHALL show the specialty, a link to the specialty page and a booking action, plus each of the following that has been supplied: portrait, professional biography, qualifications, clinical experience, hospital affiliations and areas of interest.

#### Scenario: Doctor page heading
- **WHEN** a visitor opens `/bac-si/nguyen-thi-thanh-xuan`
- **THEN** the page heading is "BS. Nguyễn Thị Thanh Xuân" and the specialty "Nhi khoa" is shown

#### Scenario: Partially supplied profile
- **WHEN** a doctor's biography is supplied but qualifications are pending
- **THEN** the production page shows the biography and omits the qualifications section entirely

### Requirement: Only supplied credentials appear
Doctor pages SHALL show credentials, experience and affiliations exactly as supplied by the clinic. Nothing SHALL be inferred, rounded up or generated.

#### Scenario: Seed state
- **WHEN** the site is built from the seed content of this change
- **THEN** no qualification, affiliation or number of years appears for either doctor

### Requirement: Real portraits only
Portraits SHALL be real photographs supplied by the clinic, with alternative text naming the doctor. Generated, stock or illustrated faces MUST NOT be used.

#### Scenario: Portrait supplied
- **WHEN** a portrait is supplied for BS. Vũ Duy Minh
- **THEN** it is shown with alternative text such as "Chân dung BS. Vũ Duy Minh" and is served at sizes appropriate to the screen
