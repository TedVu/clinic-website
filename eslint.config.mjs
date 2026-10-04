import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    ".e2e/**",
    ".wrangler/**",
    "public/images/**",
    "test-results/**",
    "playwright-report/**",
    "review-screenshots/**",
    "next-env.d.ts",
    "openspec/**",
    ".claude/**",
  ]),
]);
