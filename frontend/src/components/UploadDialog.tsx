"use client";
import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import { Upload, X, Check, Sparkles, FileText, AlertCircle } from "lucide-react";
import { aiService, AnalysisResponse } from "@/services/aiService";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

interface UploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAnalysisComplete?: (data: AnalysisResponse) => void;
}

const CATEGORIES = [
    "Groceries", "Dining Out", "Transportation", "Utilities", "Entertainment",
    "Healthcare", "Shopping", "Travel", "Insurance", "Investments"
];

export const UploadDialog: React.FC<UploadDialogProps> = ({ isOpen, onClose, onAnalysisComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState("");
    const [isAiMode, setIsAiMode] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        if (!isAiMode && !category) {
            toast.error("Please select a category");
            return;
        }

        setIsUploading(true);
        try {
            if (!user?.family?.id) {
                toast.error("Family context missing");
                return;
            }
            const result = await aiService.analyzeFile(file, user.family.id);
            setAnalysisResult(result);
            if (isAiMode && result?.analysis?.category) {
                setCategory(result.analysis.category);
            }
            toast.success("File processed successfully!");
            if (onAnalysisComplete && result) {
                onAnalysisComplete(result);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze file");
        } finally {
            setIsUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setCategory("");
        setAnalysisResult(null);
        setIsUploading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
            <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Upload Document</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Receipts, Bills & More</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* File Dropzone Mockup */}
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer group flex flex-col items-center justify-center gap-3
                            ${file 
                                ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10' 
                                : 'border-gray-200 dark:border-gray-800 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}`}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*,application/pdf"
                        />
                        {file ? (
                            <>
                                <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); reset(); }}
                                    className="absolute top-4 right-4 p-1.5 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 rounded-lg shadow-sm transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-xl flex items-center justify-center transition-all">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-gray-900 dark:text-white">Click to select</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Images or PDFs up to 5MB</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
                        <button
                            onClick={() => setIsAiMode(true)}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${isAiMode ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI Detect
                        </button>
                        <button
                            onClick={() => setIsAiMode(false)}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${!isAiMode ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <span className="w-3.5 h-3.5 flex items-center justify-center">M</span>
                            Manual
                        </button>
                    </div>

                    {/* Category Selection */}
                    {!isAiMode && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Select Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                            >
                                <option value="">Select a category...</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Analysis Progress / Result */}
                    {isUploading && (
                        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex items-center gap-4 animate-pulse">
                            <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
                            <div className="flex-1">
                                <p className="text-sm font-black text-blue-900 dark:text-blue-100 italic">Analyzing document with AI...</p>
                                <div className="h-1 bg-blue-200 dark:bg-blue-800 rounded-full mt-2 overflow-hidden">
                                    <div className="h-full bg-blue-500 w-1/2 animate-infinite-scroll"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {analysisResult?.analysis && (
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-widest">AI Analysis Complete</span>
                                </div>
                                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase">
                                    {Math.round((analysisResult.analysis.confidence || 0) * 100)}% Confidence
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                <span className="text-sm font-medium text-gray-500">Detected Category</span>
                                <span className="text-sm font-black text-emerald-600">{analysisResult.analysis.category || "Unknown"}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 flex gap-3">
                    <button 
                        onClick={handleClose}
                        className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-gray-50 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={!file || isUploading || (!isAiMode && !category)}
                        onClick={handleUpload}
                        className={`flex-2 h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2
                            ${!file || isUploading || (!isAiMode && !category)
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20'}`}
                    >
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                {isAiMode ? "Analyze & Upload" : "Upload Document"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
