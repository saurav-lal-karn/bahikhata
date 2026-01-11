"use client";
import React from "react";
import { Landmark, TrendingDown, Calendar, Clock } from "lucide-react";

const loans = [
  {
    id: "1",
    name: "Home Loan - HDFC Bank",
    principal: 4500000,
    remaining: 3250000,
    emi: 42000,
    interest: 8.5,
    tenure: "15 Years",
    left: "9 Years",
    color: "bg-blue-50 text-blue-600",
    barColor: "bg-blue-500"
  },
  {
    id: "2",
    name: "Car Loan - ICICI",
    principal: 800000,
    remaining: 320000,
    emi: 15500,
    interest: 9.2,
    tenure: "5 Years",
    left: "2 Years",
    color: "bg-indigo-50 text-indigo-600",
    barColor: "bg-indigo-500"
  }
];

export const LoanTracker = () => {
  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
           <Landmark className="w-6 h-6 text-blue-500" /> Active Loans
        </h3>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
          {loans.length} Loans
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        {loans.map((loan) => {
          const progress = Math.round(((loan.principal - loan.remaining) / loan.principal) * 100);
          
          return (
            <div key={loan.id} className="p-6 border border-gray-50 dark:border-gray-800 rounded-3xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${loan.color} transition-transform group-hover:scale-110 shadow-sm`}>
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-800 dark:text-white">{loan.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" /> {loan.interest}% Int.
                       </span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {loan.left} left
                       </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly EMI</p>
                   <p className="text-2xl font-black text-gray-900 dark:text-white">₹{loan.emi.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Loan</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{(loan.principal / 100000).toFixed(1)}L</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                    <p className="text-sm font-black text-red-500">₹{(loan.remaining / 100000).toFixed(1)}L</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid Off</p>
                    <p className="text-sm font-bold text-emerald-500">₹{((loan.principal - loan.remaining) / 100000).toFixed(1)}L</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenure</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{loan.tenure}</p>
                 </div>
              </div>

              <div className="relative h-2 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${loan.barColor} shadow-lg shadow-blue-500/10`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{progress}% Repaid</span>
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                   View Schedule <Calendar className="w-3 h-3" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
