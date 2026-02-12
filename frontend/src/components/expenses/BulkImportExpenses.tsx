"use client";
import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Trash2,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import Button from "@/components/ui/button/Button";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { ExpenseCategory, PaymentMethod, WalletInfoType, Contact, Project, Tag } from "@/types";
import { Location } from "@/services/organizationService";
import { transactionService } from "@/services/transactionService";
import toast from "react-hot-toast";

interface BulkImportExpensesProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onFileSelect?: (hasFile: boolean) => void;
  familyId: string;
  categories?: ExpenseCategory[];
  wallets?: WalletInfoType[];
  paymentMethods?: PaymentMethod[];
  contacts?: Contact[];
  projects?: Project[];
  tags?: Tag[];
  locations?: Location[];
}

interface Item {
  itemname: string;
  quantity: number;
  unitprice: number;
  total: number;
}

interface ImportedExpense {
  id: string;
  name: string;
  amount: string;
  category: string;
  date: string;
  account?: string;
  payment_method?: string;
  vendor?: string;
  project?: string;
  location?: string;
  description?: string;
  tags?: string[];
  items?: Item[];
  status: 'valid' | 'invalid';
  error?: string;
  warnings?: Record<string, string>;
  isExpanded?: boolean;
}

export const BulkImportExpenses: React.FC<BulkImportExpensesProps> = ({ 
  onSuccess, 
  onCancel, 
  onFileSelect,
  familyId,
  categories = [],
  wallets = [],
  paymentMethods = [],
  contacts = [],
  projects = [],
  tags = [],
  locations = []
}) => {
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

  const parseJsonField = (field: any): any => {
    if (!field) return undefined;
    if (typeof field === 'object') return field;
    try {
      return JSON.parse(field);
    } catch (e) {
      console.warn("Failed to parse JSON field:", field, e);
      return undefined;
    }
  };

  const validateRow = (row: any, index: number): ImportedExpense => {
    const id = `row-${index}-${Date.now()}`;
    const name = row.name || row.Name || '';
    const amountStr = row.amount || row.Amount || '';
    const categoryName = row.category || row.Category || 'Uncategorized';
    let dateStr = row.date || row.Date || '';
    
    // Optional fields
    const accountName = row.account || row.Account;
    const paymentMethodName = row.payment_method || row.Payment_Method;
    const vendorName = row.vendor || row.Vendor;
    const projectName = row.project || row.Project;
    const locationName = row.location || row.Location;
    const description = row.description || row.Description;
    
    // Complex fields
    const tagsRaw = row.tags || row.Tags;
    const itemsRaw = row.items || row.Items;
    
    const rowTags = Array.isArray(parseJsonField(tagsRaw)) ? parseJsonField(tagsRaw) : [];
    const items = Array.isArray(parseJsonField(itemsRaw)) ? parseJsonField(itemsRaw) : [];

    let status: 'valid' | 'invalid' = 'valid';
    let error = '';
    const warnings: Record<string, string> = {};

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

    // Validate Date
    if (!dateStr) {
      status = 'invalid';
      error = 'Missing date';
    } else {
      if (typeof dateStr === 'number') {
         const date = new Date(Math.round((dateStr - 25569) * 86400 * 1000));
         dateStr = date.toISOString().split('T')[0];
      } else if (new Date(dateStr).toString() === 'Invalid Date') {
        status = 'invalid';
        error = 'Invalid date format';
      }
    }

    // Entity Validation - Check if they exist in props
    if (categoryName && !categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
        warnings['category'] = `New category will be created`;
    }

    if (accountName && !wallets.some(w => w.name.toLowerCase() === accountName.toLowerCase())) {
        warnings['account'] = `New wallet will be created`;
    }

    if (paymentMethodName && !paymentMethods.some(pm => pm.name.toLowerCase() === paymentMethodName.toLowerCase())) {
        warnings['payment_method'] = `New payment method will be created`;
    }

    if (vendorName && !contacts.some(c => c.name.toLowerCase() === vendorName.toLowerCase())) {
        warnings['vendor'] = `New vendor will be created`;
    }

    if (projectName && !projects.some(p => p.name.toLowerCase() === projectName.toLowerCase())) {
        warnings['project'] = `New project will be created`;
    }

    if (locationName && !locations.some(l => l.name.toLowerCase() === locationName.toLowerCase())) {
        warnings['location'] = `New location will be created`;
    }

    // For tags, check each tag
    if (rowTags.length > 0) {
        const newTags = rowTags.filter((t: string) => !tags.some(existing => existing.name.toLowerCase() === t.toLowerCase()));
        if (newTags.length > 0) {
            warnings['tags'] = `${newTags.length} new tag(s) will be created`;
        }
    }

    return {
      id,
      name,
      amount: amountStr.toString(),
      category: categoryName,
      date: dateStr,
      account: accountName,
      payment_method: paymentMethodName,
      vendor: vendorName,
      project: projectName,
      location: locationName,
      description,
      tags: rowTags,
      items,
      status,
      error,
      warnings,
      isExpanded: false
    };
  };

  const handleFileSelection = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setImportedData([]);
    if (onFileSelect) onFileSelect(true);

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
    if (onFileSelect) onFileSelect(false);
  };

  const removeRow = (id: string) => {
    setImportedData(prev => prev.filter(row => row.id !== id));
  };

  const removeItem = (id: string, itemName: string) => {
    setImportedData(prev => prev.map(row => 
      row.id === id ? { ...row, items: row?.items?.filter(item => item.itemname !== itemName) } : row
    ));
  };

  const toggleRowExpansion = (id: string) => {
    setImportedData(prev => prev.map(row => 
      row.id === id ? { ...row, isExpanded: !row.isExpanded } : row
    ));
  };

  const getOrCreateEntity = async <T extends { id: string, name: string }>(
    name: string, 
    existingList: T[], 
    createFn: (name: string) => Promise<T | { id: string }>
  ): Promise<string> => {
    if (!name) return "";
    const existing = existingList.find(e => e.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing.id;
    try {
        const created = await createFn(name);
        // Optimistically add to list or let parent re-fetch? 
        // Ideally we should update local state but prop update is better.
        // For now, simpler to just get ID.
        return (created as any).id || (created as any).data?.id;
    } catch (error) {
        console.error(`Failed to create entity: ${name}`, error);
        return ""; // Or throw?
    }
  };

  const handleImport = async () => {
    const validData = importedData.filter(row => row.status === 'valid');
    if (validData.length === 0) return;

    setIsProcessing(true);
    const toastId = toast.loading("Processing import...");

    console.log("Starting import for", validData.length, "rows");

    try {
        const transactions = validData.map((row) => ({
            type: 'EXPENSE',
            amount: parseFloat(row.amount),
            description: row.description || `Imported from ${file?.name}`,
            wallet_name: row.account || "",
            category_name: row.category,
            payment_method_name: row.payment_method,
            vendor_name: row.vendor,
            project_name: row.project,
            location_name: row.location,
            transaction_date: new Date(row.date).toISOString(), // ensure valid date
            family_id: familyId,
            tags: row.tags || [],
            items: row.items?.map(item => ({
                name: item.itemname,
                amount: item.total,
                quantity: item.quantity,
                unit_price: item.unitprice
            })) || []
        }));

        // Filter out rows without wallet keys (though validation should catch this)
        const validTransactions = transactions.filter(t => t.wallet_name);

        if (validTransactions.length === 0) {
           toast.error("No valid transactions to import (missing wallets?)", { id: toastId });
           setIsProcessing(false);
           return;
        }

        const response = await transactionService.bulkImport({ transactions: validTransactions}, familyId );
        console.log("Bulk Import Response:", response);
        
        // Async Import Handling
        if (response.success_count === 0 && response.failed_count === 0) {
            toast.success(`Import started for ${validTransactions.length} expenses. You will receive a notification when complete.`, { id: toastId });
        } else {
            // Fallback for sync behavior if ever reverted
            toast.success(`Successfully imported ${response.success_count} expenses!`, { id: toastId });
            if (response.failed_count > 0) {
                toast.error(`Failed to import ${response.failed_count} expenses. check logs.`);
            }
        }

        if (onSuccess) onSuccess();

    } catch (error: any) {
        console.error("Bulk Import Error:", error);
        toast.error(`Failed to complete bulk import: ${error.response?.data?.message || error.message}`, { id: toastId });
    } finally {
        setIsProcessing(false);
    }
  };

  const toggleDropdown = () => {
    setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
  };

  const WarningIcon = ({ title }: { title?: string }) => (
    <div className="group/icon relative inline-flex items-center ml-1">
      <AlertTriangle className="w-3 h-3 text-amber-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none z-50">
        {title}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

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

          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm max-w-full">
            <div className="max-h-[500px] overflow-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm z-10 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest w-10"></th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Expense</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Payment</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Vendor</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Items</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tags</th>
                    <th className="px-5 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right sticky right-0 bg-gray-50 dark:bg-gray-800">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {isProcessing ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={12} className="px-5 py-4">
                          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
                        </td>
                      </tr>
                    ))
                  ) : importedData.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr className={`text-sm group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors ${row.isExpanded ? 'bg-gray-50/80 dark:bg-gray-800/80' : ''}`}>
                         <td className="px-5 py-4 text-center">
                          {row.items && row.items.length > 0 && (
                            <button 
                              onClick={() => toggleRowExpansion(row.id)}
                              className="text-gray-400 hover:text-brand-600 transition-colors"
                            >
                              {row.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          )}
                        </td>
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
                        <td className="px-5 py-4 font-black text-gray-900 dark:text-white max-w-[200px] truncate" title={row.name}>{row.name}</td>
                        <td className="px-5 py-4 font-black text-brand-600">₹{row.amount}</td>
                        <td className="px-5 py-4 text-gray-500 font-medium whitespace-nowrap">{row.date}</td>
                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300 text-xs">
                            <span className="flex items-center">
                                {row.category}
                                {row.warnings?.category && <WarningIcon title={row.warnings.category} />}
                            </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                             <span className="flex items-center">
                                {row.account || '-'}
                                {row.warnings?.account && <WarningIcon title={row.warnings.account} />}
                            </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                             <span className="flex items-center">
                                {row.payment_method || '-'}
                                {row.warnings?.payment_method && <WarningIcon title={row.warnings.payment_method} />}
                            </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                            <span className="flex items-center">
                                {row.vendor || '-'}
                                {row.warnings?.vendor && <WarningIcon title={row.warnings.vendor} />}
                            </span>
                        </td>
                        <td className="px-5 py-4 text-gray-600 font-bold text-xs">
                          {row.items?.length ? `${row.items.length} Items` : '-'}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {row.tags && row.tags.length > 0 ? (
                              row.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200 dark:border-gray-700">
                                  {tag}
                                </span>
                              ))
                            ) : '-'}
                             {row.warnings?.tags && <WarningIcon title={row.warnings.tags} />}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right sticky right-0 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors">
                          <button 
                            onClick={() => removeRow(row.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {row.isExpanded && row.items && row.items.length > 0 && (
                        <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                          <td colSpan={12} className="px-10 py-4">
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                  <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Item Name</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Quantity</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Unit Price</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Total</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                  {row.items.map((item, idx) => (
                                    <tr key={idx} className="text-xs">
                                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{item.itemname}</td>
                                      <td className="px-4 py-3 text-gray-500 text-right">{item.quantity}</td>
                                      <td className="px-4 py-3 text-gray-500 text-right">₹{item.unitprice}</td>
                                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white text-right">₹{item.total}</td>
                                      <td className="px-4 py-3 text-right sticky right-0 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors">
                                        <button 
                                          onClick={() => removeItem(row.id, item.itemname)}
                                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
                disabled={isProcessing || importedData.filter(r => r.status === 'valid').length === 0}
                className="bg-brand-600 hover:bg-brand-500 text-white rounded-2xl px-12 font-bold shadow-xl shadow-brand-500/20 py-3 h-auto"
              >
                {isProcessing ? "Processing..." : `Confirm Import (${importedData.filter(r => r.status === 'valid').length})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
