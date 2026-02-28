import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Subscriptions & Recurrences | Bahikhata",
    description: "Subscription management coming in v2.",
};

export default function SubscriptionPage() {
    return (
        <UnderConstruction
            featureName="Subscription Management"
            description="Manage your digital subscriptions and monthly burn rate in one place. This feature will be available in Bahikhata v2."
        />
    );
}
