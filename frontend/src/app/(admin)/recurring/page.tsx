import { Metadata } from "next";
import RecurringPageClient from "./RecurringPageClient";

export const metadata: Metadata = {
  title: "Recurring Bills & Subscriptions",
  description: "Manage your digital subscriptions, recurring household bills, and set up automated payment reminders.",
};

export default function RecurringPage() {
  return <RecurringPageClient />;
}
