"use client";
import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  Trash2, 
  CheckCheck, 
  Info, 
  AlertCircle, 
  ShieldAlert, 
  RefreshCcw,
  MoreVertical,
  Filter
} from "lucide-react";
import Button from "@/components/ui/button/Button";

const initialNotifications = [
  {
    id: "1",
    title: "Budget Alert",
    message: "You have spent 92% of your 'Groceries' budget for May.",
    time: "2 hours ago",
    type: "warning",
    isRead: false,
    icon: <AlertCircle className="w-5 h-5" />,
    color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
  },
  {
    id: "2",
    title: "Family Invitation",
    message: "Aakash Lalkarn has joined the family group.",
    time: "5 hours ago",
    type: "info",
    isRead: false,
    icon: <Info className="w-5 h-5" />,
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
  },
  {
    id: "3",
    title: "Large Transaction",
    message: "A single transaction of ₹25,000 was recorded by Saurav.",
    time: "1 day ago",
    type: "critical",
    isRead: true,
    icon: <ShieldAlert className="w-5 h-5" />,
    color: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  },
  {
    id: "4",
    title: "System Update",
    message: "Bahikhata v2.1 is now live with enhanced OCR features.",
    time: "2 days ago",
    type: "system",
    isRead: true,
    icon: <RefreshCcw className="w-5 h-5" />,
    color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
  }
];

export default function NotificationsPageClient() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Notifications
          </h1>
          <p className="text-gray-500 font-medium italic">
            Stay updated with your family's financial activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={markAllRead}
            className="rounded-2xl gap-2 font-bold text-xs uppercase px-5 py-2.5 h-auto text-gray-600"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
          <Button 
            className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl gap-2 font-bold text-xs uppercase px-5 py-2.5 h-auto"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Toolbar */}
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
          {['All', 'Alerts', 'System', 'Family'].map((filter) => (
            <button key={filter} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === 'All' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 hover:bg-gray-50'}`}>
              {filter}
            </button>
          ))}
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-blue-500">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`group bg-white dark:bg-gray-900/50 border ${notification.isRead ? 'border-gray-100 dark:border-gray-800 opacity-80' : 'border-blue-100 dark:border-blue-900/30 ring-1 ring-blue-50 dark:ring-blue-900/10 shadow-md shadow-blue-500/5'} rounded-3xl p-6 transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl ${notification.color} group-hover:rotate-12 transition-transform`}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`text-sm font-black ${notification.isRead ? 'text-gray-600' : 'text-gray-900 dark:text-white'} leading-tight`}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{notification.time}</span>
                  </div>
                  <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'} font-medium leading-relaxed`}>
                    {notification.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300 mb-6">
              <Bell className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">No notifications found</h4>
            <p className="text-sm text-gray-500 font-medium">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
