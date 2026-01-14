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
    const {user} = useAuth();
    const familyDetails = user?.family;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
        {/* Header with Title and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                Family Management
            </h1>
            <p className="text-gray-500 font-medium">
                Manage your household members and their access levels.
            </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
            <Link 
                href="/family/settings"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
            >
                <Settings className="w-5 h-5 text-gray-500" /> Family Settings
            </Link>
            <button 
                onClick={openModal}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
                <UserPlus className="w-5 h-5" /> Invite Member
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
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2 px-1">
                <Users className="w-5 h-5 text-blue-500" /> Household Members
            </h3>
            <FamilyMembersList familyId={familyDetails?.id || ""} />
        </div>

        {/* Invite Member Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
            <div className="mb-10">
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                New Invite
            </h3>
            <p className="text-sm text-gray-500 font-medium">Add a new person to your family group.</p>
            </div>
            <AddFamilyMember onSuccess={closeModal} onCancel={closeModal} family={familyDetails} />
        </Modal>
        </div>
    );
}
