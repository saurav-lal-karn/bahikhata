import { Metadata } from "next";
import ReportsPageClient from "./ReportsPageClient";

export const metadata: Metadata = {
  title: "Reports",
  description: "Deep dive into your household's financial health with Bahikhata.",
};

export default function ReportsPage() {
  return <ReportsPageClient />;
}
