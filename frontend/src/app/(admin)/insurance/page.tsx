import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Insurance & Safety | Bahikhata",
    description: "Insurance tracking coming in v2.",
};

export default function InsurancePage() {
    return (
        <UnderConstruction
            featureName="Insurance & Safety Tracking"
            description="Protect your family and assets with comprehensive insurance coverage tracking. This feature will be available in Bahikhata v2."
        />
    );
}
