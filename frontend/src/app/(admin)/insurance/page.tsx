import { Metadata } from "next";
import InsurancePageClient from "./InsurancePageClient";

export const metadata: Metadata = {
  title: "Insurance & Safety | Bahikhata",
  description: "Protect your family and assets with comprehensive insurance coverage tracking.",
};

export default function InsurancePage() {
  return <InsurancePageClient />;
}
