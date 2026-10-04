import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { doctorForSpecialty, getContent } from "@/content";
import { brandName, OG_IMAGE } from "@/lib/metadata";

// Rendered once at build time to out/og.png and referenced by every page's og:image.
export const dynamic = "force-static";

const fontFile = (subset: string, weight: number) =>
  readFile(
    join(process.cwd(), `node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-${subset}-${weight}-normal.woff`),
  );

/** Typographic share image (no photo yet): clinic name, the two specialties and their doctors. */
export async function GET() {
  const { specialties, copy } = getContent("vi");
  const [latin400, viet400, latin600, viet600] = await Promise.all([
    fontFile("latin", 400),
    fontFile("vietnamese", 400),
    fontFile("latin", 600),
    fontFile("vietnamese", 600),
  ]);
  const rows = (["obstetrics", "pediatrics"] as const).map((key) => {
    const doctor = doctorForSpecialty(key, "vi");
    return { name: specialties[key].name, doctor: `${doctor.title} ${doctor.name}` };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#faf8f4",
          color: "#1e2a2f",
          fontFamily: "Be Vietnam Pro",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#2d5f5b", fontWeight: 600 }}>
            {copy.hero.eyebrow}
          </div>
          <div style={{ marginTop: 20, fontSize: 64, fontWeight: 600, lineHeight: 1.2 }}>
            {brandName("vi")}
          </div>
        </div>
        <div style={{ display: "flex", borderTop: "2px solid #e2dcd2", paddingTop: 36, gap: 80 }}>
          {rows.map((row) => (
            <div key={row.name} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 36, fontWeight: 600 }}>{row.name}</div>
              <div style={{ marginTop: 8, fontSize: 30, color: "#4f5b60" }}>{row.doctor}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
      fonts: [
        { name: "Be Vietnam Pro", data: latin400, weight: 400 },
        { name: "Be Vietnam Pro", data: viet400, weight: 400 },
        { name: "Be Vietnam Pro", data: latin600, weight: 600 },
        { name: "Be Vietnam Pro", data: viet600, weight: 600 },
      ],
    },
  );
}
