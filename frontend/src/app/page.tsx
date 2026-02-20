import { Metadata } from "next";
import LandingPageClient from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
    title: "Bahikhata | Personal Expense Tracker",
    description:
        "Take control of your household budget, track shared expenses, and gain insights into your family's financial health with Bahikhata.",
};

export default function LandingPage() {
    return <LandingPageClient />;
}
