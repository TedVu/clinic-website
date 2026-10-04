import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`.
  output: "export",
  // `/san-khoa` is emitted as `san-khoa.html`; Cloudflare Pages serves it at `/san-khoa`.
  trailingSlash: false,
  images: {
    // Static export has no image optimizer; photos are pre-sized by scripts/build-images.ts.
    unoptimized: true,
  },
  experimental: {
    // Needed because Vietnamese (and later English) each have their own root layout.
    globalNotFound: true,
  },
};

export default nextConfig;
