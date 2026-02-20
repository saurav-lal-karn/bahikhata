"use client";
import React, { useState } from "react";
import { FamilyStats } from "@/components/family/FamilyStats";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";
import { UserPlus, Settings, Users } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddFamilyMember } from "@/components/family/AddFamilyMember";
import { LedgerAudit } from "@/components/family/LedgerAudit";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function FamilyPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Family Management
                    </h1>
                    <p className="font-medium text-gray-500">
                        Manage your household members and their access levels.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/family/settings"
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-5 py-3 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <Settings className="h-5 w-5 text-gray-500" /> Family
                        Settings
                    </Link>
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:from-blue-500 hover:to-indigo-500 active:scale-95"
                    >
                        <UserPlus className="h-5 w-5" /> Invite Member
                    </button>
                </div>
            </div>

            {/* Stats Area */}
            <FamilyStats familyId={familyDetails?.id || ""} />

            {/* Ledger Audit Queue */}
            <div className="pt-4">
                <LedgerAudit />
            </div>

            {/* Members Directory */}
            <div className="pt-2">
                <h3 className="mb-6 flex items-center gap-2 px-1 text-xl font-black text-gray-800 dark:text-white">
                    <Users className="h-5 w-5 text-blue-500" /> Household
                    Members
                </h3>
                <FamilyMembersList familyId={familyDetails?.id || ""} />
            </div>

            {/* Invite Member Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-5xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        New Invite
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Add a new person to your family group.
                    </p>
                </div>
                <AddFamilyMember
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    family={familyDetails}
                />
            </Modal>
        </div>
    );
}
