import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Tax & Compliance Center | Bahikhata",
    description: "Tax center and compliance tools coming in v2.",
};

export default function TaxPage() {
    return (
        <UnderConstruction
            featureName="Tax & Compliance Center"
            description="Track tax-saving investments and export reports for tax filing. This feature will be available in Bahikhata v2."
        />
    );
}
