import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("contact", "vi");

export default function Page() {
  return <ContactPage locale="vi" />;
}
