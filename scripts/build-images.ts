// Turns real clinic photos in assets/photos/ into responsive AVIF + WebP variants
// in public/images/, plus a manifest the ResponsiveImage component reads at build time.
// Static export has no image optimizer, so this replaces it for the handful of photos the site uses.
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import type { ImageManifest, ImageManifestEntry } from "../src/lib/image-manifest";

export const WIDTHS = [480, 800, 1200, 1600] as const;
const FORMATS = ["avif", "webp"] as const;
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

export async function processPhotos(
  sourceDir: string,
  outDir: string,
  publicPrefix = "/images",
): Promise<ImageManifest> {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(sourceDir).catch(() => [] as string[])).filter((file) =>
    SOURCE_EXTENSIONS.has(extname(file).toLowerCase()),
  );

  const manifest: ImageManifest = {};
  for (const file of files) {
    const name = basename(file, extname(file));
    const image = sharp(join(sourceDir, file)).rotate(); // respect EXIF orientation
    const { width: originalWidth = 0, height: originalHeight = 0 } = await image.metadata();
    // Never upscale: keep the widths smaller than the original, plus the original itself.
    const widths = [...WIDTHS.filter((w) => w < originalWidth), Math.min(originalWidth, 1600)];
    const uniqueWidths = [...new Set(widths)].sort((a, b) => a - b);

    const entry: ImageManifestEntry = {
      width: uniqueWidths.at(-1)!,
      height: Math.round((originalHeight / originalWidth) * uniqueWidths.at(-1)!),
      avif: [],
      webp: [],
    };
    for (const width of uniqueWidths) {
      for (const format of FORMATS) {
        const outName = `${name}-${width}.${format}`;
        await image
          .clone()
          .resize({ width })
          .toFormat(format, { quality: format === "avif" ? 55 : 75 })
          .toFile(join(outDir, outName));
        entry[format].push({ width, src: `${publicPrefix}/${outName}` });
      }
    }
    manifest[name] = entry;
  }

  await writeFile(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const manifest = await processPhotos("assets/photos", "public/images");
  console.log(`Images: ${Object.keys(manifest).length} photo(s) processed into public/images/`);
}
