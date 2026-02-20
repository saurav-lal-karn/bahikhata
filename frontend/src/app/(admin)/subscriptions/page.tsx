import { Metadata } from "next";
import SubscriptionPageClient from "./SubscriptionPageClient";

export const metadata: Metadata = {
    title: "Subscriptions & Recurrences | Bahikhata",
    description:
        "Manage your digital subscriptions and monthly burn rate in one place.",
};

export default function SubscriptionPage() {
    return <SubscriptionPageClient />;
}
