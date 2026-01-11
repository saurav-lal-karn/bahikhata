"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, BarChart3, Users, Shield, PieChart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo-dark.png"
                alt="Bahikhata Logo"
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center gap-8 text-gray-400 font-medium">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#about" className="hover:text-white transition-colors">About</a>
              {!loading && (
                isAuthenticated ? (
                  <Link 
                    href="/dashboard" 
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/signin" className="hover:text-white transition-colors">Sign In</Link>
                    <Link 
                      href="/signup" 
                      className="px-5 py-2.5 bg-white text-gray-950 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
                    >
                      Get Started
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden lg:pt-48 lg:pb-32">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-300">The modern way to track expenses</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Your Family's <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic">Financial</span> Ledger.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            Take control of your household budget, track shared expenses, and gain insights into your family's financial health with Bahikhata. Simple, shared, and secure.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!loading && (
              isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/20 flex items-center justify-center gap-2 group"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link 
                    href="/signup" 
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/20 flex items-center justify-center gap-2 group"
                  >
                    Start Your Ledger <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center"
                  >
                    View Demo
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need to save</h2>
            <p className="text-gray-400 text-lg">Simple tools to manage complex family finances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expense Tracking",
                desc: "Log every penny spent with categories, tags, and notes to stay organized.",
                icon: <PieChart className="w-10 h-10 text-purple-400" />
              },
              {
                title: "Family Sync",
                desc: "Share ledgers with family members and track joint expenses in real-time.",
                icon: <Users className="w-10 h-10 text-blue-400" />
              },
              {
                title: "Budget Insights",
                desc: "Get automated reports and visualizations to understand your spending patterns.",
                icon: <BarChart3 className="w-10 h-10 text-green-400" />
              },
              {
                title: "Category Limits",
                desc: "Set monthly limits for categories and get notified when you're close to exceeding them.",
                icon: <CheckCircle className="w-10 h-10 text-red-400" />
              },
              {
                title: "Data Security",
                desc: "Your financial data is encrypted and secure with modern authentication standards.",
                icon: <Shield className="w-10 h-10 text-yellow-400" />
              },
              {
                title: "Export Data",
                desc: "Download your transaction history in CSV or PDF formats whenever you need it.",
                icon: <ArrowRight className="w-10 h-10 text-pink-400" />
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:bg-white/[0.07] group"
              >
                <div className="mb-6 transform transition-transform group-hover:scale-110 duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/20 backdrop-blur-xl text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to master your <span className="text-blue-400">budget</span>?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of families who use Bahikhata to stay on top of their finances and reach their savings goals faster.
            </p>
            {!loading && (
              isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="px-10 py-5 bg-white text-gray-950 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-2xl shadow-white/20"
                >
                  Open Your Dashboard
                </Link>
              ) : (
                <Link 
                  href="/signup" 
                  className="px-10 py-5 bg-white text-gray-950 rounded-2xl font-black text-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-2xl shadow-white/20"
                >
                  Start for Free
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo/logo-dark.png"
              alt="Bahikhata Logo"
              width={140}
              height={40}
              className="h-8 w-auto opacity-80"
            />
          </div>
          <p className="text-gray-500 text-sm">© 2026 Bahikhata Finance. All rights reserved.</p>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
