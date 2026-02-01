"use client";
import React from "react";
import { ShoppingCart, Home, Car, Utensils, Zap, Plus, TrendingUp, TrendingDown, Target, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsService, Activity } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";

const getIcon = (type: string, category: string) => {
    const className = "w-5 h-5";
    const cat = category.toLowerCase();
    
    if (type === 'INCOME' || type === 'income') return { icon: <Zap className={className} />, bg: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400" };
    if (type === 'contribution') return { icon: <Target className={className} />, bg: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" };
    if (type === 'repayment') return { icon: <TrendingDown className={className} />, bg: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" };
    if (type === 'investment_transaction') return { icon: <Landmark className={className} />, bg: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" };
    
    if (cat.includes('food')) return { icon: <Utensils className={className} />, bg: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" };
    if (cat.includes('house') || cat.includes('rent')) return { icon: <Home className={className} />, bg: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" };
    if (cat.includes('car') || cat.includes('transport')) return { icon: <Car className={className} />, bg: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" };
    
    return { icon: <ShoppingCart className={className} />, bg: "bg-gray-100 dark:bg-gray-800 text-gray-600" };
};

export const RecentTransactions = () => {
  const { user } = useAuth();
  const familyId = user?.family?.id;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (familyId) {
      analyticsService.getDashboardSummary(familyId)
        .then(data => setActivities(data.recent_activity))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [familyId]);

  if (isLoading) return <div className="h-64 bg-gray-50 dark:bg-gray-800 animate-pulse rounded-2xl" />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Latest Activity
        </h3>
        <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Activity</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {activities.map((activity) => {
              const style = getIcon(activity.type, activity.category);
              return (
              <tr key={activity.id} className="group">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-none mb-1">
                        {activity.title}
                      </h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest text-gray-400`}>
                        {activity.type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {activity.category}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </td>
                <td className={`py-4 px-4 text-sm font-bold text-right ${activity.type === 'INCOME' ? 'text-green-500' : 'text-gray-800 dark:text-white/90'}`}>
                   {activity.type === 'INCOME' ? '+' : '-'}₹{activity.amount.toLocaleString()}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
        {activities.length === 0 && <div className="text-center py-10 text-gray-400 font-medium">No recent activities found.</div>}
      </div>
    </div>
  );
};
