"use client";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileSearch, 
  UploadCloud, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  X,
  RefreshCcw
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { expenseService } from "@/services/expenseService";
import toast from "react-hot-toast";
import { ExpenseCategory, PaymentMethod } from "@/types";
import { expenseCategoryService } from "@/services/expenseCategoryService";
import { paymentMethodService } from "@/services/paymentMethodService";

interface AddExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onSuccess, onCancel }) => {
    const {user} = useAuth();
    const familyDetails = user?.family;

    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        amount: 0,
        category: "",
        payment_method: "Cash",
        date: new Date().toISOString().split('T')[0],
        description: ""
    });
  
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");
    const [isCustomPaymentMethod, setIsCustomPaymentMethod] = useState(false);
    const [customPaymentMethodName, setCustomPaymentMethodName] = useState("");
    
    // OCR & File States
    const [scannedFile, setScannedFile] = useState<File | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setScannedFile(acceptedFiles[0]);
      handleMockOCR(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': []
    },
    multiple: false
  });

  const handleMockOCR = (file: File) => {
    console.log(file);
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate OCR delay
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      
      // Auto-populate with mock data
      setFormData(prev => ({
        ...prev,
        name: "BigBasket Groceries (Scanned)",
        amount: 1540.50,
        category: "food"
      }));
    }, 2000);
  };

  const removeFile = () => {
    setScannedFile(null);
    setScanComplete(false);
  };

  // const categories = [
  //   { value: "food", label: "Food & Drinks" },
  //   { value: "housing", label: "Housing" },
  //   { value: "transport", label: "Transport" },
  //   { value: "utilities", label: "Utilities" },
  //   { value: "entertainment", label: "Entertainment" },
  //   { value: "health", label: "Health" },
  //   { value: "custom", label: "+ Add Custom Category" }
  // ];

  // const paymentMethods = [
  //   { value: "Cash", label: "Cash" },
  //   { value: "UPI", label: "UPI" },
  //   { value: "Credit Card", label: "Credit Card" },
  //   { value: "Debit Card", label: "Debit Card" },
  //   { value: "Bank Transfer", label: "Bank Transfer" },
  //   { value: "custom", label: "+ Add Custom Method" }
  // ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const finalData = {
            ...formData,
            category: isCustomCategory ? customCategoryName : formData.category,
            payment_method: isCustomPaymentMethod ? customPaymentMethodName : formData.payment_method
        };

        await expenseService.createExpense(finalData);
        toast.success("Expense added successfully");
        if (onSuccess) onSuccess();
    } catch (error) {
        toast.error("Failed to add expense");
        console.error(error);
    }
  };


  useEffect(() => {
    // Flag to track if component is still mounted
    let isMounted = true;

    const fetchCategories = async (familyId: string) => {
      try {
        const response = await expenseCategoryService.getCategories(familyId);
        // Only update state if component is still mounted
        if (isMounted) {
          setCategories(response);
        }
      } catch (error) {
        // Only log errors if component is still mounted
        if (isMounted) {
          console.error('Failed to fetch categories:', error);
        }
      }
    };

    const fetchPaymentMethods = async (familyId: string) => {
      try {
        const response = await paymentMethodService.getPaymentMethods(familyId);
        // Only update state if component is still mounted
        if (isMounted) {
          setPaymentMethods(response);
        }
      } catch (error) {
        // Only log errors if component is still mounted
        if (isMounted) {
          console.error('Failed to fetch payment methods:', error);
        }
      }
    };

    if (familyDetails && familyDetails.id && familyDetails.id !== "") {
      fetchCategories(familyDetails.id);
      fetchPaymentMethods(familyDetails.id);
    }

    // Cleanup function: mark component as unmounted to prevent state updates
    return () => {
      isMounted = false;
    };
  }, [familyDetails]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Column: OCR Scan Section (4/12) */}
      <div className="lg:col-span-5">
        <div className="sticky top-0 space-y-4">
          <div className="bg-gray-50/50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-8 transition-all hover:border-purple-500/50 h-full flex flex-col justify-center min-h-[300px]">
            {!scannedFile ? (
              <div {...getRootProps()} className="cursor-pointer h-full">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-purple-500/5">
                    {isDragActive ? <UploadCloud className="w-10 h-10 animate-bounce" /> : <Camera className="w-10 h-10" />}
                  </div>
                  <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">
                    Quick Scan
                  </h4>
                  <p className="text-sm text-gray-500 mb-6 max-w-[200px] leading-relaxed">
                    Drop your receipt here to auto-fill the form instantly.
                  </p>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest px-4 py-2 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                    PNG, JPG or PDF
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in zoom-in-95 duration-300">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-green-500/5 transition-opacity duration-1000 ${isScanning ? 'opacity-100' : 'opacity-0'}`}></div>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shadow-sm">
                      {isScanning ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-gray-800 dark:text-white truncate mb-1">
                        {scannedFile.name}
                      </h5>
                      <p className="text-xs text-gray-500 font-medium italic">
                        {isScanning ? "AI Engine Analyzing..." : "Scan Complete • Fields Synced"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/40 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {scanComplete && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleMockOCR(scannedFile)}
                    className="w-full rounded-2xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 flex gap-2 font-bold text-xs uppercase"
                  >
                    <RefreshCcw className="w-4 h-4" /> Re-scan Receipt
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Form Fields (8/12) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Expense name</Label>
            <div className="relative group">
              <Input 
                required
                placeholder="Where did you spend?"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                className="rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all pl-11 h-14"
              />
              <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount (₹)</Label>
            <Input 
              required
              type="number"
              step={0.01}
              placeholder="0.00"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, amount: Number(e.target.value)})}
              className="rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all font-black text-lg h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Category</Label>
            <Select 
              options={categories.map(category => ({value: category.id, label: category.name}))}
              placeholder="Pick a category"
              onChange={(value: string) => {
                if (value === "custom") {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setFormData({...formData, category: value});
                }
              }}
              className="rounded-2xl h-14"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Payment Method</Label>
            <Select 
              options={paymentMethods.map(method => ({value: method.id, label: method.name}))}
              defaultValue="Cash"
              onChange={(value: string) => {
                if (value === "custom") {
                  setIsCustomPaymentMethod(true);
                } else {
                  setIsCustomPaymentMethod(false);
                  setFormData({...formData, payment_method: value});
                }
              }}
              className="rounded-2xl h-14"
            />
          </div>
        </div>

        {/* Conditional Custom Fields */}
        {(isCustomCategory || isCustomPaymentMethod) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-400">
            {isCustomCategory && (
              <div className="space-y-2">
                <Label className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest">New Category Name</Label>
                <Input 
                  required
                  placeholder="e.g. Subscriptions"
                  value={customCategoryName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCategoryName(e.target.value)}
                  className="rounded-2xl border-purple-200 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/10 focus:border-purple-500 transition-all h-14"
                />
              </div>
            )}
            {isCustomPaymentMethod && (
              <div className="space-y-2">
                <Label className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">New Method Name</Label>
                <Input 
                  required
                  placeholder="e.g. Amazon Pay"
                  value={customPaymentMethodName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomPaymentMethodName(e.target.value)}
                  className="rounded-2xl border-blue-200 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 focus:border-blue-500 transition-all h-14"
                />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          <div className="sm:col-span-5 space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Transaction date</Label>
            <Input 
              type="date"
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})}
              className="rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all h-14 font-medium"
            />
          </div>
          <div className="sm:col-span-7 space-y-2">
            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Description (Optional)</Label>
            <textarea 
              rows={1}
              placeholder="Any extra context?"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all min-h-[56px] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="rounded-2xl px-8 h-12 font-bold text-gray-500 hover:text-gray-700"
            >
              Discard
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-xl shadow-purple-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Record Expense
          </Button>
        </div>
      </form>
    </div>
  );
};
