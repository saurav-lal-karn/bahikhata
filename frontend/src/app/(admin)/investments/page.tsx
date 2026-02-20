import { Metadata } from "next";
import InvestmentsPageClient from "./InvestmentsPageClient";

export const metadata: Metadata = {
    title: "Investments",
    description:
        "Track and manage your family's investment portfolio and long-term wealth with Bahikhata.",
};

export default function InvestmentsPage() {
    return <InvestmentsPageClient />;
}
