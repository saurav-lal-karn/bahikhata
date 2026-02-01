"use client";
import React from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, ReportData } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

export const FinancialHealthScore = () => {
  const { user } = useAuth();
  const familyId = user?.family?.id;
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (familyId) {
      analyticsService.getReportData(familyId)
        .then(setData)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [familyId]);

  if (isLoading) return <div className="h-48 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-[2rem]" />;

  const score = data?.health_score ?? 0;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-lg shadow-indigo-500/20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold">Financial Health</h3>
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-6xl font-black mb-2">{score}</h2>
          <p className="text-white/60 text-sm font-medium">Out of 100 points</p>
        </div>
        <div className="text-right">
          <span className="px-4 py-2 bg-emerald-500 rounded-full text-xs font-black uppercase tracking-widest">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-white/60 font-medium">Your score is calculated based on savings rate, debt-to-income ratio, and consistency.</p>
      </div>

      <button className="w-full mt-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors group">
        Improve Score <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
