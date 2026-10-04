import { DoctorsPage } from "@/components/pages/DoctorsPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("doctors", "vi");

export default function Page() {
  return <DoctorsPage locale="vi" />;
}
