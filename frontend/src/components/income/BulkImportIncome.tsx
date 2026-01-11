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
  Trash2
} from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BulkImportIncomeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ImportedIncome {
  id: string;
  name: string;
  amount: string;
  source: string;
  date: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export const BulkImportIncome: React.FC<BulkImportIncomeProps> = ({ onSuccess, onCancel }) => {
  const [importedData, setImportedData] = useState<ImportedIncome[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
    
    setTimeout(() => {
      const mockData: ImportedIncome[] = [
        { id: '1', name: 'Dividend Payout', amount: '4500', source: 'Investments', date: '2026-01-02', status: 'valid' },
        { id: '2', name: 'Referral Bonus', amount: '1000', source: 'Freelancing', date: '2026-01-08', status: 'valid' },
        { id: '3', name: 'Tax Refund', amount: 'ABC', source: 'Gift', date: '2026-01-15', status: 'invalid', error: 'Non-numeric amount' },
      ];
      setImportedData(mockData);
      setIsProcessing(false);
    }, 1200);
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
            ${isDragActive ? 'border-green-500 bg-green-50/10' : 'border-gray-200 dark:border-gray-800 hover:border-green-500'}`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Bulk Import Income</h4>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Selected CSV or Excel files will be scanned for income records.
          </p>
          <Button variant="outline" className="rounded-xl gap-2 font-bold text-xs uppercase">
            <Download className="w-4 h-4" /> Download Format
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white">{file.name}</h5>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{importedData.length} records detected</p>
              </div>
            </div>
            <button onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
          </div>

          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase">Status</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase">Source Name</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase text-right">Amount</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {importedData.map(row => (
                    <tr key={row.id} className="text-sm">
                      <td className="px-5 py-4">
                        {row.status === 'valid' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-800 dark:text-white">{row.name}</td>
                      <td className="px-5 py-4 font-black text-green-600 text-right">₹{row.amount}</td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => removeRow(row.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4 mx-auto"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} className="rounded-2xl px-8 font-bold text-gray-500">Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-500 text-white rounded-2xl px-12 font-bold shadow-xl shadow-green-500/20">Confirm Import</Button>
          </div>
        </div>
      )}
    </div>
  );
};
