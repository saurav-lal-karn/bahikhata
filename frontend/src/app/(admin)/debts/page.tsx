import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Liabilities & Debts | Bahikhata",
    description: "Debt and loan tracking coming in v2.",
};

export default function DebtsPage() {
    return (
        <UnderConstruction
            featureName="Debts & Loans Management"
            description="Track your loans and plan repayment strategies. This feature will be available in Bahikhata v2."
        />
    );
}
