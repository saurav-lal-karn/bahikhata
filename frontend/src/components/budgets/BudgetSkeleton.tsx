import React from "react";

export const BudgetSkeleton = () => {
    return (
        <div className="group animate-pulse">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 p-3 dark:bg-gray-800" />
                    <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-gray-100 dark:bg-gray-800" />
                        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="ml-auto h-3 w-10 rounded bg-gray-100 dark:bg-gray-800" />
                    <div className="h-5 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                </div>
            </div>

            <div className="mb-2 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800" />

            <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
};
