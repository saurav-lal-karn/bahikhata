import { Metadata } from "next";
import FamilySettingsPageClient from "./FamilySettingsPageClient";

export const metadata: Metadata = {
    title: "Family Settings",
    description:
        "Configure global defaults for your household group in Bahikhata.",
};

export default function FamilySettingsPage() {
    return <FamilySettingsPageClient />;
}
