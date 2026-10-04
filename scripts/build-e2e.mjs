// Builds the site twice for end-to-end tests:
//   .e2e/preview     SITE_ENV=preview     (pending facts shown as markers, noindex)
//   .e2e/production  SITE_ENV=production  (pending facts omitted, as on the live site)
// The production-mode build intentionally runs `next build` directly, skipping the
// launch content gate, so layouts can be tested with the seed content. It is never deployed.
import { execSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";

const extra = process.env.E2E_BOOKING_HREF ? { BOOKING_HREF: process.env.E2E_BOOKING_HREF } : {};

execSync("npx tsx scripts/build-images.ts", { stdio: "inherit" });

for (const mode of ["preview", "production"]) {
  console.log(`\n=== Building ${mode} site for e2e ===`);
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, ...extra, SITE_ENV: mode },
  });
  rmSync(`.e2e/${mode}`, { recursive: true, force: true });
  cpSync("out", `.e2e/${mode}`, { recursive: true });
}
