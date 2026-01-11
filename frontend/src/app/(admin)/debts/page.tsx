import { Metadata } from "next";
import DebtsPageClient from "./DebtsPageClient";

export const metadata: Metadata = {
  title: "Liabilities & Debts",
  description: "Track your loans, credit card dues, and plan your debt repayment strategy with Bahikhata.",
};

export default function DebtsPage() {
  return <DebtsPageClient />;
}
