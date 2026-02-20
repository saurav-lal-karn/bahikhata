import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Profile | Bahikhata",
    description: "View and manage your personal financial identity.",
};

export default function Profile() {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                    User Profile
                </h1>
                <p className="font-medium text-gray-500 italic">
                    Manage your personal footprint and secure your financial
                    identity.
                </p>
            </div>

            <div className="space-y-8">
                <UserMetaCard />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </div>
        </div>
    );
}
