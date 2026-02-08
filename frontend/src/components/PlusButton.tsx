"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { UploadDialog } from "./UploadDialog";

export const PlusButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="fixed bottom-24 right-6 z-[9998]">
            <div className="relative group">
                {/* Tooltip */}
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 dark:border-gray-800">
                    Upload & Analyze
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
                </span>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white dark:ring-gray-900 overflow-hidden"
                    title="Upload & Analyze"
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
                </button>
            </div>

            <UploadDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
            />
        </div>
    );
};
