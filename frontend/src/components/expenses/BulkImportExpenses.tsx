"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Trash2,
  Table as TableIcon,
  ChevronDown
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface BulkImportExpensesProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ImportedExpense {
  id: string;
  name: string;
  amount: string;
  category: string;
  date: string;
  status: 'valid' | 'invalid';
  error?: string;
}

export const BulkImportExpenses: React.FC<BulkImportExpensesProps> = ({ onSuccess, onCancel }) => {
  const [importedData, setImportedData] = useState<ImportedExpense[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelection(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false
  });

  const validateRow = (row: any, index: number): ImportedExpense => {
    const id = `row-${index}-${Date.now()}`;
    const name = row.name || row.Name || '';
    const amountStr = row.amount || row.Amount || '';
    const category = row.category || row.Category || 'Uncategorized';
    let dateStr = row.date || row.Date || '';
    
    let status: 'valid' | 'invalid' = 'valid';
    let error = '';

    // Validate Name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      status = 'invalid';
      error = 'Missing name';
    }

    // Validate Amount
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      status = 'invalid';
      error = 'Invalid amount';
    }

    // Validate Date (Simple check)
    if (!dateStr) {
      status = 'invalid';
      error = 'Missing date';
    } else {
      // Try to parse date if it's Excel serial number
      if (typeof dateStr === 'number') {
         const date = new Date(Math.round((dateStr - 25569) * 86400 * 1000));
         dateStr = date.toISOString().split('T')[0];
      } else if (new Date(dateStr).toString() === 'Invalid Date') {
        status = 'invalid';
        error = 'Invalid date format';
      }
    }

    return {
      id,
      name,
      amount: amountStr.toString(),
      category,
      date: dateStr,
      status,
      error
    };
  };

  const handleFileSelection = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setImportedData([]);

    try {
      if (selectedFile.name.endsWith('.csv')) {
        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map((row: any, index: number) => validateRow(row, index));
            setImportedData(parsedData);
            setIsProcessing(false);
          },
          error: (error) => {
            console.error('CSV Parse Error:', error);
            setIsProcessing(false);
          }
        });
      } else if (selectedFile.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          if (data) {
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const parsedData = jsonData.map((row: any, index: number) => validateRow(row, index));
            setImportedData(parsedData);
          }
          setIsProcessing(false);
        };
        reader.onerror = () => {
             console.error('Excel Read Error');
             setIsProcessing(false);
        };
        reader.readAsBinaryString(selectedFile);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setImportedData([]);
  };

  const removeRow = (id: string) => {
    setImportedData(prev => prev.filter(row => row.id !== id));
  };

  const handleImport = () => {
    const validData = importedData.filter(row => row.status === 'valid');
    console.log("Importing valid expenses:", validData);
    // Here you would typically send validData to your backend API
    if (onSuccess) onSuccess();
  };

  const toggleDropdown = () => {
    setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div className="space-y-4">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center text-center
              ${isDragActive 
                ? 'border-brand-500 bg-brand-50/10' 
                : 'border-gray-200 dark:border-gray-800 hover:border-brand-500 hover:bg-gray-50/50 dark:hover:bg-gray-900/50'}`}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">Upload Data File</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Selected CSV or Excel files will be scanned and validated before import.
            </p>
            <div className="flex gap-4">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">.CSV</span>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">.XLSX</span>
            </div>
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Need a template?</p>
                <p className="text-xs text-blue-700/70 dark:text-blue-400/70 font-medium">Download our CSV or Excel template to ensure smooth import.</p>
              </div>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="outline" 
                onClick={toggleDropdown}
                className="dropdown-toggle rounded-xl border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs gap-2"
              >
                <Download className="w-4 h-4" /> Templates <ChevronDown className="w-3 h-3" />
              </Button>
              
              <Dropdown 
                isOpen={isTemplateDropdownOpen} 
                onClose={() => setIsTemplateDropdownOpen(false)}
                className="w-48 right-0"
              >
                <div className="p-1">
                    <DropdownItem 
                      tag="a" 
                      href="/data/expense_template.csv" 
                      className="rounded-lg text-xs font-medium"
                      onClick={() => setIsTemplateDropdownOpen(false)}
                    >
                      Download CSV Template
                    </DropdownItem>
                    <DropdownItem 
                      tag="a" 
                      href="/data/expense_template.xlsx" 
                      className="rounded-lg text-xs font-medium"
                      onClick={() => setIsTemplateDropdownOpen(false)}
                    >
                      Download Excel Template
                    </DropdownItem>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white">{file.name}</h5>
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                  {(file.size / 1024).toFixed(1)} KB • {importedData.length} records found
                </p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Expense</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {isProcessing ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : importedData.map((row) => (
                    <tr key={row.id} className="text-sm group">
                      <td className="px-5 py-4">
                        {row.status === 'valid' ? (
                          <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase" title={row.error}>
                            <AlertCircle className="w-3.5 h-3.5" /> Error
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-black text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-5 py-4 font-black text-brand-600">₹{row.amount}</td>
                      <td className="px-5 py-4 text-gray-500 font-medium">{row.date}</td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => removeRow(row.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {importedData.filter(r => r.status === 'valid').length} Ready
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {importedData.filter(r => r.status === 'invalid').length} Errors
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="rounded-2xl px-8 font-bold text-gray-500"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={importedData.filter(r => r.status === 'valid').length === 0}
                className="bg-brand-600 hover:bg-brand-500 text-white rounded-2xl px-12 font-bold shadow-xl shadow-brand-500/20 py-3 h-auto"
              >
                Confirm Import ({importedData.filter(r => r.status === 'valid').length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
