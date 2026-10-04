# Launch checklist

Steps to take the site from preview to live. Most of what makes a local clinic findable happens outside the code, so steps 3–6 matter as much as the deploy.

## 0. Before launch

- [ ] All launch-blocking content is in: `npm run content:report` shows `Launch-blocking: 0`. Collect it with [content-checklist.md](content-checklist.md) (Vietnamese, for the clinic).
- [ ] The clinic owner has checked with **Sở Y tế TP. Hồ Chí Minh** whether the site's content needs advertising approval (xác nhận nội dung quảng cáo dịch vụ khám bệnh, chữa bệnh). The site makes no claims, but approval may still be required.
- [ ] Both doctors have reviewed their profile and the services they confirmed, on a preview URL.

## 1. Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**, and pick this repository.
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node version: set environment variable `NODE_VERSION` = `24` (or the current LTS).
3. Environment variables (**Settings → Variables and secrets**):

   | Variable | Production | Preview |
   | --- | --- | --- |
   | `SITE_ENV` | `production` | `preview` |
   | `NODE_VERSION` | `24` | `24` |

   With `SITE_ENV=production`, the build **fails** while any launch-blocking fact is missing, so a half-filled site can never go live. Preview builds always succeed, show "Cần bổ sung" markers for missing facts, and are `noindex`.
4. Production branch: `main`. Every other branch and pull request gets its own preview URL.
5. Check a preview deploy: placeholders visible, `/robots.txt` says `Disallow: /`, and each page has `<meta name="robots" content="noindex, nofollow">`.

Cloudflare Pages serves `/san-khoa` from `san-khoa.html` and `out/404.html` for unknown paths, so no redirect or rewrite rules are needed.

## 2. Domain

- Prefer a **`.vn`** domain (registered through a Vietnamese registrar accredited by VNNIC). A country-code domain is a direct signal to Google that the site serves Vietnam.
- In Cloudflare Pages → **Custom domains**, add the domain (and `www`, redirecting to the main one).
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

## Rollback

Cloudflare Pages → the project → **Deployments** → pick the last good deployment → **Rollback to this deployment**. It takes effect immediately, and there is no data to migrate.
