"use client";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Trash2,
  TrendingUp
} from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BulkImportInvestmentsProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ImportedInvestment {
  id: string;
  name: string;
  amount: string;
  type: string;
  date: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export const BulkImportInvestments: React.FC<BulkImportInvestmentsProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<ImportedInvestment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelection(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    
    // Simulate parsing
    setTimeout(() => {
      const mockData: ImportedInvestment[] = [
        { id: '1', name: 'Groww Nifty 50', amount: '25000', type: 'Mutual Fund', date: '2026-01-05', status: 'valid' },
        { id: '2', name: 'Zomato Stocks', amount: '12000', type: 'Stock', date: '2026-01-10', status: 'valid' },
        { id: '3', name: 'Gold Bar 24K', amount: 'abc', type: 'Gold', date: '2026-01-12', status: 'invalid', error: 'Invalid amount' },
      ];
      setImportedData(mockData);
      setIsProcessing(false);
    }, 1500);
  };

  const removeFile = () => {
    setFile(null);
    setImportedData([]);
  };

  const removeRow = (id: string) => {
    setImportedData(prev => prev.filter(row => row.id !== id));
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center
            ${isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-500'}`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Bulk Import Investments</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Quickly add multiple portfolio entries using a CSV or Excel template.
          </p>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl gap-2 font-bold text-xs uppercase px-5 py-2.5 h-auto">
              <Download className="w-4 h-4" /> Template
            </Button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-black text-gray-900 dark:text-white text-sm">{file.name}</h5>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {isProcessing ? "Processing..." : `${importedData.length} records found`}
                </p>
              </div>
            </div>
            <button onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isProcessing && importedData.length > 0 && (
            <div className="border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 dark:bg-white/[0.02] sticky top-0 backdrop-blur-md">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {importedData.map(row => (
                      <tr key={row.id} className="group hover:bg-gray-50/30 dark:hover:bg-white/[0.01]">
                        <td className="px-6 py-4">
                          {row.status === 'valid' ? 
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                            <div className="flex items-center gap-1.5" title={row.error}>
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            </div>
                          }
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-black text-gray-800 dark:text-white">{row.name}</p>
                           <span className="text-[10px] font-bold text-gray-400 uppercase">{row.type}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-black ${row.status === 'valid' ? 'text-blue-600' : 'text-red-400'}`}>
                            ₹{row.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => removeRow(row.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Data pre-validation complete
             </div>
             <div className="flex gap-3">
                <Button variant="outline" onClick={onCancel} className="rounded-2xl px-8 h-12 font-bold text-gray-500">Discard</Button>
                <Button 
                  disabled={importedData.some(d => d.status === 'invalid') || importedData.length === 0}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {importedData.filter(d => d.status === 'valid').length} Records
                </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
