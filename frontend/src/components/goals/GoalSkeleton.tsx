import React from "react";

export const GoalSkeleton = () => {
    return (
        <div className="flex h-full animate-pulse flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
                {/* Icon Skeleton */}
                <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />

                {/* Date Skeleton */}
                <div className="h-6 w-20 rounded-lg bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="mb-6 flex-grow">
                {/* Title Skeleton */}
                <div className="mb-4 h-6 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />

                <div className="mb-2 flex items-baseline justify-between">
                    {/* Current Amount Skeleton */}
                    <div className="h-8 w-24 rounded bg-gray-100 dark:bg-gray-800" />
                    {/* Target Amount Skeleton */}
                    <div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800" />
                </div>

                {/* Progress Bar Skeleton */}
                <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 dark:border-gray-800">
                {/* Percentage Skeleton */}
                <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                {/* Remaining Amount Badge Skeleton */}
                <div className="h-6 w-24 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
        </div>
    );
};
