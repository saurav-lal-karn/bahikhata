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
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [error, setError] = useState<string | null>(null);
  const { lastMessage } = useSocket();

  useEffect(() => {
    if (lastMessage) {
      // Assuming lastMessage is a NotificationType object
      setNotifications((prev) => [lastMessage as NotificationType, ...prev]);
    }
  }, [lastMessage]);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const params: { family_id?: string; status?: "unread" | "read"; limit?: number } = {
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Notifications
          </h1>
          <p className="text-gray-500 font-medium italic">
            Stay updated with your family&apos;s financial activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={markAllRead}
            disabled={isLoading || notifications.length === 0}
            className="rounded-2xl gap-2 font-bold text-xs uppercase px-5 py-2.5 h-auto text-gray-600"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {(["All", "Unread", "Read"] as const).map((label) => {
            const value = label.toLowerCase() as "all" | "unread" | "read";
            const active = statusFilter === value;
            return (
              <button
                key={label}
                onClick={() => setStatusFilter(value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-blue-500">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-3 text-sm font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-24 text-center text-gray-500 font-medium">
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
                className={`group bg-white dark:bg-gray-900/50 border ${
                  isRead
                    ? "border-gray-100 dark:border-gray-800 opacity-80"
                    : "border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-50 dark:ring-blue-900/10 shadow-md shadow-blue-500/5"
                } rounded-3xl p-6 transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3.5 rounded-2xl ${color} group-hover:rotate-12 transition-transform`}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4
                        className={`text-sm font-black ${
                          isRead
                            ? "text-gray-600"
                            : "text-gray-900 dark:text-white"
                        } leading-tight`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isRead
                          ? "text-gray-500"
                          : "text-gray-700 dark:text-gray-300"
                      } font-medium leading-relaxed`}
                    >
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        markOneRead(notification.id, notification.status)
                      }
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title={isRead ? "Mark unread" : "Mark read"}
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300 mb-6">
            <Bell className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">
            No notifications found
          </h4>
          <p className="text-sm text-gray-500 font-medium">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
}
