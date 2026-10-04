export const SITE_ENVS = ["production", "preview", "development"] as const;
export type SiteEnv = (typeof SITE_ENVS)[number];

/**
 * Which kind of build this is. Set per Cloudflare Pages environment:
 * - production: live site; pending facts are hidden and the content gate is strict
 * - preview: branch deploys; pending facts are shown as markers, pages are noindex
 * - development: local `next dev`
 * Read at call time (not module load) so tests can switch it.
 */
export function getSiteEnv(): SiteEnv {
  const value = process.env.SITE_ENV;
  return (SITE_ENVS as readonly string[]).includes(value ?? "")
    ? (value as SiteEnv)
    : "development";
}

export function isProduction(): boolean {
  return getSiteEnv() === "production";
}
