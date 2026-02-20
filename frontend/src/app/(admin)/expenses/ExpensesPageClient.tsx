"use client";
import React, { useState, useEffect } from "react";
import { ExpensesList } from "@/components/expenses/ExpensesList";
import { ExpensesStats } from "@/components/expenses/ExpensesStats";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import { BulkImportExpenses } from "@/components/expenses/BulkImportExpenses";
import { FileSpreadsheet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    WalletInfoType,
    Transaction,
    ExpenseCategory,
    PaymentMethod,
} from "@/types";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { paymentMethodService } from "@/services/paymentMethodService";
import { walletService } from "@/services/walletService";
import { transactionService } from "@/services/transactionService";
import { DeleteConfirmationModal } from "@/components/ui/modal/DeleteConfirmationModal";
import toast from "react-hot-toast";
import { contactService } from "@/services/contactService";
import { organizationService, Location } from "@/services/organizationService";
import { Contact, Project, Tag } from "@/types";

export default function ExpensesPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalLarge, setIsModalLarge] = useState<boolean>(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
    const [isBulkLarge, setIsBulkLarge] = useState<boolean>(false);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    const [editingExpense, setEditingExpense] = useState<Transaction | null>(
        null
    );
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
        setIsModalLarge(false);
    };

    const openBulkModal = () => setIsBulkModalOpen(true);
    const closeBulkModal = () => {
        setIsBulkModalOpen(false);
        setIsBulkLarge(false);
    };

    const handleExpenseAdded = () => {
        setRefreshKey((prev) => prev + 1);
        closeModal();
    };

    const handleEditExpense = (expense: Transaction) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleDeleteExpense = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await transactionService.deleteTransaction(deletingId);
            toast.success("Expense deleted");
            setRefreshKey((prev) => prev + 1);
            setDeletingId(null);
        } catch (error) {
            toast.error("Failed to delete expense");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!familyDetails?.id) return;

            try {
                const [
                    categoriesResponse,
                    paymentMethodsResponse,
                    walletResponse,
                    contactsResponse,
                    projectsResponse,
                    tagsResponse,
                    locationsResponse,
                ] = await Promise.all([
                    transactionCategoryService.getCategories(
                        familyDetails.id,
                        true,
                        "EXPENSE"
                    ),
                    paymentMethodService.getPaymentMethods(familyDetails.id),
                    walletService.getWallets(familyDetails.id, 1, 100),
                    contactService.getContacts(familyDetails.id),
                    organizationService.getProjects(familyDetails.id),
                    organizationService.getTags(familyDetails.id),
                    organizationService
                        .getLocations(familyDetails.id)
                        .catch(() => []),
                ]);

                if (isMounted) {
                    setCategories(categoriesResponse);
                    setPaymentMethods(paymentMethodsResponse);
                    setWallets(walletResponse.wallets);
                    setContacts(contactsResponse);
                    setProjects(projectsResponse);
                    setTags(tagsResponse);
                    setLocations(locationsResponse);
                }
            } catch (error) {
                if (isMounted) {
                    console.error(
                        "Failed to fetch categories or payment methods:",
                        error
                    );
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [familyDetails]);

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Family Expenses
                    </h1>
                    <p className="font-medium text-gray-500">
                        Manage and monitor your household spending.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openBulkModal}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-5 py-3 font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <FileSpreadsheet className="h-5 w-5 text-green-600" />{" "}
                        Import
                    </button>
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-blue-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add New Expense
                    </button>
                </div>
            </div>

            {/* Stats Summary Area */}
            <ExpensesStats
                familyId={familyDetails?.id || ""}
                refreshKey={refreshKey}
            />

            {/* Main Table / List Area */}
            <ExpensesList
                familyId={familyDetails?.id || ""}
                refreshKey={refreshKey}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
            />

            {/* Add Expense Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className={
                    isModalLarge
                        ? "max-w-[95vw] p-5 transition-all duration-500 ease-in-out md:p-10"
                        : "max-w-5xl p-10 transition-all duration-500 ease-in-out"
                }
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingExpense
                            ? "Edit Transaction"
                            : "New Transaction"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingExpense
                            ? "Update transaction details."
                            : "Record a new expense or scan a receipt to auto-fill details."}
                    </p>
                </div>
                <AddExpenseForm
                    onSuccess={handleExpenseAdded}
                    onCancel={closeModal}
                    categories={categories}
                    paymentMethods={paymentMethods}
                    wallets={wallets}
                    familyId={familyDetails?.id || ""}
                    initialData={editingExpense}
                    contacts={contacts}
                    projects={projects}
                    tags={tags}
                    locations={locations}
                    onFileSelect={(hasFile) => setIsModalLarge(hasFile)}
                />
            </Modal>

            <DeleteConfirmationModal
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Delete Expense"
                description="Are you sure you want to delete this expense? This action cannot be undone."
                isDeleting={isDeleting}
            />

            {/* Bulk Import Modal */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={closeBulkModal}
                className={
                    isBulkLarge
                        ? "max-w-[95vw] p-5 transition-all duration-500 ease-in-out md:p-10"
                        : "max-w-4xl p-10 transition-all duration-500 ease-in-out"
                }
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Bulk Import
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        Upload a CSV or Excel file to import multiple expenses
                        at once.
                    </p>
                </div>
                <BulkImportExpenses
                    onSuccess={closeBulkModal}
                    onCancel={closeBulkModal}
                    onFileSelect={(hasFile) => setIsBulkLarge(hasFile)}
                    familyId={familyDetails?.id || ""}
                    categories={categories}
                    wallets={wallets}
                    paymentMethods={paymentMethods}
                    contacts={contacts}
                    projects={projects}
                    tags={tags}
                    locations={locations}
                />
            </Modal>
        </div>
    );
}
