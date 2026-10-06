# Launch checklist

Steps to take the site from preview to live. Most of what makes a local clinic findable happens outside the code, so steps 3–6 matter as much as the deploy.

## 0. Before launch

- [ ] All launch-blocking content is in: `npm run content:report` shows `Launch-blocking: 0`. Collect it with [content-checklist.md](content-checklist.md) (Vietnamese, for the clinic).
- [ ] The clinic owner has checked with **Sở Y tế TP. Hồ Chí Minh** whether the site's content needs advertising approval (xác nhận nội dung quảng cáo dịch vụ khám bệnh, chữa bệnh). The site makes no claims, but approval may still be required.
- [ ] Both doctors have reviewed their profile and the services they confirmed, on a preview URL.

## 1. Cloudflare (Workers with static assets)

The site deploys as a Cloudflare Worker that only serves static files. `wrangler.jsonc` in the repo points Wrangler at `out/`, which also stops Cloudflare from auto-installing the OpenNext server adapter (that adapter is for server-rendered Next.js and fails on a static export).

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**, and pick this repository.
2. Build settings (**Settings → Build**):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
3. **Build** variables (**Settings → Build → Variables and secrets**, not the Worker's runtime variables, because the site reads them at build time):

   | Variable | Value |
   | --- | --- |
   | `SITE_ENV` | `production` |
   | `NODE_VERSION` | `24` |

   With `SITE_ENV=production`, the build **fails** while any launch-blocking fact is missing, so a half-filled site can never go live. Check the build log shows `Content check (production)`; `Content check (development)` means the variable is missing and the live site would be `noindex`.
4. Production branch: `main`. Build variables apply to every branch, so preview builds of other branches are also built in production mode. Either turn off non-production branch builds, or review changes locally with `npm run build && npm run serve` (preview mode, markers visible).
5. Check the `*.workers.dev` URL: pages load, `/robots.txt` says `Allow: /`, and an unknown path shows the 404 page.

`wrangler.jsonc` serves `/san-khoa` from `san-khoa.html`, redirects `/san-khoa/` to `/san-khoa`, and returns `out/404.html` with a 404 status for unknown paths. `public/_headers` gives hashed Next.js files a one-year cache. Test locally with `npx wrangler dev` after a build.

## 2. Domain

- Prefer a **`.vn`** domain (registered through a Vietnamese registrar accredited by VNNIC). A country-code domain is a direct signal to Google that the site serves Vietnam.
- Add the domain to Cloudflare (**Add a site**, Free plan) and switch the registrar's nameservers to the two Cloudflare gives you.
- In the Worker → **Settings → Domains & Routes → Add → Custom domain**, add `phongkhamsannhi.com`, plus `www.phongkhamsannhi.com` with a redirect rule to the main domain.
- Set `clinic.siteUrl` in `src/content/vi/clinic.ts` to the final address (`https://…`, no trailing slash). Canonical URLs, the sitemap and structured data all use it.
- Check after deploy: `https://<domain>/` returns 200, `/robots.txt` says `Allow: /` and lists the sitemap.

## 3. Google Business Profile

This drives the map results ("phòng khám sản nhi gần đây", "khám thai quận …") more than the website does.

- [ ] Create or claim the profile at business.google.com and verify the real address.
- [ ] Name, address and phone **exactly** as on the website (same spelling, same phone format). The website takes them from `src/content/vi/clinic.ts`, so keep the two in sync whenever either changes.
- [ ] Primary category: an obstetrics/pediatrics clinic category; add the other as a secondary category.
- [ ] Opening hours identical to the website.
- [ ] Website link: the home page URL.
- [ ] Real photos of the clinic (same guidance as the website).
- [ ] Reviews: only genuine reviews left by patients. Never post or buy reviews, and never copy reviews onto the website.

## 4. Search engines

- [ ] **Google Search Console**: add the domain property (DNS verification through Cloudflare is quickest), submit `https://<domain>/sitemap.xml`, and check it shows "Success".
- [ ] **Cốc Cốc Webmaster Tools** (webmaster.coccoc.com): add the site and submit the same sitemap. Cốc Cốc's share is small but its users are almost all Vietnamese.
- [ ] Use Search Console's URL Inspection on the home page and both doctor pages to request indexing.

## 5. Realistic expectations

- A new domain usually takes **weeks to a few months** to rank.
- Searches the site can win early: the clinic name, **the doctors' names** ("bác sĩ Vũ Duy Minh"), and district-level searches combined with the Business Profile.
- Broad terms ("khám thai", "bác sĩ nhi") are dominated by large hospitals and won't come quickly.
- Medical sites are judged strictly on trust. Real, specific doctor credentials and doctor-reviewed service descriptions help more than anything else on the site.

## 6. After launch

- [ ] Run a Lighthouse mobile audit on the live home page (target 90+ in every category).
- [ ] Share a page link in Zalo and check the preview card shows the title and image.
- [ ] Whenever clinic details change, update `src/content/vi/clinic.ts` **and** the Google Business Profile on the same day.
- [ ] After a deploy that changes page titles, use Search Console's URL Inspection → **Request indexing** on each page whose title changed, so search results pick up the new titles sooner.

## 7. External profiles (`sameAs`)

The site's structured data links the clinic and each doctor to their profiles elsewhere (`clinic.profiles` and each doctor's `profiles` in `src/content/vi/`). These links tell Google the website and those profiles are the same clinic or the same person, so a wrong one does real harm.

- [ ] Before adding a URL, open it and confirm it shows **this** clinic's address (611/95 Điện Biên Phủ) and phone, or **this** doctor. Leave anything unconfirmed as `pending(...)`.
- [ ] A page about one doctor goes in that doctor's `profiles`, never in the clinic's.
- [ ] Still to collect: directory pages for BS. Nguyễn Thị Thanh Xuân. `npm run content:report` lists whatever is missing.

## Rollback

Cloudflare dashboard → the Worker → **Deployments** → pick the last good version → **Rollback**. It takes effect immediately, and there is no data to migrate.
