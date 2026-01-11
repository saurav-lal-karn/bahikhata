import { Metadata } from "next";
import IncomePageClient from "./IncomePageClient";

export const metadata: Metadata = {
  title: "Income",
  description: "Monitor inflows and track your earning sources with Bahikhata.",
};

export default function IncomePage() {
  return <IncomePageClient />;
}
