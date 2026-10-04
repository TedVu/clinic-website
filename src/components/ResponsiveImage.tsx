import type { Photo } from "@/content/schema";
import { getImage, type ImageManifest, type ImageVariant } from "@/lib/image-manifest";

const srcSet = (variants: ImageVariant[]) => variants.map((v) => `${v.src} ${v.width}w`).join(", ");

/**
 * A clinic photo pre-sized by scripts/build-images.ts, served as AVIF/WebP with explicit
 * dimensions (no layout shift). Lazy-loaded unless it's the main image of the first screen.
 */
export function ResponsiveImage({
  photo,
  sizes,
  priority = false,
  className,
  manifest,
}: {
  photo: Photo;
  /** CSS `sizes`, e.g. "(min-width: 64rem) 40vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
  manifest?: ImageManifest;
}) {
  const image = getImage(photo.image, manifest);
  const fallback = image.webp.at(-1)!;
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image.webp)} sizes={sizes} />
      <img
        src={fallback.src}
        alt={photo.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
