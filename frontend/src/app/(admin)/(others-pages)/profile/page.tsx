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
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
          User Profile
        </h1>
        <p className="text-gray-500 font-medium italic">
          Manage your personal footprint and secure your financial identity.
        </p>
      </div>
      
      <div className="space-y-8">
        <UserMetaCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
