import { Metadata } from "next";
import UserSettingsPageClient from "./UserSettingsPageClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your personal identity, security, and preferences in Bahikhata.",
};

export default function UserSettingsPage() {
  return <UserSettingsPageClient />;
}
