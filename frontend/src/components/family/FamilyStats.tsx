"use client";
import React, { useEffect, useState } from "react";
import { Users, UserPlus, Shield, Activity } from "lucide-react";
import { familyService } from "@/services/familyService";

export const FamilyStats = ({ familyId }: { familyId: string }) => {
    const [stats, setStats] = useState({
        total_members: 0,
        total_administrators: 0,
        total_active_now: 0,
        total_pending_invites: 0,
        total_amount: 0,
        total_ledgers: 0,
        total_users: 0,
        total_transactions: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const response = await familyService.getFamilyStats(familyId);
            setStats(response);
        };
        if (familyId && familyId !== "") {
            fetchStats();
        }

        return () => {
            fetchStats();
        };
    }, [familyId]);

    const statsList = [
        {
            title: "Total Members",
            value: stats.total_members,
            subtitle: "Full household",
            icon: <Users className="h-6 w-6" />,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            title: "Active Now",
            value: stats.total_users - stats.total_pending_invites,
            subtitle: "Online today",
            icon: <Activity className="h-6 w-6" />,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20",
        },
        {
            title: "Administrators",
            value: stats.total_administrators,
            subtitle: "Family owner",
            icon: <Shield className="h-6 w-6" />,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-900/20",
        },
        {
            title: "Pending Invites",
            value: stats.total_pending_invites,
            subtitle: "All clear",
            icon: <UserPlus className="h-6 w-6" />,
            color: "text-gray-600 dark:text-gray-400",
            bg: "bg-gray-100 dark:bg-gray-800",
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {statsList.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <div
                            className={`rounded-2xl p-3 ${stat.bg} ${stat.color}`}
                        >
                            {stat.icon}
                        </div>
                    </div>
                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            {stat.title}
                        </p>
                        <h4 className="text-2xl leading-none font-black text-gray-900 dark:text-white">
                            {stat.value}
                        </h4>
                        <p className="mt-2 text-xs font-medium text-gray-400">
                            {stat.subtitle}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
