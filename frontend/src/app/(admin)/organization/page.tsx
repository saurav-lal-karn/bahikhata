import { Metadata } from "next";
import OrganizationPageClient from "./OrganizationPageClient";

export const metadata: Metadata = {
  title: "Tags & Projects",
  description: "Manage tags, projects, and locations for organizing transactions.",
};

export default function OrganizationPage() {
  return <OrganizationPageClient />;
}
