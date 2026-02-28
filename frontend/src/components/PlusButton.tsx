"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AddTransactionWizard } from "./transactions/AddTransactionWizard";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "./expenses/AddExpenseForm";
import { IncomeForm } from "./income/IncomeForm";
import { useAuth } from "@/context/AuthContext";
import useGoBack from "@/hooks/useGoBack";
import { useCategories } from "@/hooks/useCategories";
import { useTags, useLocations, useProjects } from "@/hooks/useOrganization";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useWallets } from "@/hooks/useWallets";
import { useContacts } from "@/hooks/useContacts";
import { ExpenseCategory, PaymentMethod, WalletInfoType } from "@/types";
import toast from "react-hot-toast";

export const PlusButton = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;

    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const { data: categoriesData } = useCategories(familyId || "", "EXPENSE");
    const { data: incomeTypesData } = useCategories(familyId || "", "INCOME");
    const { data: paymentMethodsData } = usePaymentMethods(familyId || "");
    const { data: walletsData } = useWallets(familyId || "", 1, 100);
    const { data: tagsData } = useTags(familyId || "");
    const { data: locationsData } = useLocations(familyId || "");
    const { data: projectsData } = useProjects(familyId || "");
    const { data: contactsData } = useContacts(familyId || "");

    const categories = categoriesData || [];
    const incomeTypes = incomeTypesData || [];
    const paymentMethods = paymentMethodsData || [];
    const wallets = walletsData?.wallets || [];
    const tags = tagsData || [];
    const locations = locationsData || [];
    const projects = projectsData || [];
    const contacts = contactsData || [];

    return (
        <div className="fixed right-6 bottom-24 z-[9998]">
            <div className="group relative">
                {/* Tooltip */}
                <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-lg border border-white/10 bg-gray-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 dark:border-gray-800 dark:bg-white dark:text-gray-900">
                    Add Transaction
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
                </span>

                <button
                    onClick={() => setIsWizardOpen(true)}
                    className="group flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl ring-4 ring-white transition-all duration-300 hover:scale-110 active:scale-95 dark:ring-gray-900"
                    title="Add Transaction"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
                </button>
            </div>

            <AddTransactionWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                familyId={familyId || ""}
                categories={categories}
                incomeTypes={incomeTypes}
                paymentMethods={paymentMethods}
                wallets={wallets}
                tags={tags}
                locations={locations}
                projects={projects}
                contacts={contacts}
            />
        </div>
    );
};
