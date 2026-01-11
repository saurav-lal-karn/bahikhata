"use client";
import React, { useState } from "react";
import { 
  Target, 
  Plus, 
  ShieldCheck, 
  PieChart, 
  TrendingUp,
  Landmark,
  Coins,
  ArrowRight
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalForm } from "@/components/goals/AddGoalForm";
import { EmergencyFundCalculator } from "@/components/goals/EmergencyFundCalculator";
import { DiversityAnalysis } from "@/components/goals/DiversityAnalysis";

export default function GoalsPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Wealth & Goals
          </h1>
          <p className="text-gray-500 font-medium italic">
            Save for your dreams and ensure your family's financial security.
          </p>
        </div>
        <button 
          onClick={openModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> New Savings Goal
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Goals List (8/12) */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
              <Target className="text-emerald-500 w-6 h-6" /> Active Target Goals
            </h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              4 Goals in Progress
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GoalCard 
              title="Car Fund (SUV 2026)" 
              target={1500000} 
              current={450000} 
              deadline="Dec 2026"
              icon={<TrendingUp className="w-5 h-5" />}
              color="bg-blue-50 text-blue-600"
              barColor="bg-blue-500"
            />
            <GoalCard 
              title="European Vacation" 
              target={500000} 
              current={380000} 
              deadline="May 2026"
              icon={<Plus className="w-5 h-5 text-purple-600 transition-transform group-hover:rotate-45" />}
              color="bg-purple-50 text-purple-600"
              barColor="bg-purple-500"
            />
            <GoalCard 
              title="Home Renovation" 
              target={800000} 
              current={120000} 
              deadline="Sep 2027"
              icon={<Landmark className="w-5 h-5" />}
              color="bg-amber-50 text-amber-600"
              barColor="bg-amber-500"
            />
             <GoalCard 
              title="Retirement Corpus" 
              target={5000000} 
              current={1250000} 
              deadline="2045"
              icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
              color="bg-emerald-50 text-emerald-600"
              barColor="bg-emerald-500"
            />
          </div>
        </div>

        {/* Right: Wealth Tools (4/12) */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
           <EmergencyFundCalculator />
           <DiversityAnalysis />
           
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden relative group cursor-pointer hover:border-emerald-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-2xl">
                    <Coins className="w-6 h-6" />
                 </div>
                 <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="text-lg font-black text-gray-800 dark:text-white mb-1">Financial Health</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Your current savings rate is 22% higher than last month. Keep it up!
              </p>
           </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Create Savings Goal</h3>
          <p className="text-sm text-gray-500 font-medium">Set a target for your next big milestone and track progress monthly.</p>
        </div>
        <AddGoalForm onSuccess={closeModal} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
