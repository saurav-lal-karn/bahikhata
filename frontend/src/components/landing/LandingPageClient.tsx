"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    CheckCircle,
    BarChart3,
    Users,
    Shield,
    PieChart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LandingPageClient() {
    const { isAuthenticated, loading } = useAuth();

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/logo/logo-dark.png"
                                alt="Bahikhata Logo"
                                width={180}
                                height={50}
                                className="h-10 w-auto"
                            />
                        </div>
                        <div className="hidden items-center gap-8 font-medium text-gray-400 md:flex">
                            <a
                                href="#features"
                                className="transition-colors hover:text-white"
                            >
                                Features
                            </a>
                            <a
                                href="#about"
                                className="transition-colors hover:text-white"
                            >
                                About
                            </a>
                            {!loading &&
                                (isAuthenticated ? (
                                    <Link
                                        href="/dashboard"
                                        className="transform rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2.5 font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-blue-500 active:scale-95"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/signin"
                                            className="transition-colors hover:text-white"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="transform rounded-full bg-white px-5 py-2.5 font-bold text-gray-950 shadow-xl shadow-white/10 transition-all hover:scale-105 hover:bg-gray-200 active:scale-95"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/landing-hero.png"
                        alt="Hero Background"
                        fill
                        className="object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
                        <span className="flex h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                        <span className="text-sm font-medium text-purple-300">
                            The modern way to track expenses
                        </span>
                    </div>

                    <h1 className="mb-8 text-5xl leading-[1.1] font-black tracking-tight md:text-7xl lg:text-8xl">
                        Your Family's{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic">
                            Financial
                        </span>{" "}
                        Ledger.
                    </h1>

                    <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
                        Take control of your household budget, track shared
                        expenses, and gain insights into your family's financial
                        health with Bahikhata. Simple, shared, and secure.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {!loading &&
                            (isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="group flex w-full transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-blue-500 sm:w-auto"
                                >
                                    Go to Dashboard{" "}
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/signup"
                                        className="group flex w-full transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-bold shadow-2xl shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-blue-500 sm:w-auto"
                                    >
                                        Start Your Ledger{" "}
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href="/dashboard"
                                        className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
                                    >
                                        View Demo
                                    </Link>
                                </>
                            ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative bg-gray-950 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-20 text-center">
                        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                            Everything you need to save
                        </h2>
                        <p className="text-lg text-gray-400">
                            Simple tools to manage complex family finances.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: "Expense Tracking",
                                desc: "Log every penny spent with categories, tags, and notes to stay organized.",
                                icon: (
                                    <PieChart className="h-10 w-10 text-purple-400" />
                                ),
                            },
                            {
                                title: "Family Sync",
                                desc: "Share ledgers with family members and track joint expenses in real-time.",
                                icon: (
                                    <Users className="h-10 w-10 text-blue-400" />
                                ),
                            },
                            {
                                title: "Budget Insights",
                                desc: "Get automated reports and visualizations to understand your spending patterns.",
                                icon: (
                                    <BarChart3 className="h-10 w-10 text-green-400" />
                                ),
                            },
                            {
                                title: "Category Limits",
                                desc: "Set monthly limits for categories and get notified when you're close to exceeding them.",
                                icon: (
                                    <CheckCircle className="h-10 w-10 text-red-400" />
                                ),
                            },
                            {
                                title: "Data Security",
                                desc: "Your financial data is encrypted and secure with modern authentication standards.",
                                icon: (
                                    <Shield className="h-10 w-10 text-yellow-400" />
                                ),
                            },
                            {
                                title: "Export Data",
                                desc: "Download your transaction history in CSV or PDF formats whenever you need it.",
                                icon: (
                                    <ArrowRight className="h-10 w-10 text-pink-400" />
                                ),
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-purple-500/50 hover:bg-white/[0.07]"
                            >
                                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-3 text-2xl font-bold">
                                    {feature.title}
                                </h3>
                                <p className="leading-relaxed text-gray-400">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden py-20">
                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[3rem] border border-white/20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-12 text-center backdrop-blur-xl md:p-20">
                        <h2 className="mb-8 text-4xl font-black md:text-6xl">
                            Ready to master your{" "}
                            <span className="text-blue-400">budget</span>?
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
                            Join thousands of families who use Bahikhata to stay
                            on top of their finances and reach their savings
                            goals faster.
                        </p>
                        {!loading &&
                            (isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="transform rounded-2xl bg-white px-10 py-5 text-xl font-black text-gray-950 shadow-2xl shadow-white/20 transition-all hover:scale-105 hover:bg-gray-200"
                                >
                                    Open Your Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/signup"
                                    className="transform rounded-2xl bg-white px-10 py-5 text-xl font-black text-gray-950 shadow-2xl shadow-white/20 transition-all hover:scale-105 hover:bg-gray-200"
                                >
                                    Start for Free
                                </Link>
                            ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-gray-950 py-12">
                <div className="md:row mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/logo/logo-dark.png"
                            alt="Bahikhata Logo"
                            width={140}
                            height={40}
                            className="h-8 w-auto opacity-80"
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2026 Bahikhata Finance. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-gray-400">
                        <a href="#" className="hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-white">
                            Terms
                        </a>
                        <a href="#" className="hover:text-white">
                            Twitter
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
