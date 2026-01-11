import { Metadata } from "next";
import TaxPageClient from "./TaxPageClient";

export const metadata: Metadata = {
  title: "Tax & Compliance Center",
  description: "Track your tax-saving investments (Section 80C/80D), store financial documents securely, and export reports for tax filing.",
};

export default function TaxPage() {
  return <TaxPageClient />;
}
