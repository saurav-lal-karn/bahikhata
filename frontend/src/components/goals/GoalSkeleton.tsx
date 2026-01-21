import React from "react";

export const GoalSkeleton = () => {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-full animate-pulse">
        <div className="flex items-center justify-between mb-6">
          {/* Icon Skeleton */}
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
          
          {/* Date Skeleton */}
          <div className="w-20 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        </div>
  
        <div className="flex-grow mb-6">
          {/* Title Skeleton */}
          <div className="h-6 w-3/4 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
          
          <div className="flex justify-between items-baseline mb-2">
             {/* Current Amount Skeleton */}
             <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
             {/* Target Amount Skeleton */}
             <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          
          {/* Progress Bar Skeleton */}
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
  
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
           {/* Percentage Skeleton */}
           <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
           {/* Remaining Amount Badge Skeleton */}
           <div className="h-6 w-24 bg-gray-100 dark:bg-gray-800 rounded-full" />
        </div>
      </div>
    );
};
