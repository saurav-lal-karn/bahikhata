"use client";
import React, { useState } from "react";
import { 
  TrendingUp, 
  Wallet, 
  Landmark, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Search,
  PieChart,
  Gem,
  Coins,
  FileSpreadsheet
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddInvestmentForm } from "@/components/investments/AddInvestmentForm";
import { BulkImportInvestments } from "@/components/investments/BulkImportInvestments";
import { useAuth } from "@/context/AuthContext";
import { investmentService } from "@/services/investmentService";
import { Investment } from "@/types";

export default function InvestmentsPageClient() {
  const { user } = useAuth();
  const familyDetails = user?.family;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvestments = async () => {
    if (familyDetails?.id) {
        try {
            setIsLoading(true);
            const data = await investmentService.getAll(familyDetails.id);
            setInvestments(data || []);
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
  };

  React.useEffect(() => {
    fetchInvestments();
  }, [familyDetails?.id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
      setIsModalOpen(false);
      fetchInvestments();
  };
  
  const openBulkModal = () => setIsBulkModalOpen(true);
  const closeBulkModal = () => setIsBulkModalOpen(false);

  const filteredInvestments = investments.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvested = investments.reduce((acc, inv) => acc + (inv.quantity * inv.avg_buy_price), 0);
  const totalCurrent = investments.reduce((acc, inv) => acc + (inv.quantity * inv.current_price), 0);
  const totalGain = totalInvested > 0 ? ((totalCurrent - totalInvested) / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Family Investments
          </h1>
          <p className="text-gray-500 font-medium italic">
            Track and manage your household's long-term wealth.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={openBulkModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm"
          >
            <FileSpreadsheet className="w-5 h-5 text-blue-600" /> Import
          </button>
          <button 
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" /> Add Investment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Invested</p>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
            ₹{(totalInvested / 100000).toFixed(2)}L
          </h2>
          <p className="text-xs text-gray-400 font-medium">Principal amount across all assets</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Current Value</p>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
            ₹{(totalCurrent / 100000).toFixed(2)}L
          </h2>
          <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" /> +{totalGain.toFixed(1)}% Overall Return
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-2xl">
              <Coins className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Net Gain</p>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1">
            ₹{(totalCurrent - totalInvested).toLocaleString()}
          </h2>
          <p className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Unrealized Profits</p>
        </div>
      </div>

      {/* Portfolio List */}
      <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">Asset Allocation</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium" 
              />
            </div>
            <button className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-400">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invested</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Returns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                  <tr><td colSpan={5} className="text-center py-10">Loading...</td></tr>
              ) : filteredInvestments.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-500">No investments found.</td></tr>
              ) : filteredInvestments.map((inv) => {
                  const investedAmount = inv.quantity * inv.avg_buy_price;
                  const currentVal = inv.quantity * inv.current_price;
                  const gain = investedAmount > 0 ? ((currentVal - investedAmount) / investedAmount) * 100 : 0;
                  
                  return (
                    <tr key={inv.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all">
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-blue-50 text-blue-600 group-hover:rotate-6 transition-transform`}>
                            <PieChart className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-gray-800 dark:text-white">{inv.name}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {inv.type}
                        </span>
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{investedAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                        <span className="text-sm font-black text-gray-900 dark:text-white">₹{currentVal.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                        <div className={`inline-flex items-center gap-1 text-sm font-black ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {gain >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(gain).toFixed(1)}%
                        </div>
                    </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Investment Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-5xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
            <TrendingUp className="text-blue-500 w-8 h-8" /> New Investment
          </h3>
          <p className="text-sm text-gray-500 font-medium">Add a new asset, stock, or fund to your portfolio.</p>
        </div>
        <AddInvestmentForm onSuccess={closeModal} onCancel={closeModal} familyId={familyDetails?.id} />
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={closeBulkModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Bulk Import Portfolio</h3>
          <p className="text-sm text-gray-500 font-medium">Upload a CSV or Excel file to batch import your investment history.</p>
        </div>
        <BulkImportInvestments onSuccess={closeBulkModal} onCancel={closeBulkModal} />
      </Modal>
    </div>
  );
}
