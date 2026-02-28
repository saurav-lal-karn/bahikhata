import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Savings Goals & Wealth | Bahikhata",
    description: "Savings goals tracking coming in v2.",
};

export default function GoalsPage() {
    return (
        <UnderConstruction
            featureName="Savings Goals & Wealth Analysis"
            description="Set financial targets and analyze portfolio diversity. This feature will be available in Bahikhata v2."
        />
    );
}
