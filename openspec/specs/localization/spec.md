# localization Specification

## Purpose

Makes Vietnamese the first-class, default language of the site while keeping the structure ready for English to be added later without reorganising pages or content.

## Requirements

### Requirement: Vietnamese is served at the site root
Vietnamese pages SHALL be served without a locale prefix (for example `/`, `/san-khoa`, `/bac-si/vu-duy-minh`). Visiting the root MUST return the Vietnamese home page directly, without a redirect.

#### Scenario: Visiting the root
- **WHEN** a visitor requests `/`
- **THEN** the Vietnamese home page is returned with status 200 and no redirect

### Requirement: Correct document language
Every page SHALL declare its language on the document root (`lang="vi"` for Vietnamese pages).

#### Scenario: Language attribute
- **WHEN** any Vietnamese page is loaded
- **THEN** the `html` element has `lang="vi"`

### Requirement: Locale-ready structure
Interface strings SHALL come from a per-locale dictionary, and page content SHALL come from per-locale content files that share one typed shape. Adding English MUST only require adding English dictionary and content files and English route entries under `/en`, without changing Vietnamese URLs or components.

#### Scenario: Missing English string
- **WHEN** an English dictionary is added that lacks a key present in the Vietnamese dictionary
- **THEN** the type check fails and names the missing key

### Requirement: Language switcher is hidden until a second locale exists
The language switcher SHALL render only when more than one locale is enabled. With Vietnamese as the only locale, no switcher or dead link to English SHALL appear.

#### Scenario: Vietnamese only
- **WHEN** only Vietnamese is enabled
- **THEN** no language switcher appears in the header, mobile menu or footer

### Requirement: Natural, correctly accented Vietnamese
All Vietnamese copy SHALL use correct diacritics and natural, respectful, plain wording, using the same terminology consistently (for example "Sản khoa", "Nhi khoa", "Đặt lịch khám", "BS." before doctor names).

#### Scenario: Copy review
- **WHEN** the Vietnamese locale and content files are reviewed
- **THEN** no word is missing diacritics and no sentence uses machine-translated or marketing phrasing
