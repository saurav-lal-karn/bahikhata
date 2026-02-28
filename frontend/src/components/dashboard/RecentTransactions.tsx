"use client";
import React from "react";
import {
    ShoppingCart,
    Home,
    Car,
    Utensils,
    Zap,
    TrendingDown,
    Target,
    Landmark,
    View,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsService, Activity } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

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

export const RecentTransactions = () => {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (familyId) {
            analyticsService
                .getDashboardSummary(familyId)
                .then((data) => setActivities(data.recent_activity))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [familyId]);

    if (isLoading)
        return (
            <div className="h-64 animate-pulse rounded-2xl bg-gray-50 dark:bg-gray-800" />
        );

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
                    Latest Activity
                </h3>
                <Link
                    href="/transactions"
                    className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="pr-4 pb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Activity
                            </th>
                            <th className="px-4 pb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Category
                            </th>
                            <th className="px-4 pb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-4 pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Amount
                            </th>
                            <th className="px-4 pb-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {activities.map((activity) => {
                            const style = getIcon(
                                activity.type,
                                activity.category
                            );
                            return (
                                <tr key={activity.id} className="group">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}
                                            >
                                                {style.icon}
                                            </div>
                                            <div>
                                                <h4 className="mb-1 text-sm leading-none font-bold text-gray-800 dark:text-white/90">
                                                    {activity.title}
                                                </h4>
                                                <p
                                                    className={`text-[10px] font-black tracking-widest text-gray-400 uppercase`}
                                                >
                                                    {activity.type}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {typeof activity.category === "string"
                                            ? activity.category
                                            : (activity.category as any)?.name || "General"}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(
                                            activity.date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`px-4 py-4 text-right text-sm font-bold ${activity.type === "INCOME" ? "text-green-500" : "text-gray-800 dark:text-white/90"}`}
                                    >
                                        {activity.type === "INCOME" ? "+" : "-"}
                                        ₹{activity.amount.toLocaleString()}
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
                    <div className="py-10 text-center font-medium text-gray-400">
                        No recent activities found.
                    </div>
                )}
            </div>
        </div>
    );
};
