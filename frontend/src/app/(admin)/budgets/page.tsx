import { Metadata } from "next";
import BudgetsPageClient from "./BudgetsPageClient";

export const metadata: Metadata = {
  title: "Budget Manager",
  description: "Set and monitor monthly category budgets, enable rollover funds, and get AI-driven spending suggestions.",
};

export default function BudgetsPage() {
  return <BudgetsPageClient />;
}
