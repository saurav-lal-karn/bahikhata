"use client";
import React, { useState, useEffect } from "react";
import {
    Target,
    Plus,
    ShieldCheck,
    PieChart,
    TrendingUp,
    Coins,
    ArrowRight,
    Filter,
    Search,
    ChevronDown,
    AlertTriangle,
    RotateCw,
} from "lucide-react";

import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalForm } from "@/components/goals/AddGoalForm";
import { EmergencyFundCalculator } from "@/components/goals/EmergencyFundCalculator";
import { DiversityAnalysis } from "@/components/goals/DiversityAnalysis";
import { useAuth } from "@/context/AuthContext";
import { goalService } from "@/services/goalService";
import { Goal } from "@/types";
import { GoalSkeleton } from "@/components/goals/GoalSkeleton";
import {
    Home,
    Plane,
    ShoppingBag,
    ShieldCheck as Shield,
    Target as TargetIcon,
    Landmark as LandmarkIcon,
} from "lucide-react";

const getGoalIcon = (iconName: string) => {
    const className = "w-5 h-5";
    switch (iconName) {
        case "home":
            return <LandmarkIcon className={className} />;
        case "travel":
            return <Plane className={className} />;
        case "shopping":
            return <ShoppingBag className={className} />;
        case "security":
            return <Shield className={className} />;
        case "wealth":
            return <TargetIcon className={className} />;
        case "asset":
            return <Home className={className} />;
        default:
            return <TargetIcon className={className} />;
    }
};

const getGoalColors = (iconName: string) => {
    switch (iconName) {
        case "home":
            return {
                color: "bg-blue-50 text-blue-600",
                barColor: "bg-blue-500",
            };
        case "travel":
            return {
                color: "bg-purple-50 text-purple-600",
                barColor: "bg-purple-500",
            };
        case "shopping":
            return {
                color: "bg-pink-50 text-pink-600",
                barColor: "bg-pink-500",
            };
        case "security":
            return {
                color: "bg-emerald-50 text-emerald-600",
                barColor: "bg-emerald-500",
            };
        case "wealth":
            return {
                color: "bg-amber-50 text-amber-600",
                barColor: "bg-amber-500",
            };
        case "asset":
            return {
                color: "bg-indigo-50 text-indigo-600",
                barColor: "bg-indigo-500",
            };
        default:
            return {
                color: "bg-gray-50 text-gray-600",
                barColor: "bg-gray-500",
            };
    }
};

export default function GoalsPageClient() {
    const { user } = useAuth();
    const familyId = user?.family?.id || "";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Edit & Delete State
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
    const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Extract unique goal icons as categories for now
    const goalCategories = Array.from(
        new Set(goals.map((g) => g.icon_name).filter(Boolean))
    ) as string[];

    const filteredGoals = goals.filter((goal) => {
        const matchesSearch = goal.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            !selectedCategory || goal.icon_name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const fetchGoals = async () => {
        if (!familyId) return;
        try {
            setIsLoading(true);
            const data = await goalService.getGoals(familyId);
            setGoals(data);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [familyId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGoal(null);
        fetchGoals(); // Refresh list after adding
    };

    const handleEditGoal = (goal: Goal) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleDeleteGoal = (goal: Goal) => {
        setDeletingGoal(goal);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingGoal) return;
        try {
            setIsDeleting(true);
            await goalService.deleteGoal(deletingGoal.id);
            toast.success("Goal deleted successfully");
            setIsDeleteModalOpen(false);
            fetchGoals();
        } catch (error) {
            console.error("Failed to delete goal:", error);
            toast.error("Failed to delete goal");
        } finally {
            setIsDeleting(false);
            setDeletingGoal(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Wealth & Goals
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Save for your dreams and ensure your family's financial
                        security.
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:from-emerald-500 hover:to-teal-500 active:scale-95"
                >
                    <Plus className="h-5 w-5" /> New Savings Goal
                </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left: Goals List (8/12) */}
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <h3 className="flex items-center gap-2 text-xl font-black text-gray-800 dark:text-white">
                                <Target className="h-6 w-6 text-emerald-500" />{" "}
                                Active Target Goals
                            </h3>
                            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black tracking-widest text-gray-400 uppercase sm:inline-block dark:bg-gray-800">
                                {filteredGoals.length} Goals in Progress
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="group relative isolate">
                                <div
                                    className={`absolute inset-0 bg-emerald-500/10 blur-xl transition-opacity duration-500 ${isFilterVisible ? "opacity-100" : "opacity-0"}`}
                                />
                                <button
                                    onClick={() =>
                                        setIsFilterVisible(!isFilterVisible)
                                    }
                                    className={`relative rounded-xl border p-2.5 transition-all ${isFilterVisible ? "border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm" : "border-gray-100 bg-white text-gray-400 hover:text-gray-600 dark:border-gray-800 dark:bg-gray-900"}`}
                                >
                                    <Filter className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    {isFilterVisible && (
                        <div className="animate-in slide-in-from-top-4 space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Goal Name
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            placeholder="e.g. Dream House..."
                                            className="w-full rounded-2xl border border-transparent bg-gray-50 py-2.5 pr-4 pl-11 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedCategory || ""}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value || null
                                                )
                                            }
                                            className="w-full appearance-none rounded-2xl border border-transparent bg-gray-50 py-2.5 pr-10 pl-4 text-sm font-bold capitalize transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800/50"
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {goalCategories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory(null);
                                        }}
                                        className="w-full rounded-2xl bg-gray-100 py-2.5 text-xs font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {isLoading ? (
                            // Skeletons
                            Array(4)
                                .fill(0)
                                .map((_, i) => <GoalSkeleton key={i} />)
                        ) : filteredGoals.length > 0 ? (
                            filteredGoals.map((goal) => {
                                const { color, barColor } = getGoalColors(
                                    goal.icon_name
                                );
                                return (
                                    <GoalCard
                                        key={goal.id}
                                        id={goal.id}
                                        title={goal.name}
                                        target={goal.target_amount}
                                        current={goal.current_amount}
                                        deadline={new Date(
                                            goal.deadline
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        })}
                                        icon={getGoalIcon(goal.icon_name)}
                                        color={color}
                                        barColor={barColor}
                                        onContributionSuccess={fetchGoals}
                                        onEdit={() => handleEditGoal(goal)}
                                        onDelete={() => handleDeleteGoal(goal)}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center md:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                                <Target className="mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                    No Goals Yet
                                </h3>
                                <p className="mb-6 text-gray-500">
                                    Start saving for your dreams today.
                                </p>
                                <button
                                    onClick={openModal}
                                    className="rounded-xl bg-emerald-600 px-6 py-2 font-bold text-white transition-colors hover:bg-emerald-500"
                                >
                                    Create Your First Goal
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Wealth Tools (4/12) */}
                <div className="col-span-12 space-y-8 xl:col-span-4">
                    <EmergencyFundCalculator />
                    <DiversityAnalysis />

                    <div className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 dark:border-gray-800 dark:bg-gray-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <Coins className="h-6 w-6" />
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-emerald-500" />
                        </div>
                        <h4 className="mb-1 text-lg font-black text-gray-800 dark:text-white">
                            Financial Health
                        </h4>
                        <p className="text-xs leading-relaxed font-medium text-gray-500">
                            Your current savings rate is 22% higher than last
                            month. Keep it up!
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingGoal
                            ? "Edit Savings Goal"
                            : "Create Savings Goal"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingGoal
                            ? "Update your goal details below."
                            : "Set a target for your next big milestone and track progress monthly."}
                    </p>
                </div>
                <AddGoalForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    familyId={familyId}
                    initialData={editingGoal}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="max-w-md p-8"
            >
                <div className="flex flex-col items-center space-y-6 text-center">
                    <div className="rounded-full bg-red-50 p-4 text-red-500">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            Delete Goal?
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-gray-800 dark:text-white">
                                "{deletingGoal?.name}"
                            </span>
                            ? This action cannot be undone and all associated
                            contributions history will be lost.
                        </p>
                    </div>

                    <div className="flex w-full items-center gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 rounded-2xl bg-gray-100 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 font-bold text-white transition-colors hover:bg-red-600"
                        >
                            {isDeleting ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                            ) : null}
                            {isDeleting ? "Deleting..." : "Delete Goal"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
