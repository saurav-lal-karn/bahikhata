"use client";
import React, { useState, useEffect } from "react";
import { 
  Target, 
  Plus, 
  ShieldCheck, 
  PieChart, 
  TrendingUp,
  Coins,
  ArrowRight,
  Filter,
  Search,
  ChevronDown,
  AlertTriangle,
  RotateCw
} from "lucide-react";

import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { GoalCard } from "@/components/goals/GoalCard";
import { AddGoalForm } from "@/components/goals/AddGoalForm";
import { EmergencyFundCalculator } from "@/components/goals/EmergencyFundCalculator";
import { DiversityAnalysis } from "@/components/goals/DiversityAnalysis";
import { useAuth } from "@/context/AuthContext";
import { goalService } from "@/services/goalService";
import { Goal } from "@/types";
import { GoalSkeleton } from "@/components/goals/GoalSkeleton";
import { Home, Plane, ShoppingBag, ShieldCheck as Shield, Target as TargetIcon, Landmark as LandmarkIcon } from "lucide-react";

const getGoalIcon = (iconName: string) => {
  const className = "w-5 h-5";
  switch (iconName) {
    case 'home': return <LandmarkIcon className={className} />;
    case 'travel': return <Plane className={className} />;
    case 'shopping': return <ShoppingBag className={className} />;
    case 'security': return <Shield className={className} />;
    case 'wealth': return <TargetIcon className={className} />;
    case 'asset': return <Home className={className} />;
    default: return <TargetIcon className={className} />;
  }
};

const getGoalColors = (iconName: string) => {
  switch (iconName) {
    case 'home': return { color: "bg-blue-50 text-blue-600", barColor: "bg-blue-500" };
    case 'travel': return { color: "bg-purple-50 text-purple-600", barColor: "bg-purple-500" };
    case 'shopping': return { color: "bg-pink-50 text-pink-600", barColor: "bg-pink-500" };
    case 'security': return { color: "bg-emerald-50 text-emerald-600", barColor: "bg-emerald-500" };
    case 'wealth': return { color: "bg-amber-50 text-amber-600", barColor: "bg-amber-500" };
    case 'asset': return { color: "bg-indigo-50 text-indigo-600", barColor: "bg-indigo-500" };
    default: return { color: "bg-gray-50 text-gray-600", barColor: "bg-gray-500" };
  }
};

export default function GoalsPageClient() {
  const { user } = useAuth();
  const familyId = user?.family?.id || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // Edit & Delete State
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique goal icons as categories for now
  const goalCategories = Array.from(new Set(goals.map(g => g.icon_name).filter(Boolean))) as string[];

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || goal.icon_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  const fetchGoals = async () => {
    if (!familyId) return;
    try {
      setIsLoading(true);
      const data = await goalService.getGoals(familyId);
      setGoals(data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [familyId]);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    fetchGoals(); // Refresh list after adding
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeletingGoal(goal);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingGoal) return;
    try {
      setIsDeleting(true);
      await goalService.deleteGoal(deletingGoal.id);
      toast.success("Goal deleted successfully");
      setIsDeleteModalOpen(false);
      fetchGoals();
    } catch (error) {
      console.error("Failed to delete goal:", error);
      toast.error("Failed to delete goal");
    } finally {
      setIsDeleting(false);
      setDeletingGoal(null);
    }
  };

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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                <Target className="text-emerald-500 w-6 h-6" /> Active Target Goals
              </h3>
              <span className="hidden sm:inline-block text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                {filteredGoals.length} Goals in Progress
              </span>
            </div>
            
            <div className="flex items-center gap-2">
               <div className="relative isolate group">
                  <div className={`absolute inset-0 bg-emerald-500/10 blur-xl transition-opacity duration-500 ${isFilterVisible ? 'opacity-100' : 'opacity-0'}`} />
                  <button 
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className={`relative p-2.5 rounded-xl border transition-all ${isFilterVisible ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600'}`}
                  >
                    <Filter className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </div>

          {/* Filter Bar */}
          {isFilterVisible && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Goal Name</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="e.g. Dream House..." 
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                    <div className="relative">
                      <select 
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none capitalize"
                      >
                         <option value="">All Categories</option>
                         {goalCategories.map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
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
                        Clear Filters
                     </button>
                  </div>
               </div>
            </div>
          )}

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
               // Skeletons
               Array(4).fill(0).map((_, i) => <GoalSkeleton key={i} />)
            ) : filteredGoals.length > 0 ? (
               filteredGoals.map((goal) => {

                 const { color, barColor } = getGoalColors(goal.icon_name);
                 return (
                  <GoalCard 
                    key={goal.id}
                    id={goal.id}
                    title={goal.name} 
                    target={goal.target_amount} 
                    current={goal.current_amount} 
                    deadline={new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    icon={getGoalIcon(goal.icon_name)}
                    color={color}
                    barColor={barColor}
                    onContributionSuccess={fetchGoals}
                    onEdit={() => handleEditGoal(goal)}
                    onDelete={() => handleDeleteGoal(goal)}
                  />
                 );
               })
            ) : (
                <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <Target className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Goals Yet</h3>
                    <p className="text-gray-500 mb-6">Start saving for your dreams today.</p>
                    <button 
                        onClick={openModal}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
                    >
                        Create Your First Goal
                    </button>
                </div>
            )}
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
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">{editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}</h3>
          <p className="text-sm text-gray-500 font-medium">{editingGoal ? 'Update your goal details below.' : 'Set a target for your next big milestone and track progress monthly.'}</p>
        </div>
        <AddGoalForm 
          onSuccess={closeModal} 
          onCancel={closeModal} 
          familyId={familyId} 
          initialData={editingGoal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-6">
           <div className="p-4 bg-red-50 text-red-500 rounded-full">
             <AlertTriangle className="w-8 h-8" />
           </div>
           
           <div className="space-y-2">
             <h3 className="text-xl font-black text-gray-900 dark:text-white">Delete Goal?</h3>
             <p className="text-sm text-gray-500 font-medium">
               Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-white">"{deletingGoal?.name}"</span>? 
               This action cannot be undone and all associated contributions history will be lost.
             </p>
           </div>

           <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? <RotateCw className="w-4 h-4 animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Delete Goal'}
              </button>
           </div>
        </div>
      </Modal>
    </div>
  );
}
