import { Metadata } from "next";
import FamilyPageClient from "./FamilyPageClient";

export const metadata: Metadata = {
  title: "Family",
  description: "Manage your household members and their access levels with Bahikhata.",
};

export default function FamilyPage() {
  return <FamilyPageClient />;
}
