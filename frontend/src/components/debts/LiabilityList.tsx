import { Debt } from "@/types";
import {
    Landmark,
    Calendar,
    Percent,
    MoreVertical,
    Pencil,
    Trash2,
    Plus,
    TrendingDown,
    ListOrdered,
} from "lucide-react";

import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddRepaymentForm } from "./AddRepaymentForm";
import { Modal } from "@/components/ui/modal";
import { debtService } from "@/services/debtService";
import { DebtRepayment } from "@/types";
import { formatCurrency } from "@/lib/utils";

export interface DebtScheduleItem {
    id: string;
    debt_id: string;
    installment_number: number;
    due_date: string;
    principal_amount: number;
    interest_amount: number;
    total_installment: number;
    remaining_balance: number;
    status?: string;
}

interface LiabilityListProps {
    debts?: Debt[];
    isLoading?: boolean;
    onEdit?: (debt: Debt) => void;
    onDelete?: (id: string) => void;
}

export const LiabilityList: React.FC<LiabilityListProps> = ({
    debts = [],
    isLoading = false,
    onEdit,
    onDelete,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [repaymentModalId, setRepaymentModalId] = useState<string | null>(
        null
    );
    const [visibleHistoryId, setVisibleHistoryId] = useState<string | null>(
        null
    );
    const [historyData, setHistoryData] = useState<
        Record<string, DebtRepayment[]>
    >({});
    const [isLoadingHistory, setIsLoadingHistory] = useState<
        Record<string, boolean>
    >({});
    const [visibleScheduleId, setVisibleScheduleId] = useState<string | null>(
        null
    );
    const [scheduleData, setScheduleData] = useState<
        Record<string, DebtScheduleItem[]>
    >({});
    const [isLoadingSchedule, setIsLoadingSchedule] = useState<
        Record<string, boolean>
    >({});

    const fetchRepayments = async (debtId: string) => {
        try {
            setIsLoadingHistory((prev) => ({ ...prev, [debtId]: true }));
            const data = await debtService.getRepayments(debtId);
            setHistoryData((prev) => ({ ...prev, [debtId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingHistory((prev) => ({ ...prev, [debtId]: false }));
        }
    };

    const toggleHistory = (debtId: string) => {
        if (visibleHistoryId === debtId) {
            setVisibleHistoryId(null);
        } else {
            setVisibleHistoryId(debtId);
            if (!historyData[debtId]) {
                fetchRepayments(debtId);
            }
        }
    };

    const fetchSchedule = async (debtId: string) => {
        try {
            setIsLoadingSchedule((prev) => ({ ...prev, [debtId]: true }));
            const data = await debtService.getAmortizationSchedule(debtId);
            setScheduleData((prev) => ({ ...prev, [debtId]: data }));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingSchedule((prev) => ({ ...prev, [debtId]: false }));
        }
    };

    const toggleSchedule = (debtId: string) => {
        if (visibleScheduleId === debtId) {
            setVisibleScheduleId(null);
        } else {
            setVisibleScheduleId(debtId);
            if (!scheduleData[debtId]) {
                fetchSchedule(debtId);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-24 rounded-3xl bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    if (debts.length === 0) {
        return (
            <div className="py-10 text-center font-medium text-gray-500">
                No liabilities recorded yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {debts.map((debt, index) => {
                const isLastItem = index > debts.length - 3;
                return (
                    <div
                        key={debt.id}
                        className={`group relative flex flex-col rounded-3xl border border-gray-100 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 ${activeMenu === debt.id ? "z-50" : ""}`}
                    >
                        <div className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-900/10">
                                    <Landmark className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 capitalize dark:text-white">
                                        {debt.lender}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                            <Percent className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {debt.interest_rate}% Interest
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                            <Calendar className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                Due:{" "}
                                                {new Date(
                                                    debt.due_date
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-right">
                                <div>
                                    <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Outstanding
                                    </p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                                        {formatCurrency(debt.remaining_amount)}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        Total:{" "}
                                        {formatCurrency(debt.total_amount)}
                                    </p>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(
                                                activeMenu === debt.id
                                                    ? null
                                                    : debt.id
                                            );
                                        }}
                                        className="dropdown-toggle p-2 text-gray-400 transition-all hover:text-gray-600 dark:hover:text-white"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    <Dropdown
                                        isOpen={activeMenu === debt.id}
                                        onClose={() => setActiveMenu(null)}
                                        className={`w-48 text-left ${isLastItem ? "bottom-full !mt-0 mb-2 origin-bottom-right" : ""}`}
                                    >
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                toggleHistory(debt.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {visibleHistoryId ===
                                                    debt.id
                                                        ? "Hide History"
                                                        : "View History"}
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                toggleSchedule(debt.id);
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <ListOrdered className="h-4 w-4" />
                                                <span>
                                                    {visibleScheduleId ===
                                                    debt.id
                                                        ? "Hide Schedule"
                                                        : "View Schedule"}
                                                </span>
                                            </div>
                                        </DropdownItem>
                                        <div className="my-1 h-px bg-gray-50 dark:bg-gray-800" />
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onEdit?.(debt);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                                <span>Edit Liability</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={() => {
                                                setActiveMenu(null);
                                                onDelete?.(debt.id);
                                            }}
                                            className="font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete Liability</span>
                                            </div>
                                        </DropdownItem>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        {visibleHistoryId === debt.id && (
                            <div className="animate-in slide-in-from-top-2 px-6 pb-6 duration-300">
                                <div className="border-t border-gray-50 pt-6 dark:border-gray-800">
                                    <h5 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Repayment History
                                    </h5>
                                    {isLoadingHistory[debt.id] ? (
                                        <div className="space-y-2">
                                            {[1, 2].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800"
                                                />
                                            ))}
                                        </div>
                                    ) : historyData[debt.id]?.length ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {historyData[debt.id].map(
                                                (item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-3 transition-all hover:border-gray-100 dark:bg-gray-800/50 dark:hover:border-gray-700"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-gray-900 dark:text-white">
                                                                ₹
                                                                {item.amount.toLocaleString()}
                                                            </span>
                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                {new Date(
                                                                    item.repayment_date
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="py-2 text-center text-[10px] font-medium text-gray-400 italic">
                                            No repayments recorded yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {visibleScheduleId === debt.id && (
                            <div className="animate-in slide-in-from-top-2 px-6 pb-6 duration-300">
                                <div className="border-t border-gray-50 pt-6 dark:border-gray-800">
                                    <h5 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Amortization Schedule
                                    </h5>
                                    {isLoadingSchedule[debt.id] ? (
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800"
                                                />
                                            ))}
                                        </div>
                                    ) : scheduleData[debt.id]?.length ? (
                                        <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                                    <tr>
                                                        <th className="px-4 py-3 font-black tracking-wider text-gray-500 uppercase">
                                                            #
                                                        </th>
                                                        <th className="px-4 py-3 font-black tracking-wider text-gray-500 uppercase">
                                                            Due Date
                                                        </th>
                                                        <th className="px-4 py-3 text-right font-black tracking-wider text-gray-500 uppercase">
                                                            Principal
                                                        </th>
                                                        <th className="px-4 py-3 text-right font-black tracking-wider text-gray-500 uppercase">
                                                            Interest
                                                        </th>
                                                        <th className="px-4 py-3 text-right font-black tracking-wider text-gray-500 uppercase">
                                                            Total
                                                        </th>
                                                        <th className="px-4 py-3 text-right font-black tracking-wider text-gray-500 uppercase">
                                                            Balance
                                                        </th>
                                                        <th className="px-4 py-3 font-black tracking-wider text-gray-500 uppercase">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                    {scheduleData[debt.id].map(
                                                        (row) => (
                                                            <tr
                                                                key={row.id}
                                                                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                                            >
                                                                <td className="px-4 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                                                                    {
                                                                        row.installment_number
                                                                    }
                                                                </td>
                                                                <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">
                                                                    {new Date(
                                                                        row.due_date
                                                                    ).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right font-medium">
                                                                    ₹
                                                                    {Number(
                                                                        row.principal_amount
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right font-medium">
                                                                    ₹
                                                                    {Number(
                                                                        row.interest_amount
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right font-bold text-gray-900 dark:text-white">
                                                                    ₹
                                                                    {Number(
                                                                        row.total_installment
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2.5 text-right text-gray-500">
                                                                    ₹
                                                                    {Number(
                                                                        row.remaining_balance
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-4 py-2.5">
                                                                    <span
                                                                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${row.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 dark:bg-amber-900/20"}`}
                                                                    >
                                                                        {row.status ||
                                                                            "PENDING"}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="py-2 text-center text-[10px] font-medium text-gray-400 italic">
                                            No schedule available. Schedules are
                                            generated when you create them for
                                            this debt.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <Modal
                isOpen={!!repaymentModalId}
                onClose={() => setRepaymentModalId(null)}
                className="max-w-md p-8"
            >
                <div className="mb-6">
                    <h3 className="mb-1 text-xl font-black text-gray-800 dark:text-white">
                        Add Repayment
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Record a partial or full payment of your liability.
                    </p>
                </div>
                {repaymentModalId && (
                    <AddRepaymentForm
                        debtId={repaymentModalId}
                        onSuccess={() => {
                            const id = repaymentModalId;
                            setRepaymentModalId(null);
                            if (id) fetchRepayments(id);
                        }}
                        onCancel={() => setRepaymentModalId(null)}
                    />
                )}
            </Modal>
        </div>
    );
};
