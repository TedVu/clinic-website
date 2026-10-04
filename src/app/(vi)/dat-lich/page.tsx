import { BookingPage } from "@/components/pages/BookingPage";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("booking", "vi");

export default function Page() {
  return <BookingPage locale="vi" />;
}
