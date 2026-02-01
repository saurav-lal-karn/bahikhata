"use client";
import React, { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  IndianRupee, 
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { Transaction } from "@/types";
import { transactionService } from "@/services/transactionService";

interface WalletStatementProps {
  walletId: string;
  familyId: string;
}

export const WalletStatement = ({ walletId, familyId }: WalletStatementProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions(familyId, { 
        wallet_id: walletId,
        page_size: 10 // Show only recent 10 for details page
      });
      setTransactions(response.transactions);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error("Failed to fetch wallet transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId && familyId) {
      fetchTransactions();
    }
  }, [walletId, familyId]);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-12 text-center border border-gray-100 dark:border-gray-800">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
          <IndianRupee className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No transactions found</h3>
        <p className="text-sm text-gray-500">This wallet doesn't have any activity yet.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Statement</h3>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                <th className="py-5 px-8 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        tx.type === 'INCOME' 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                      }`}>
                        {tx.type === 'INCOME' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{tx.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">{tx.description || "No description"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase tracking-tight">
                      {tx.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-xs font-semibold text-gray-500">
                    {formatDate(tx.transaction_date)}
                  </td>
                  <td className={`py-5 px-8 text-sm font-black text-right ${
                    tx.type === 'INCOME' ? 'text-green-600' : 'text-gray-900 dark:text-white'
                  }`}>
                    {tx.type === 'INCOME' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalCount > 10 && (
          <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 text-center border-t border-gray-50 dark:border-gray-800">
            <button className="text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors">
              View All Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
