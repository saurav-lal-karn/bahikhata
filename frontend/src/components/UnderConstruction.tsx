"use client";
import React from "react";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UnderConstructionProps {
    featureName: string;
    description?: string;
}

export const UnderConstruction: React.FC<UnderConstructionProps> = ({
    featureName,
    description,
}) => {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 rounded-full bg-amber-100 p-6 dark:bg-amber-900/30">
                <Construction className="h-16 w-16 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="mb-4 text-3xl font-black text-gray-900 dark:text-white">
                {featureName} is Under Development
            </h1>
            <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                {description ||
                    "This feature is part of our v2 roadmap and is currently being built. We're working hard to bring you the best experience!"}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <Link
                    href="/v2-roadmap"
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-bold text-gray-900 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                >
                    View v2 Roadmap
                </Link>
            </div>
        </div>
    );
};
