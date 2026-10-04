import { DoctorPage } from "@/components/pages/DoctorPage";
import { getContent } from "@/content";
import { doctorMetadata } from "@/lib/page-metadata";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent("vi").doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: Params) {
  return doctorMetadata((await params).slug, "vi");
}

export default async function Page({ params }: Params) {
  return <DoctorPage locale="vi" slug={(await params).slug} />;
}
