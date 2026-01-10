"use client";
import React from "react";
import Image from "next/image";
import { ShoppingCart, Home, Car, Utensils, Zap, MoreHorizontal } from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Groceries - BigBasket",
    category: "Food & Drinks",
    amount: "-₹2,450",
    date: "24 May 2026",
    status: "Completed",
    icon: <ShoppingCart className="w-5 h-5" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
  },
  {
    id: 2,
    name: "House Rent",
    category: "Housing",
    amount: "-₹25,000",
    date: "22 May 2026",
    status: "Completed",
    icon: <Home className="w-5 h-5" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
  },
  {
    id: 3,
    name: "Salary Credit",
    category: "Income",
    amount: "+₹85,000",
    date: "20 May 2026",
    status: "Completed",
    icon: <Zap className="w-5 h-5" />,
    iconBg: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
  },
  {
    id: 4,
    name: "Petrol - HP Fuel",
    category: "Transport",
    amount: "-₹1,200",
    date: "18 May 2026",
    status: "Pending",
    icon: <Car className="w-5 h-5" />,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
  },
  {
    id: 5,
    name: "Zomato - Dinner",
    category: "Food & Drinks",
    amount: "-₹850",
    date: "17 May 2026",
    status: "Completed",
    icon: <Utensils className="w-5 h-5" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
  }
];

export const RecentTransactions = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Recent Transactions
        </h3>
        <button className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Transaction</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
              <th className="pb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="group">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${transaction.iconBg}`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-none mb-1">
                        {transaction.name}
                      </h4>
                      <p className={`text-xs ${transaction.status === 'Pending' ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {transaction.category}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </td>
                <td className={`py-4 px-4 text-sm font-bold text-right ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-gray-800 dark:text-white/90'}`}>
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
