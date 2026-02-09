"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { UserCircle, Settings, LifeBuoy, LogOut, ChevronDown } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    closeDropdown();
  };

  const getAvatarUrl = (url?: string) => {
    if (!url) return "/images/user/owner.jpg";
    if (url.startsWith("http")) return url;
    // Construct full URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
    try {
       const urlObj = new URL(apiUrl);
       return `${urlObj.origin}${url}`;
    } catch {
       return url;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
      >
        <div className="w-10 h-10 overflow-hidden rounded-xl border-2 border-transparent group-hover:border-blue-500/20 transition-all">
          <Image
            width={40}
            height={40}
            src={getAvatarUrl(user?.avatar_url)}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">
            {user?.first_name || "Saurav"}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {user?.role || "Family Owner"}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[280px] rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="px-3 py-4 mb-2 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl">
          <p className="text-sm font-black text-gray-900 dark:text-white">
            {user ? `${user.first_name} ${user.last_name}` : "Saurav Karn"}
          </p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            {user?.email || "saurav@example.com"}
          </p>
        </div>

        <div className="space-y-1">
          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <UserCircle className="w-5 h-5" />
            Edit Profile
          </DropdownItem>
          
          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <Settings className="w-5 h-5" />
            Account Settings
          </DropdownItem>

          <DropdownItem
            onItemClick={closeDropdown}
            tag="a"
            href="/support"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <LifeBuoy className="w-5 h-5" />
            Support Hub
          </DropdownItem>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-bold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
