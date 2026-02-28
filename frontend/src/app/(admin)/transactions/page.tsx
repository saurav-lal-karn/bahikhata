"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Activity, analyticsService } from "@/services/analyticsService";
import {
    ShoppingCart,
    Home,
    Car,
    Utensils,
    Zap,
    TrendingDown,
    Target,
    Landmark,
    ChevronLeft,
    ChevronRight,
    Search,
    View,
} from "lucide-react";
import Link from "next/link";

const getIcon = (type: string, category: any) => {
    const className = "w-5 h-5";
    const categoryName = typeof category === "string" ? category : (category as any)?.name || "";
    const cat = categoryName.toLowerCase();

    if (type === "INCOME" || type === "income")
        return {
            icon: <Zap className={className} />,
            bg: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
        };
    if (type === "contribution")
        return {
            icon: <Target className={className} />,
            bg: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        };
    if (type === "repayment")
        return {
            icon: <TrendingDown className={className} />,
            bg: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
        };
    if (type === "investment_transaction")
        return {
            icon: <Landmark className={className} />,
            bg: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
        };

    if (cat.includes("food"))
        return {
            icon: <Utensils className={className} />,
            bg: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
        };
    if (cat.includes("house") || cat.includes("rent"))
        return {
            icon: <Home className={className} />,
            bg: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
        };
    if (cat.includes("car") || cat.includes("transport"))
        return {
            icon: <Car className={className} />,
            bg: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
        };

    return {
        icon: <ShoppingCart className={className} />,
        bg: "bg-gray-100 dark:bg-gray-800 text-gray-600",
    };
};

export default function TransactionsPage() {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(15);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (familyId) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                analyticsService
                    .getTransactions(familyId, page, pageSize, { search })
                    .then((data) => {
                        setActivities(data.transactions);
                        setTotalItems(data.total_count);
                    })
                    .catch(console.error)
                    .finally(() => setIsLoading(false));
            }, 500); // 500ms debounce

            return () => clearTimeout(timer);
        }
    }, [familyId, page, pageSize, search]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        Activity History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Detailed list of all your family's transactions and updates
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group grayscale focus-within:grayscale-0 transition-all">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                            className="rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-50 dark:bg-gray-800" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pr-4 pb-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Activity
                                    </th>
                                    <th className="px-4 pb-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-4 pb-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-4 pb-4 text-right text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Amount
                                    </th>
                                    <th className="px-4 pb-4 text-right text-xs font-black tracking-widest text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {activities.map((activity) => {
                                    const style = getIcon(activity.type, activity.category);
                                    return (
                                        <tr key={activity.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                            <td className="py-4 pr-4">
                                                <Link href={`/transactions/${activity.id}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.bg} transition-transform group-hover:scale-110`}>
                                                            {style.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="mb-0.5 text-sm font-bold text-gray-900 dark:text-white">
                                                                {activity.title}
                                                            </h4>
                                                            <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                                                {activity.type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {typeof activity.category === "string"
                                                    ? activity.category
                                                    : (activity.category as any)?.name || "General"}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                {new Date(
                                                    activity.transaction_date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className={`px-4 py-4 text-right text-sm font-black ${activity.type === "INCOME" ? "text-emerald-500" : "text-gray-900 dark:text-white"}`}>
                                                {activity.type === "INCOME" ? "+" : "-"}₹{activity.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href={`/transactions/${activity.id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-brand-500 hover:text-brand-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-brand-400 dark:hover:text-brand-400"
                                                >
                                                    <View className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {activities.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="font-bold text-gray-400">No activities found.</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Showing <span className="text-gray-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to{" "}
                                    <span className="text-gray-900 dark:text-white">
                                        {Math.min(page * pageSize, totalItems)}
                                    </span>{" "}
                                    of <span className="text-gray-900 dark:text-white">{totalItems}</span> results
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-30 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
