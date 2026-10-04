import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ImageVariant = { width: number; src: string };

export type ImageManifestEntry = {
  /** Dimensions of the largest variant, used for width/height attributes (prevents layout shift). */
  width: number;
  height: number;
  avif: ImageVariant[];
  webp: ImageVariant[];
};

export type ImageManifest = Record<string, ImageManifestEntry>;

let cached: ImageManifest | undefined;

/** Reads public/images/manifest.json written by scripts/build-images.ts. Server/build time only. */
export function loadImageManifest(): ImageManifest {
  if (!cached) {
    try {
      cached = JSON.parse(
        readFileSync(join(process.cwd(), "public/images/manifest.json"), "utf8"),
      ) as ImageManifest;
    } catch {
      cached = {};
    }
  }
  return cached;
}

export function getImage(name: string, manifest: ImageManifest = loadImageManifest()) {
  const entry = manifest[name];
  if (!entry) {
    throw new Error(
      `Image "${name}" is referenced in content but missing from public/images/manifest.json. ` +
        `Add assets/photos/${name}.jpg (or .png/.webp) and run "npm run build" again.`,
    );
  }
  return entry;
}
