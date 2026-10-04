import { HomePage } from "@/components/pages/HomePage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("home", "vi");

export default function Page() {
  return <HomePage locale="vi" />;
}
