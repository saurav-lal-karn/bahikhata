"use client";
import React from "react";
import { ReportsStats } from "@/components/reports/ReportsStats";
import { SpendingInsights } from "@/components/reports/SpendingInsights";
import { 
  Calendar, 
  Download, 
  Filter, 
  Presentation,
  FileText,
  Clock
} from "lucide-react";
import Button from "@/components/ui/button/Button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Financial Analytics
          </h1>
          <p className="text-gray-500 font-medium">
            Deep dive into your household's financial health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center gap-3 shadow-sm">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">May 2026</span>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
            <Download className="w-5 h-5" /> Export Report
          </button>
        </div>
      </div>

      <ReportsStats />
      
      <SpendingInsights />

      {/* Recent Summaries */}
      <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-blue-500" /> Monthly Summaries
          </h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">View All Archives</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50 dark:divide-gray-800">
          {[
            { month: 'April 2026', type: 'Complete', size: '1.2 MB' },
            { month: 'March 2026', type: 'Complete', size: '1.5 MB' },
            { month: 'February 2026', type: 'Archive', size: '2.1 MB' },
          ].map((report, i) => (
            <div key={i} className="p-8 group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl group-hover:rotate-12 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-800 dark:text-white">{report.month} Report</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.type}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">•</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{report.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-blue-600">
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Generated 2d ago</span>
                <Download className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
