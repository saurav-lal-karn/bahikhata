import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Investments | Bahikhata",
    description: "Investment portfolio tracking coming in v2.",
};

export default function InvestmentsPage() {
    return (
        <UnderConstruction
            featureName="Investment Portfolio Tracking"
            description="Monitor your stocks, crypto, and mutual funds in real-time. This feature will be available in Bahikhata v2."
        />
    );
}
