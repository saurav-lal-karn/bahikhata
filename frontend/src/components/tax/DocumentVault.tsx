"use client";
import React from "react";
import { FileText, Download, Trash2, Search, Filter, Shield } from "lucide-react";
import { TaxDocument } from "@/types";

interface DocumentVaultProps {
  documents?: TaxDocument[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ documents = [], isLoading = false, onDelete }) => {
  if (isLoading) return <div className="text-center py-10">Loading vault...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90 flex items-center gap-3">
           <FileText className="w-5 h-5 text-indigo-500" /> Document Vault
        </h3>
        
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Find document..." 
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-full md:w-48"
              />
           </div>
           <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
             <Filter className="w-4 h-4 text-gray-400" />
           </button>
        </div>
      </div>

      <div className="p-6">
         {documents.length === 0 ? (
             <div className="text-center py-10 text-gray-400 text-sm">No documents found.</div>
         ) : (
         <div className="grid grid-cols-1 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                       <FileText className="w-5 h-5" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-gray-800 dark:text-white">{doc.name}</h4>
                       <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{doc.category} • {doc.year}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                             <Shield className="w-2.5 h-2.5 text-emerald-500" /> Secure
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                       <Download className="w-4 h-4" />
                    </button>
                    <button 
                       onClick={() => onDelete && onDelete(doc.id)}
                       className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
                 
                 <div className="text-right group-hover:hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(doc.created_at).toLocaleDateString()}</p>
                 </div>
              </div>
            ))}
         </div>
         )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
         <Shield className="w-4 h-4 text-emerald-500" />
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End-to-end encrypted storage</span>
      </div>
    </div>
  );
};
