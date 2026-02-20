"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Bell,
    Search,
    CheckCheck,
    Info,
    AlertCircle,
    ShieldAlert,
    RefreshCcw,
    MoreVertical,
    Filter,
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import {
    notificationService,
    Notification as NotificationType,
} from "@/services/notificationService";
import { useSocket } from "@/context/SocketContext";
import { toast } from "react-hot-toast";

function formatTimeAgo(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (sec < 60) return "Just now";
    if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)} hours ago`;
    if (sec < 604800) return `${Math.floor(sec / 86400)} days ago`;
    return d.toLocaleDateString();
}

function getIconAndColor(
    title: string,
    status: string
): { icon: React.ReactNode; color: string } {
    const base = "w-5 h-5";
    const lower = title.toLowerCase();
    if (lower.includes("budget") || lower.includes("alert"))
        return {
            icon: <AlertCircle className={base} />,
            color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
        };
    if (lower.includes("family") || lower.includes("invitation"))
        return {
            icon: <Info className={base} />,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
        };
    if (lower.includes("transaction") || lower.includes("large"))
        return {
            icon: <ShieldAlert className={base} />,
            color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        };
    if (lower.includes("system") || lower.includes("update"))
        return {
            icon: <RefreshCcw className={base} />,
            color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
        };
    return {
        icon: <Bell className={base} />,
        color: "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400",
    };
}

export default function NotificationsPageClient() {
    const { user } = useAuth();
    const familyId = user?.family?.id;
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">(
        "all"
    );
    const [error, setError] = useState<string | null>(null);
    const { lastMessage } = useSocket();

    useEffect(() => {
        if (lastMessage) {
            // Assuming lastMessage is a NotificationType object
            setNotifications((prev) => [
                lastMessage as NotificationType,
                ...prev,
            ]);
        }
    }, [lastMessage]);

    const fetchNotifications = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            const params: {
                family_id?: string;
                status?: "unread" | "read";
                limit?: number;
            } = {
                limit: 100,
            };
            if (familyId) params.family_id = familyId;
            if (statusFilter === "unread") params.status = "unread";
            if (statusFilter === "read") params.status = "read";
            const data = await notificationService.list(params);
            setNotifications(data);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
            setError("Failed to load notifications.");
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [familyId, statusFilter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAllRead = async () => {
        try {
            await notificationService.markAllRead(familyId || undefined);
            await fetchNotifications();
        } catch (e) {
            console.error("Failed to mark all read", e);
        }
    };

    const markOneRead = async (id: string, currentStatus: string) => {
        const next = currentStatus === "read" ? "unread" : "read";
        try {
            await notificationService.markRead(id, next);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, status: next } : n))
            );
        } catch (e) {
            console.error("Failed to update notification", e);
        }
    };

    const filteredNotifications = notifications.filter(
        (n) =>
            n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Notifications
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Stay updated with your family&apos;s financial
                        activities.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={markAllRead}
                        disabled={isLoading || notifications.length === 0}
                        className="h-auto gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-gray-600 uppercase"
                    >
                        <CheckCheck className="h-4 w-4" /> Mark all read
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row dark:border-gray-800 dark:bg-gray-900/50">
                <div className="relative w-full md:w-96">
                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-2.5 pr-4 pl-12 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-800 dark:bg-gray-900/50"
                    />
                </div>
                <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto md:w-auto">
                    {(["All", "Unread", "Read"] as const).map((label) => {
                        const value = label.toLowerCase() as
                            | "all"
                            | "unread"
                            | "read";
                        const active = statusFilter === value;
                        return (
                            <button
                                key={label}
                                onClick={() => setStatusFilter(value)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                                    active
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                    <button className="rounded-xl border border-gray-100 bg-white p-2.5 text-gray-400 hover:text-blue-500 dark:border-gray-800 dark:bg-gray-900">
                        <Filter className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="py-24 text-center font-medium text-gray-500">
                    Loading notifications...
                </div>
            ) : filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                    {filteredNotifications.map((notification) => {
                        const { icon, color } = getIconAndColor(
                            notification.title,
                            notification.status
                        );
                        const isRead = notification.status === "read";
                        return (
                            <div
                                key={notification.id}
                                className={`group border bg-white dark:bg-gray-900/50 ${
                                    isRead
                                        ? "border-gray-100 opacity-80 dark:border-gray-800"
                                        : "border-blue-100 shadow-md ring-1 shadow-blue-500/5 ring-blue-50 dark:border-blue-900/30 dark:ring-blue-900/10"
                                } rounded-3xl p-6 transition-all hover:scale-[1.01]`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`rounded-2xl p-3.5 ${color} transition-transform group-hover:rotate-12`}
                                    >
                                        {icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-start justify-between">
                                            <h4
                                                className={`text-sm font-black ${
                                                    isRead
                                                        ? "text-gray-600"
                                                        : "text-gray-900 dark:text-white"
                                                } leading-tight`}
                                            >
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                {formatTimeAgo(
                                                    notification.created_at
                                                )}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm ${
                                                isRead
                                                    ? "text-gray-500"
                                                    : "text-gray-700 dark:text-gray-300"
                                            } leading-relaxed font-medium`}
                                        >
                                            {notification.message}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 self-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() =>
                                                markOneRead(
                                                    notification.id,
                                                    notification.status
                                                )
                                            }
                                            className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
                                            title={
                                                isRead
                                                    ? "Mark unread"
                                                    : "Mark read"
                                            }
                                        >
                                            <CheckCheck className="h-4 w-4" />
                                        </button>
                                        <button className="rounded-lg p-2 text-gray-400 transition-all hover:text-gray-900 dark:hover:text-white">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300 dark:bg-gray-800">
                        <Bell className="h-10 w-10" />
                    </div>
                    <h4 className="mb-2 text-xl font-black text-gray-800 dark:text-white">
                        No notifications found
                    </h4>
                    <p className="text-sm font-medium text-gray-500">
                        Try adjusting your filters or search term.
                    </p>
                </div>
            )}
        </div>
    );
}
