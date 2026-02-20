import { Metadata } from "next";
import ExpensesPageClient from "./ExpensesPageClient";

export const metadata: Metadata = {
    title: "Expenses",
    description: "Manage and monitor your household spending with Bahikhata.",
};

export default function ExpensesPage() {
    return <ExpensesPageClient />;
}
