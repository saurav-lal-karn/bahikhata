import { Metadata } from "next";
import GoalsPageClient from "./GoalsPageClient";

export const metadata: Metadata = {
    title: "Savings Goals & Wealth",
    description:
        "Track your financial goals, calculate emergency funds, and analyze portfolio diversity for long-term wealth.",
};

export default function GoalsPage() {
    return <GoalsPageClient />;
}
