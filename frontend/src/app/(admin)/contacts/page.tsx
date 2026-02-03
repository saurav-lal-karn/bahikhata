import { Metadata } from "next";
import ContactsPageClient from "./ContactsPageClient";

export const metadata: Metadata = {
  title: "Contacts Manager",
  description: "Manage your vendors, lenders, employers, and payees in one place.",
};

export default function ContactsPage() {
  return <ContactsPageClient />;
}
