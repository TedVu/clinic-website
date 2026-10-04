import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("privacy", "vi");

export default function Page() {
  return <PrivacyPage locale="vi" />;
}
