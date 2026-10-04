import { ClinicPage } from "@/components/pages/ClinicPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("clinic", "vi");

export default function Page() {
  return <ClinicPage locale="vi" />;
}
