import { SpecialtyPage } from "@/components/pages/SpecialtyPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("obstetrics", "vi");

export default function Page() {
  return <SpecialtyPage locale="vi" specialty="obstetrics" />;
}
