"use client";
import React, { useEffect, useState } from "react";
import { IncomeList } from "@/components/income/IncomeList";
import { IncomeStats } from "@/components/income/IncomeStats";
import { Plus, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { IncomeForm } from "@/components/income/IncomeForm";
import { BulkImportIncome } from "@/components/income/BulkImportIncome";
import { FileSpreadsheet, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { transactionService } from "@/services/transactionService";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { walletService } from "@/services/walletService";
import { Location, Tag, Transaction, TransactionCategory, WalletInfoType } from "@/types";
import toast from "react-hot-toast";
import { organizationService } from "@/services/organizationService";

export default function IncomePageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;

    const [incomeTypes, setIncomeTypes] = useState<TransactionCategory[]>([]);
    const [wallets, setWallets] = useState<WalletInfoType[]>([]);
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Transaction | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalCount, setTotalCount] = useState(0);

    const openModal = () => {
        setSelectedIncome(null);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedIncome(null);
    };

    const openBulkModal = () => setIsBulkModalOpen(true);
    const closeBulkModal = () => setIsBulkModalOpen(false);

    const handleEdit = (income: Transaction) => {
        setSelectedIncome(income);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setIncomeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!incomeToDelete) return;
        try {
            await transactionService.deleteTransaction(incomeToDelete);
            toast.success("Income record deleted");
            setIncomes(incomes.filter(i => i.id !== incomeToDelete));
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete record");
        }
    };

    const refreshIncomes = async () => {
        if (!familyDetails?.id) return;
        try {
            const response = await transactionService.getTransactions(familyDetails.id, {
                type: 'INCOME',
                page: currentPage,
                page_size: pageSize
            });
            setIncomes(response.transactions);
            setTotalCount(response.total_count);
        } catch (error) {
            console.error('Failed to refresh incomes:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!familyDetails?.id) return;

            setIsLoading(true);
            try {
                const [walletResponse, incomeTypeResponse, response, tagResponse, locationResponse] = await Promise.all([
                    walletService.getWallets(familyDetails.id, 1, 100),
                    transactionCategoryService.getCategories(familyDetails.id, true, 'INCOME'),
                    transactionService.getTransactions(familyDetails.id, {
                        type: 'INCOME',
                        page: currentPage,
                        page_size: pageSize
                    }),
                    organizationService.getTags(familyDetails.id),
                    organizationService.getLocations(familyDetails.id).catch(() => []),
                ]);

                if (isMounted) {
                    setWallets(walletResponse.wallets);
                    setIncomeTypes(incomeTypeResponse);
                    setIncomes(response.transactions);
                    setTotalCount(response.total_count);
                    setTags(tagResponse);
                    setLocations(locationResponse);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Failed to fetch wallets, income types or incomes:', error);
                    toast.error("Failed to load data");
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [familyDetails, currentPage, pageSize]);

    return (
        <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                        Family Income
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Monitor inflows and track your earning sources.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openBulkModal}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
                    >
                        <FileSpreadsheet className="w-5 h-5 text-green-600" /> Import
                    </button>
                    <button
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-500/20"
                    >
                        <Plus className="w-5 h-5" /> Add Income
                    </button>
                </div>
            </div>

            <IncomeStats familyId={familyDetails?.id || ""} />

            {/* Main Table / List Area */}
            <IncomeList
                incomes={incomes}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setCurrentPage}
            />

            {/* Add/Edit Income Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-green-500 w-8 h-8" /> {selectedIncome ? 'Update Income' : 'New Income'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                        {selectedIncome ? 'Modify the details of this income record.' : 'Add a new income source or payment to your records.'}
                    </p>
                </div>
                <IncomeForm
                    onSuccess={() => {
                        closeModal();
                        refreshIncomes();
                    }}
                    onCancel={closeModal}
                    wallets={wallets}
                    incomeTypes={incomeTypes}
                    familyId={familyDetails?.id || ""}
                    income={selectedIncome || undefined}
                    tags={tags}
                    locations={locations}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md p-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Delete Record?</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Are you sure you want to delete this income record? This action cannot be undone and will affect your balance.
                    </p>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Import Modal */}
            <Modal isOpen={isBulkModalOpen} onClose={closeBulkModal} className="max-w-4xl p-10">
                <div className="mb-10">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Bulk Import Income</h3>
                    <p className="text-sm text-gray-500 font-medium">Upload a CSV or Excel file to batch import income records.</p>
                </div>
                <BulkImportIncome onSuccess={closeBulkModal} onCancel={closeBulkModal} />
            </Modal>
        </div>
    );
}
