"use client";
import React from "react";
import { Rocket, Target, Zap, ShieldCheck, TrendingUp, Globe } from "lucide-react";

const roadmapItems = [
    {
        icon: <Zap className="h-8 w-8 text-amber-500" />,
        title: "Smart Budget Forecasting",
        description: "AI-driven end-of-month spending predictions based on your historical patterns. Get alerts before you overspend.",
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-emerald-500" />,
        title: "Investment Portfolio Tracking",
        description: "Monitor your stocks, crypto, and mutual funds in real-time. Holistic view of your net worth growth.",
    },
    {
        icon: <Globe className="h-8 w-8 text-blue-500" />,
        title: "Multi-Currency Support",
        description: "Track international spending and assets with real-time exchange rate conversions and dual-currency ledgers.",
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
        title: "Advanced Anomaly Detection",
        description: "Security first! Be alerted to unexpected subscription price hikes, double charges, and suspicious outflows.",
    },
    {
        icon: <Target className="h-8 w-8 text-rose-500" />,
        title: "Inter-Account Transfers",
        description: "Sophisticated logic for moving money between wallets, bank accounts, and debts with full audit trails.",
    },
    {
        icon: <Rocket className="h-8 w-8 text-brand-500" />,
        title: "Tax Center",
        description: "Generate tax-ready reports and auto-categorize deductible expenses for easy filing.",
    },
];

export default function V2Roadmap() {
    return (
        <div className="mx-auto max-w-5xl py-12">
            <div className="mb-16 text-center">
                <div className="mb-4 inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-xs font-black tracking-widest text-brand-600 uppercase dark:bg-brand-900/30 dark:text-brand-400">
                    Coming Soon
                </div>
                <h1 className="mb-6 text-4xl font-black text-gray-900 md:text-5xl dark:text-white">
                    Bahikhata v2 Roadmap
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                    We're building the future of personal finance. While the MVP handles your daily essentials, v2 will bring intelligence and automation to your wealth management.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {roadmapItems.map((item, index) => (
                    <div
                        key={index}
                        className="group relative rounded-3xl border border-gray-200 bg-white p-8 transition-all hover:scale-105 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="mb-6 inline-flex rounded-2xl bg-gray-50 p-4 transition-colors group-hover:bg-white dark:bg-gray-800/50 dark:group-hover:bg-gray-800">
                            {item.icon}
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-20 rounded-4xl bg-gradient-to-br from-gray-900 to-black p-12 text-center text-white dark:from-brand-600 dark:to-brand-800">
                <h2 className="mb-4 text-3xl font-black">Stay Tuned for v2!</h2>
                <p className="mb-8 text-gray-300">
                    The MVP is just the beginning. We appreciate your feedback as we build these advanced features.
                </p>
                <div className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                    Target Release: Q3 2026
                </div>
            </div>
        </div>
    );
}
