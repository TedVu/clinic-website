import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { afterAll, describe, expect, it } from "vitest";
import { processPhotos } from "../../scripts/build-images";

const dir = mkdtempSync(join(tmpdir(), "clinic-images-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("build-images", () => {
  it("creates AVIF and WebP variants without upscaling, plus a manifest", async () => {
    const source = join(dir, "src");
    const out = join(dir, "out");
    mkdirSync(source, { recursive: true });
    await sharp({ create: { width: 1000, height: 800, channels: 3, background: "#cccccc" } })
      .jpeg()
      .toFile(join(source, "phong-kham.jpg"));

    const manifest = await processPhotos(source, out);
    const entry = manifest["phong-kham"]!;
    expect(entry.width).toBe(1000);
    expect(entry.height).toBe(800);
    expect(entry.webp.map((v) => v.width)).toEqual([480, 800, 1000]);
    expect(entry.avif.map((v) => v.src)).toContain("/images/phong-kham-480.avif");
    for (const variant of [...entry.avif, ...entry.webp]) {
      expect(existsSync(join(out, variant.src.replace("/images/", "")))).toBe(true);
    }
    expect(JSON.parse(readFileSync(join(out, "manifest.json"), "utf8"))).toEqual(manifest);
  });

  it("writes an empty manifest when there are no photos", async () => {
    const manifest = await processPhotos(join(dir, "missing"), join(dir, "out-empty"));
    expect(manifest).toEqual({});
  });
});
