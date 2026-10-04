import { Be_Vietnam_Pro } from "next/font/google";

// The "vietnamese" subset is essential: without it, accented letters fall back to a system font
// one character at a time (e.g. "Nguyễn" rendered in two typefaces).
export const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-be-vietnam",
});
