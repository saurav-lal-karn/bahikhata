import { Metadata } from "next";
import AccountsPageClient from "./AccountsPageClient";

export const metadata: Metadata = {
    title: "Accounts & Wallets",
    description:
        "Track balances across multiple bank accounts, digital wallets, and cash reserves with ease.",
};

export default function AccountsPage() {
    return <AccountsPageClient />;
}
