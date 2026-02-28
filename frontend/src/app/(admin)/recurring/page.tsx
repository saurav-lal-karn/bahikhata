import { Metadata } from "next";
import { UnderConstruction } from "@/components/UnderConstruction";

export const metadata: Metadata = {
    title: "Recurring Bills & Subscriptions | Bahikhata",
    description: "Recurring bill management coming in v2.",
};

export default function RecurringPage() {
    return (
        <UnderConstruction
            featureName="Recurring Bills Management"
            description="Manage your recurring household bills and set up automated reminders. This feature will be available in Bahikhata v2."
        />
    );
}
