import { Metadata } from "next";
import NotificationsPageClient from "./NotificationsPageClient";

export const metadata: Metadata = {
    title: "Notifications",
    description:
        "Stay updated with your family's financial activities in Bahikhata.",
};

export default function NotificationsPage() {
    return <NotificationsPageClient />;
}
