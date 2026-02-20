"use client";
import React from "react";
import { Calendar, MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { AddContributionForm } from "./AddContributionForm";
import { Modal } from "@/components/ui/modal";
import { goalService } from "@/services/goalService";
import { GoalContribution } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface GoalCardProps {
    title: string;
    target: number;
    current: number;
    deadline: string;
    icon: React.ReactNode;
    color: string;
    barColor: string;
    id?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onContributionSuccess?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
    title,
    target,
    current,
    deadline,
    icon,
    color,
    barColor,
    id,
    onEdit,
    onDelete,
    onContributionSuccess,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContributionModalOpen, setIsContributionModalOpen] =
        useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<GoalContribution[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const fetchHistory = async () => {
        if (!id) return;
        try {
            setIsLoadingHistory(true);
            const data = await goalService.getContributions(id);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const toggleHistory = () => {
        if (!showHistory) {
            fetchHistory();
        }
        setShowHistory(!showHistory);
    };

    const percentage = Math.min(Math.round((current / target) * 100), 100);
    const remaining = Math.max(target - current, 0);

    return (
        <div
            className={`group relative flex h-full flex-col rounded-3xl border border-b-4 border-gray-100 border-b-transparent bg-white p-6 shadow-sm transition-all hover:border-b-current hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${isMenuOpen ? "z-50" : "z-10"}`}
            style={{ borderBottomColor: barColor.replace("bg-", "") }}
        >
            <div className="mb-6 flex items-center justify-between">
                <div
                    className={`rounded-2xl p-4 ${color} shadow-sm transition-transform group-hover:scale-110`}
                >
                    {icon}
                </div>
                <div className="flex items-center gap-2 text-right">
                    <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase dark:bg-gray-800/50">
                        <Calendar className="h-3 w-3" /> {deadline}
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className="dropdown-toggle p-1.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </button>

                        <Dropdown
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            className="w-48 text-left"
                        >
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsContributionModalOpen(true);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-emerald-500" />
                                    <span className="font-bold">
                                        Record Contribution
                                    </span>
                                </div>
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    toggleHistory();
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span>
                                        {showHistory
                                            ? "Hide History"
                                            : "View History"}
                                    </span>
                                </div>
                            </DropdownItem>
                            <div className="my-1 h-px bg-gray-50 dark:bg-gray-800" />
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onEdit?.();
                                }}
                            >
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit Goal</span>
                                </div>
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onDelete?.();
                                }}
                                className="font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete Goal</span>
                                </div>
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex-grow">
                <h4 className="mb-4 line-clamp-1 text-lg font-black text-gray-800 dark:text-white">
                    {title}
                </h4>
                <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                        {formatCurrency(current, "en-IN", "INR")}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                        Target: {formatCurrency(target, "en-IN", "INR")}
                    </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 dark:border-gray-800">
                <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {percentage}% Complete
                </div>
                <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-emerald-500 uppercase dark:bg-emerald-900/20">
                    {formatCurrency(remaining, "en-IN", "INR")} to go
                </div>
            </div>

            {showHistory && (
                <div className="animate-in slide-in-from-top-2 mt-6 border-t border-gray-50 pt-6 duration-300 dark:border-gray-800">
                    <h5 className="mb-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        Contribution History
                    </h5>
                    {isLoadingHistory ? (
                        <div className="space-y-2">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="h-10 animate-pulse rounded-xl bg-gray-50 dark:bg-gray-800"
                                />
                            ))}
                        </div>
                    ) : history.length > 0 ? (
                        <div className="custom-scrollbar max-h-48 space-y-3 overflow-y-auto pr-2">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-3 transition-all hover:border-gray-100 dark:bg-gray-800/50 dark:hover:border-gray-700"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-900 dark:text-white">
                                            {formatCurrency(
                                                item.amount,
                                                "en-IN",
                                                "INR"
                                            )}
                                        </span>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {new Date(
                                                item.contribution_date
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Plus className="h-3 w-3 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[10px] font-medium text-gray-400 italic">
                            No contributions recorded yet.
                        </p>
                    )}
                </div>
            )}

            <Modal
                isOpen={isContributionModalOpen}
                onClose={() => setIsContributionModalOpen(false)}
                className="max-w-md p-8"
            >
                <div className="mb-6">
                    <h3 className="mb-1 text-xl font-black text-gray-800 dark:text-white">
                        Add Contribution here
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Record a new payment towards your goal:{" "}
                        <span className="font-bold text-emerald-600">
                            {title}
                        </span>
                    </p>
                </div>
                <AddContributionForm
                    goalId={id || ""}
                    onSuccess={() => {
                        setIsContributionModalOpen(false);
                        fetchHistory();
                        onContributionSuccess?.();
                    }}
                    onCancel={() => setIsContributionModalOpen(false)}
                />
            </Modal>
        </div>
    );
};
