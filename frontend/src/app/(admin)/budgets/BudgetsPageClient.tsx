"use client";
import React, { useEffect, useState } from "react";
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  History, 
  Plus, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronDown
} from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { BudgetList } from "@/components/budgets/BudgetList";
import { AddBudgetForm } from "@/components/budgets/AddBudgetForm";
import { PredictiveBudgetPanel } from "@/components/budgets/PredictiveBudgetPanel";
import { useAuth } from "@/context/AuthContext";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { budgetService } from "@/services/budgetService";
import type { BudgetAlert } from "@/services/budgetService";
import { ExpenseCategory, Budget } from "@/types";
import { AlertCircle, CheckCheck } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";

export default function BudgetsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;
    
  const [activeTab, setActiveTab] = useState<"active" | "suggestions" | "archives">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date());

  const navigateMonth = (direction: 'prev' | 'next') => {
    setActiveDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(activeDate);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Refresh budgets
    if (familyDetails?.id) {
        budgetService.getBudgets(familyDetails.id).then(setBudgets);
    }
  };

  // Month Picker Logic
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setPickerYear(activeDate.getFullYear());
  }, [activeDate]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(activeDate);
    newDate.setFullYear(pickerYear);
    newDate.setMonth(monthIndex);
    setActiveDate(newDate);
    setIsMonthPickerOpen(false);
  };


  useEffect(() => {
      let isMounted = true;
  
      const fetchData = async () => {
        if (!familyDetails?.id) return;
  
        try {
          setIsLoading(true);
          const [categoriesResponse, budgetsResponse] = await Promise.all([
            transactionCategoryService.getCategories(familyDetails.id, true, 'EXPENSE'),
            budgetService.getBudgets(familyDetails.id)
          ]);
  
          if (isMounted) {
            setCategories(categoriesResponse);
            setBudgets(budgetsResponse);
          }
          budgetService.getAlerts(familyDetails.id).then((data) => isMounted && setAlerts(data)).catch(() => isMounted && setAlerts([]));
        } catch (error) {
          if (isMounted) {
            console.error('Failed to fetch data:', error);
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };
  
      fetchData();
  
      return () => {
        isMounted = false;
      };
    }, [familyDetails]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      setAcknowledgingId(alertId);
      await budgetService.acknowledgeAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (e) {
      console.error('Failed to acknowledge alert', e);
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Budget Manager
          </h1>
          <p className="text-gray-500 font-medium italic">
            Plan your spending and save for what matters most.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <div 
                className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-black text-gray-800 dark:text-white min-w-[100px] text-center">
                  {formattedDate}
                </span>
              </div>
              
              <Dropdown 
                isOpen={isMonthPickerOpen} 
                onClose={() => setIsMonthPickerOpen(false)}
                className="w-72 p-4 top-full mt-2 left-1/2 -translate-x-1/2"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setPickerYear(prev => prev - 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-900 dark:text-white">{pickerYear}</span>
                    <button 
                      onClick={() => setPickerYear(prev => prev + 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {monthNames.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(index)}
                        className={`
                          p-2 text-xs font-medium rounded-lg transition-colors
                          ${activeDate.getMonth() === index && activeDate.getFullYear() === pickerYear
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }
                        `}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </Dropdown>
            </div>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" /> Set Budget
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-white/[0.03] rounded-2xl w-fit border border-gray-50 dark:border-gray-800/50">
          {[
            { id: "active", label: "Active Budgets", icon: <Target className="w-4 h-4" /> },
            { id: "suggestions", label: "AI Suggestions", icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
            { id: "archives", label: "Monthly Archives", icon: <History className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.id 
                  ? "bg-white dark:bg-gray-900 text-purple-600 shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
           <div className="relative isolate">
             <button 
               onClick={() => setIsFilterVisible(!isFilterVisible)}
               className={`p-2.5 rounded-xl transition-all border ${isFilterVisible ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600'}`}
             >
               <Filter className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      {isFilterVisible && activeTab === "active" && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Search Categories</label>
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search budget categories..."
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Specific Category</label>
                 <div className="relative">
                    <select 
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    >
                       <option value="">All Categories</option>
                       {categories.map(cat => (
                         <option key={cat.id} value={cat.name}>{cat.name}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                 </div>
              </div>

              <div className="flex items-end">
                <button 
                  onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                  className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                   Reset Filters
                </button>
              </div>
           </div>
        </div>
      )}


      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {activeTab === "active" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <BudgetList 
                 budgets={budgets.filter(b => {
                   const matchesSearch = b.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
                   const matchesCategory = !selectedCategory || b.category?.name === selectedCategory;
                   return matchesSearch && matchesCategory;
                 })} 
                 isLoading={isLoading} 
               />
            </div>

          )}
          {activeTab === "suggestions" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <PredictiveBudgetPanel />
            </div>
          )}
          {activeTab === "archives" && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                 <History className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">Historical Data</h3>
               <p className="text-sm text-gray-500 max-w-xs mx-auto">Track your budgeting performance over the past months.</p>
            </div>
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Overall Health</p>
            <h3 className="text-2xl font-black mb-4">On Track</h3>
            <div className="h-2 w-full bg-white/20 rounded-full mb-2 overflow-hidden">
               <div className="h-full bg-emerald-400 w-[65%] rounded-full" />
            </div>
            <p className="text-xs font-medium leading-relaxed opacity-90">
              You've used 65% of your total budget. Stay below ₹15,000 this week to meet your savings goal.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <AlertCircle className="w-4 h-4 text-orange-500" />
               <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">Budget Alerts</h4>
            </div>
            {alerts.length === 0 ? (
              <p className="text-xs text-gray-500 font-medium">No alerts right now.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-2xl">
                    <p className="text-xs font-bold text-gray-800 dark:text-white mb-1">
                      {alert.budget?.category?.name ?? "Budget"} – {alert.threshold_percentage}% threshold
                    </p>
                    {alert.message && <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-2">{alert.message}</p>}
                    <button
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      disabled={acknowledgingId === alert.id}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 hover:text-orange-700"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> {acknowledgingId === alert.id ? "..." : "Acknowledge"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <Filter className="w-4 h-4 text-purple-600" />
               <h4 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">Top Overspent</h4>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Entertainment</span>
                  <span className="text-xs font-black text-red-500">+ ₹2,400</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Shopping</span>
                  <span className="text-xs font-black text-amber-500">Near Limit</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Budget Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Configure Category Budget</h3>
          <p className="text-sm text-gray-500 font-medium">Set monthly limits and enable rollover for specific needs.</p>
        </div>
        <AddBudgetForm onSuccess={closeModal} onCancel={closeModal} categories={categories} family_id={familyDetails?.id || ""} />
      </Modal>
    </div>
  );
}
