import React from "react";

export const BudgetSkeleton = () => {
    return (
        <div className="group animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 w-12 h-12" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                        <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-10 bg-gray-100 dark:bg-gray-800 rounded ml-auto" />
                    <div className="h-5 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
            </div>

            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-2" />

            <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
        </div>
    );
};
