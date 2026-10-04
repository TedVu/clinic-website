// Runs before every `npm run build`.
// - SITE_ENV=production: fails the build if any launch-blocking fact is missing.
// - otherwise (or with --report): prints what is still pending and exits successfully.
import { getContent } from "../src/content";
import { checkContent, formatReport } from "../src/lib/content-check";
import { getSiteEnv } from "../src/lib/env";

const reportOnly = process.argv.includes("--report");
const result = checkContent(getContent("vi"));
const strict = !reportOnly && getSiteEnv() === "production";

console.log(`\nContent check (${reportOnly ? "report" : getSiteEnv()})\n`);
console.log(formatReport(result));

if (strict && !result.ok) {
  console.error(
    `\nProduction build stopped: ${result.blocking.length} launch-blocking item(s) above must be supplied.` +
      `\nSee docs/content-checklist.md.\n`,
  );
  process.exit(1);
}
console.log("");
