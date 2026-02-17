"use client";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    FileSearch,
    UploadCloud,
    Camera,
    Loader2,
    CheckCircle2,
    X,
    RefreshCcw,
    Wallet,
    MapPin,
    Package,
    Plus
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import { transactionService } from "@/services/transactionService";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import { contactService } from "@/services/contactService";
import { organizationService } from "@/services/organizationService";
import toast from "react-hot-toast";
import { ExpenseCategory, PaymentMethod, WalletInfoType, TransactionType, Contact, Project, Tag as TagType, Transaction } from "@/types";
import type { Location } from "@/services/organizationService";
import { FieldConfidenceIndicator } from "@/components/shared/FieldConfidenceIndicator";
import { aiService } from "@/services/aiService";

interface AddExpenseFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    onFileSelect?: (hasFile: boolean) => void;
    categories?: ExpenseCategory[];
    paymentMethods?: PaymentMethod[];
    wallets?: WalletInfoType[];
    familyId: string;
    initialData?: Transaction | null;
    prefilledData?: any; // New prop for AI pre-fill
    contacts?: Contact[];
    projects?: Project[];
    tags?: TagType[];
    locations?: Location[];
}

export const AddExpenseForm: FC<AddExpenseFormProps> = ({
    onSuccess,
    onCancel,
    onFileSelect,
    categories = [],
    paymentMethods = [],
    wallets = [],
    familyId,
    initialData,
    prefilledData,
    contacts: propContacts,
    projects: propProjects,
    tags: propTags,
    locations: propLocations
}) => {
    const [contacts, setContacts] = useState<Contact[]>(propContacts || []);
    const [projects, setProjects] = useState<Project[]>(propProjects || []);
    const [tags, setTags] = useState<TagType[]>(propTags || []);
    const [locations, setLocations] = useState<Location[]>(propLocations || []);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        amount: initialData?.amount || 0,
        transaction_date: initialData ? new Date(initialData.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData?.description || "",
        category_id: initialData?.category_id || "",
        payment_method_id: initialData?.payment_method_id || "",
        wallet_id: initialData?.wallet_id || "",
        contact_id: initialData?.contact_id || prefilledData?.contact_id || "",
        project_id: initialData?.project_id || prefilledData?.project_id || "",
        location_id: initialData?.location_id || prefilledData?.location_id || "",
        tags: initialData?.tags || [] as string[],
        family_id: familyId,
        file_id: initialData?.file_id || prefilledData?.file_id || "",
        items: initialData?.items || [] as any[]
    });

    const [scannedFile, setScannedFile] = useState<File | null>(null);
    const [scannedFileUrl, setScannedFileUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(!!prefilledData);
    const [analysisData, setAnalysisData] = useState<any>(prefilledData);

    const hasAppliedPrefill = React.useRef(false);

    // Initial pre-fill logic
    useEffect(() => {
        if (prefilledData && !hasAppliedPrefill.current && (categories.length > 0 || contacts.length > 0)) {
            const analysis = prefilledData;

            // Find matching entities
            const categoryMatch = categories.find(c =>
                c.name.toLowerCase() === analysis.category?.toLowerCase() ||
                analysis.category?.toLowerCase().includes(c.name.toLowerCase())
            );

            const contactMatch = contacts.find(c =>
                c.name.toLowerCase() === analysis.merchant_name?.toLowerCase() ||
                c.name.toLowerCase() === analysis.vendor?.toLowerCase()
            );

            const paymentMatch = paymentMethods.find(p =>
                p.name.toLowerCase() === analysis.payment_method?.toLowerCase() ||
                analysis.payment_method?.toLowerCase().includes(p.name.toLowerCase())
            );

            const locationMatch = locations.find(l =>
                l.name.toLowerCase() === analysis.location?.toLowerCase() ||
                analysis.location?.toLowerCase().includes(l.name.toLowerCase())
            );

            setFormData(prev => ({
                ...prev,
                title: analysis.merchant_name || analysis.vendor || prev.title,
                amount: analysis.amount || prev.amount,
                transaction_date: analysis.date ? new Date(analysis.date).toISOString().split('T')[0] : prev.transaction_date,
                category_id: initialData?.category_id || categoryMatch?.id || (analysis.category ? "" : prev.category_id),
                contact_id: initialData?.contact_id || contactMatch?.id || (analysis.merchant_name || analysis.vendor ? "" : prev.contact_id),
                payment_method_id: initialData?.payment_method_id || paymentMatch?.id || (analysis.payment_method ? "" : prev.payment_method_id),
                location_id: initialData?.location_id || locationMatch?.id || (analysis.location ? "" : prev.location_id),
                description: initialData?.description || analysis.description || prev.description,
                tags: Array.from(new Set([...prev.tags, ...(analysis.tags || [])])),
                file_id: initialData?.file_id || analysis.file_id || prev.file_id,
                items: initialData?.items || analysis.line_items?.map((item: any) => ({
                    name: item.description,
                    amount: item.amount,
                    quantity: item.quantity || 1,
                    unit_price: (item.amount || 0) / (item.quantity || 1)
                })) || prev.items
            }));

            if (!initialData?.category_id && !categoryMatch && analysis.category) {
                setIsCustomCategory(true);
                setCustomCategoryName(analysis.category || "");
            }

            if (!initialData?.contact_id && !contactMatch && (analysis.merchant_name || analysis.vendor)) {
                setIsCustomContact(true);
                setCustomContactName(analysis.merchant_name || analysis.vendor || "");
            }

            if (!initialData?.payment_method_id && !paymentMatch && analysis.payment_method) {
                setIsCustomPaymentMethod(true);
                setCustomPaymentMethodName(analysis.payment_method || "");
            }

            if (!initialData?.location_id && !locationMatch && analysis.location) {
                setIsCustomLocation(true);
                setCustomLocationName(analysis.location || "");
            }

            setScanComplete(true);
            setAnalysisData(analysis);
            hasAppliedPrefill.current = true;
        }
    }, [prefilledData, categories, contacts, paymentMethods, locations, initialData]);

    // Sync props with state
    useEffect(() => {
        if (propContacts) setContacts(propContacts);
    }, [propContacts]);

    useEffect(() => {
        if (propProjects) setProjects(propProjects);
    }, [propProjects]);

    useEffect(() => {
        if (propTags) setTags(propTags);
    }, [propTags]);

    useEffect(() => {
        if (propLocations) setLocations(propLocations);
    }, [propLocations]);

    useEffect(() => {
        // Only fetch if props are not provided
        if (propContacts && propProjects && propTags && propLocations) return;

        const fetchData = async () => {
            try {
                const promises = [];
                if (!propContacts) promises.push(contactService.getContacts(familyId).then(setContacts));
                if (!propProjects) promises.push(organizationService.getProjects(familyId).then(setProjects));
                if (!propTags) promises.push(organizationService.getTags(familyId).then(setTags));
                if (!propLocations) promises.push(organizationService.getLocations(familyId).catch(() => []).then(setLocations));

                await Promise.all(promises);
            } catch (error) {
                console.error("Failed to fetch organizational data", error);
            }
        };
        fetchData();
    }, [familyId, propContacts, propProjects, propTags, propLocations]);

    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState("");
    const [isCustomPaymentMethod, setIsCustomPaymentMethod] = useState(false);
    const [customPaymentMethodName, setCustomPaymentMethodName] = useState("");
    const [isCustomContact, setIsCustomContact] = useState(false);
    const [customContactName, setCustomContactName] = useState("");
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [customLocationName, setCustomLocationName] = useState("");
    const [isCustomProject, setIsCustomProject] = useState(false);
    const [customProjectName, setCustomProjectName] = useState("");

    // OCR & File States are already declared above

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setScannedFile(acceptedFiles[0]);
            handleAnalyzeExpense(acceptedFiles[0]);
            setScannedFileUrl(URL.createObjectURL(acceptedFiles[0]));
            if (onFileSelect) onFileSelect(true);
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

    const handleAnalyzeExpense = async (file: File) => {
        setIsScanning(true);
        setScanComplete(false);

        try {
            const result = await aiService.analyzeExpenseFile(file, familyId);
            console.log("Analysis result:", result);
            const analysis = result.analysis;
            setAnalysisData(analysis);

            if (analysis) {
                // Find matching entities
                const categoryMatch = categories.find(c =>
                    c.name.toLowerCase() === analysis.category?.toLowerCase() ||
                    analysis.category?.toLowerCase().includes(c.name.toLowerCase())
                );

                const contactMatch = contacts.find(c =>
                    c.name.toLowerCase() === analysis.merchant_name?.toLowerCase() ||
                    c.name.toLowerCase() === analysis.vendor?.toLowerCase()
                );

                const paymentMatch = paymentMethods.find(p =>
                    p.name.toLowerCase() === analysis.payment_method?.toLowerCase() ||
                    analysis.payment_method?.toLowerCase().includes(p.name.toLowerCase())
                );

                const locationMatch = locations.find(l =>
                    l.name.toLowerCase() === analysis.location?.toLowerCase() ||
                    analysis.location?.toLowerCase().includes(l.name.toLowerCase())
                );

                setFormData(prev => ({
                    ...prev,
                    title: analysis.merchant_name || analysis.vendor || prev.title,
                    amount: analysis.amount || prev.amount,
                    transaction_date: analysis.date ? new Date(analysis.date).toISOString().split('T')[0] : prev.transaction_date,
                    category_id: categoryMatch ? categoryMatch.id : (analysis.category ? "" : prev.category_id),
                    contact_id: contactMatch ? contactMatch.id : (analysis.merchant_name || analysis.vendor ? "" : prev.contact_id),
                    payment_method_id: paymentMatch ? paymentMatch.id : (analysis.payment_method ? "" : prev.payment_method_id),
                    location_id: locationMatch ? locationMatch.id : (analysis.location ? "" : prev.location_id),
                    description: analysis.description || prev.description,
                    tags: Array.from(new Set([...prev.tags, ...(analysis.tags || [])])),
                    file_id: result.file_id || prev.file_id,
                    items: analysis.line_items?.map((item: any) => ({
                        name: item.description,
                        amount: item.amount,
                        quantity: item.quantity || 1,
                        unit_price: (item.amount || 0) / (item.quantity || 1)
                    })) || prev.items
                }));

                // Set custom fields if no match
                if (!categoryMatch && analysis.category) {
                    setIsCustomCategory(true);
                    setCustomCategoryName(analysis.category || "");
                } else {
                    setIsCustomCategory(false);
                    setCustomCategoryName("");
                }

                if (!contactMatch && (analysis.merchant_name || analysis.vendor)) {
                    setIsCustomContact(true);
                    setCustomContactName(analysis.merchant_name || analysis.vendor || "");
                } else {
                    setIsCustomContact(false);
                    setCustomContactName("");
                }

                if (!paymentMatch && analysis.payment_method) {
                    setIsCustomPaymentMethod(true);
                    setCustomPaymentMethodName(analysis.payment_method || "");
                } else {
                    setIsCustomPaymentMethod(false);
                    setCustomPaymentMethodName("");
                }

                if (!locationMatch && analysis.location) {
                    setIsCustomLocation(true);
                    setCustomLocationName(analysis.location || "");
                } else {
                    setIsCustomLocation(false);
                    setCustomLocationName("");
                }
            }

            setScanComplete(true);
            toast.success("Analysis complete! Form updated.");
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Failed to analyze receipt");
        } finally {
            setIsScanning(false);
        }
    };

    const removeFile = () => {
        setScannedFile(null);
        setScanComplete(false);
        setScannedFileUrl(null);
        if (onFileSelect) onFileSelect(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.wallet_id) {
            toast.error("Please select a wallet");
            return;
        }
        try {

            const payload = {
                type: 'EXPENSE' as TransactionType,
                title: formData.title,
                amount: Number(formData.amount),
                description: formData.description,
                transaction_date: new Date(formData.transaction_date).toISOString(),
                wallet_id: formData.wallet_id,
                family_id: familyId,
                file_id: formData.file_id || undefined,
                category_id: formData.category_id,
                payment_method_id: formData.payment_method_id,
                contact_id: formData.contact_id,
                project_id: formData.project_id,
                location_id: formData.location_id,
                category: {
                    id: formData.category_id,
                    value: customCategoryName || "",
                },
                payment_method: {
                    id: formData.payment_method_id,
                    value: customPaymentMethodName || ""
                },
                contact: {
                    id: formData.contact_id,
                    value: customContactName || ""
                },
                project: {
                    id: formData.project_id,
                    value: customProjectName || ""
                },
                location: {
                    id: formData.location_id,
                    value: customLocationName || ""
                },
                tags: formData.tags,
                items: formData.items.map(item => ({
                    name: item.name,
                    amount: Number(item.amount),
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unit_price)
                }))
            };

            if (initialData) {
                await transactionService.updateTransaction(initialData.id, payload);
                toast.success("Expense updated successfully");
            } else {
                await transactionService.createTransaction(payload);
                toast.success("Expense added successfully");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Failed to add expense");
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
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
                                            {
                                                scannedFileUrl && (
                                                    <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                                                        {
                                                            scannedFile.type.startsWith('image') ? (
                                                                <img
                                                                    src={scannedFileUrl}
                                                                    alt="Receipt Preview"
                                                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                                                    onClick={() => window.open(scannedFileUrl, '_blank')}
                                                                />
                                                            ) : (
                                                                <iframe
                                                                    src={scannedFileUrl}
                                                                    className="w-full min-h-[400px] h-[60vh] object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                                                    title="Receipt Preview"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    width="100%"
                                                                    height="100%"
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }


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
                                        onClick={() => handleAnalyzeExpense(scannedFile)}
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
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Expense Title</Label>
                        <div className="relative group">
                            <Input
                                required
                                placeholder="Where did you spend?"
                                value={formData.title}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all pl-11 h-14"
                            />
                            <FileSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        </div>
                        {analysisData?.field_confidence?.merchant_name !== undefined && (
                            <FieldConfidenceIndicator
                                confidence={analysisData.field_confidence.merchant_name}
                                fieldName="merchant_name"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Amount (₹)</Label>
                        <Input
                            required
                            type="number"
                            step={0.01}
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: Number(e.target.value) })}
                            className="rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 transition-all font-black text-lg h-14"
                        />
                        {analysisData?.field_confidence?.total_amount !== undefined && (
                            <FieldConfidenceIndicator
                                confidence={analysisData.field_confidence.total_amount}
                                fieldName="total_amount"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Transaction date</Label>
                        <div className="[&_input]:rounded-2xl [&_input]:border-gray-200 [&_input]:dark:border-gray-800 [&_input]:bg-gray-50 [&_input]:dark:bg-gray-900 [&_input]:focus:border-purple-500 [&_input]:transition-all [&_input]:h-14 [&_input]:font-medium [&_input]:text-sm [&_input]:px-5">
                            <DatePicker
                                id="transaction-date-picker"
                                mode="single"
                                defaultDate={formData.transaction_date}
                                placeholder="Select transaction date"
                                onChange={(selectedDates, dateStr) => {
                                    if (dateStr) {
                                        setFormData({ ...formData, transaction_date: dateStr });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Wallet / Account</Label>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Select
                                    options={wallets.map(wallet => ({ value: wallet.id, label: wallet.name }))}
                                    placeholder="Where did the money go from?"
                                    onChange={(value: string) => setFormData({ ...formData, wallet_id: value })}
                                    className="rounded-2xl h-14 pl-11"
                                    value={formData.wallet_id}
                                />
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10" />
                            </div>
                            <button
                                type="button"
                                onClick={() => window.open('/accounts', '_blank')}
                                className="w-14 h-14 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-green-500 hover:border-green-500 transition-all shadow-sm"
                                title="Add new wallet"
                            >
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Category</Label>
                        <Select
                            options={[
                                ...categories.map(category => ({ value: category.id, label: category.name })),
                                { value: "custom", label: "+ Add Custom Category" }
                            ]}
                            placeholder="Pick a category"
                            onChange={(value: string) => {
                                if (value === "custom") {
                                    setIsCustomCategory(true);
                                    setFormData({ ...formData, category_id: "" });
                                } else {
                                    setIsCustomCategory(false);
                                    setFormData({ ...formData, category_id: value });
                                }
                            }}
                            value={formData.category_id}
                            className="rounded-2xl h-14"
                        />
                    </div>

                    {isCustomCategory && (
                        <div className="space-y-2">
                            <Label className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest">New Category Name</Label>
                            <Input
                                required
                                placeholder="e.g. Subscriptions"
                                value={customCategoryName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomCategoryName(e.target.value)}
                                className="rounded-2xl border-purple-200 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/10 focus:border-purple-500 transition-all h-14"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Payment Method</Label>
                        <Select
                            options={[
                                ...paymentMethods.map(method => ({ value: method.id, label: method.name })),
                                { value: "custom", label: "+ Add Custom Method" }
                            ]}
                            placeholder="Pick a payment method"
                            onChange={(value: string) => {
                                if (value === "custom") {
                                    setIsCustomPaymentMethod(true);
                                    setFormData({ ...formData, payment_method_id: "" });
                                } else {
                                    setIsCustomPaymentMethod(false);
                                    setFormData({ ...formData, payment_method_id: value });
                                }
                            }}
                            value={formData.payment_method_id}
                            className="rounded-2xl h-14"
                        />
                        {analysisData?.field_confidence?.payment_method !== undefined && (
                            <FieldConfidenceIndicator
                                confidence={analysisData.field_confidence.payment_method}
                                fieldName="payment_method"
                            />
                        )}
                    </div>

                    {isCustomPaymentMethod && (
                        <div className="space-y-2">
                            <Label className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">New Method Name</Label>
                            <Input
                                required
                                placeholder="e.g. Amazon Pay"
                                value={customPaymentMethodName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomPaymentMethodName(e.target.value)}
                                className="rounded-2xl border-blue-200 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-900/10 focus:border-blue-500 transition-all h-14"
                            />
                        </div>
                    )}

                    <div className="col-span-1 space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Vendor / Recipient</Label>
                        <Select
                            options={[...contacts.map(c => ({ value: c.id, label: c.name })), { value: "custom", label: "+ Add Custom Contact" }]}
                            placeholder="Who did you pay?"
                            onChange={(value: string) => {
                                if (value === "custom") {
                                    setIsCustomContact(true);
                                    setFormData({ ...formData, contact_id: "" });
                                } else {
                                    setIsCustomContact(false);
                                    setFormData({ ...formData, contact_id: value });
                                }
                            }}
                            value={formData.contact_id}
                            className="rounded-2xl h-14"
                        />
                        {analysisData?.field_confidence?.vendor !== undefined && (
                            <FieldConfidenceIndicator
                                confidence={analysisData.field_confidence.vendor}
                                fieldName="vendor"
                            />
                        )}
                    </div>

                    {isCustomContact && (
                        <div className="space-y-2">
                            <Label className="text-green-600 dark:text-green-400 font-bold text-[10px] uppercase tracking-widest">New Contact Name</Label>
                            <Input
                                required
                                placeholder="e.g. John Doe"
                                value={customContactName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomContactName(e.target.value)}
                                className="rounded-2xl border-green-200 dark:border-green-900/30 bg-green-50/20 dark:bg-green-900/10 focus:border-green-500 transition-all h-14"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Project / Event</Label>
                        <div className="relative group">
                            <Select
                                options={[...projects.map(p => ({ value: p.id, label: p.name })), { value: "custom", label: "+ Add Custom Project" }]}
                                placeholder="Link to a project"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomProject(true);
                                        setFormData({ ...formData, project_id: "" });
                                    } else {
                                        setIsCustomProject(false);
                                        setFormData({ ...formData, project_id: value });
                                    }
                                }}
                                value={formData.project_id}
                                className="rounded-2xl h-14 pl-11"
                            />
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10" />
                        </div>
                    </div>

                    {isCustomProject && (
                        <div className="space-y-2">
                            <Label className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest">New Project Name</Label>
                            <Input
                                required
                                placeholder="e.g. Amazon Pay"
                                value={customProjectName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomProjectName(e.target.value)}
                                className="rounded-2xl border-purple-200 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/10 focus:border-purple-500 transition-all h-14"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Location</Label>
                        <div className="relative group">
                            <Select
                                options={[...locations.map(l => ({ value: l.id, label: l.name })), { value: "custom", label: "+ Add Custom Location" }]}
                                placeholder="Where did you spend?"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomLocation(true);
                                        setFormData({ ...formData, location_id: "" });
                                    } else {
                                        setIsCustomLocation(false);
                                        setFormData({ ...formData, location_id: value });
                                    }
                                }}
                                value={formData.location_id}
                                className="rounded-2xl h-14 pl-11"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors z-10" />
                            {analysisData?.field_confidence?.location !== undefined && (
                                <FieldConfidenceIndicator
                                    confidence={analysisData.field_confidence.location}
                                    fieldName="location"
                                />
                            )}
                        </div>
                    </div>

                    {isCustomLocation && (
                        <div className="space-y-2">
                            <Label className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest">New Location Name</Label>
                            <Input
                                required
                                placeholder="e.g. Amazon Pay"
                                value={customLocationName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomLocationName(e.target.value)}
                                className="rounded-2xl border-purple-200 dark:border-purple-900/30 bg-purple-50/20 dark:bg-purple-900/10 focus:border-purple-500 transition-all h-14"
                            />
                        </div>
                    )}


                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="sm:col-span-12">
                        <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Tags</Label>
                            <div className="relative group">
                                <MultiSelect
                                    label=""
                                    options={tags.map(t => ({
                                        value: t.name,
                                        text: t.name,
                                        selected: formData.tags.includes(t.name)
                                    }))}
                                    onChange={(selected) => setFormData({ ...formData, tags: selected })}
                                    defaultSelected={formData.tags}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="sm:col-span-12 space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Description (Optional)</Label>
                        <textarea
                            rows={4}
                            placeholder="Any extra context?"
                            value={formData.description}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all min-h-[56px] resize-none"

                        />
                    </div>
                </div>

                {/* Transaction Items Section */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Package className="w-4 h-4 text-purple-500" />
                            Transaction Items
                        </h4>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                items: [...formData.items, { name: "", amount: 0, quantity: 1, unit_price: 0 }]
                            })}
                            className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline"
                        >
                            + Add Item
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.items.map((item: any, index: number) => (
                            <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 group relative">
                                <div className="col-span-12 sm:col-span-5 space-y-1">
                                    <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Item Name</Label>
                                    <Input
                                        placeholder="E.g. Apple"
                                        value={item.name || ""}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const newItems = [...formData.items];
                                            newItems[index].name = e.target.value;
                                            setFormData({ ...formData, items: newItems });
                                        }}
                                        className="h-10 text-xs rounded-xl"
                                    />
                                </div>
                                <div className="col-span-4 sm:col-span-2 space-y-1">
                                    <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Qty</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity || 0}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const qty = Number(e.target.value);
                                            const newItems = [...formData.items];
                                            newItems[index].quantity = qty;
                                            newItems[index].amount = qty * (newItems[index].unit_price || 0);
                                            setFormData({ ...formData, items: newItems });
                                        }}
                                        className="h-10 text-xs rounded-xl"
                                    />
                                </div>
                                <div className="col-span-4 sm:col-span-2 space-y-1">
                                    <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Unit Price</Label>
                                    <Input
                                        type="number"
                                        value={item.unit_price || 0}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const price = Number(e.target.value);
                                            const newItems = [...formData.items];
                                            newItems[index].unit_price = price;
                                            newItems[index].amount = price * (newItems[index].quantity || 0);
                                            setFormData({ ...formData, items: newItems });
                                        }}
                                        className="h-10 text-xs rounded-xl"
                                    />
                                </div>
                                <div className="col-span-4 sm:col-span-2 space-y-1">
                                    <Label className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Total</Label>
                                    <Input
                                        type="number"
                                        value={item.amount || 0}
                                        readOnly
                                        className="h-10 text-xs rounded-xl bg-gray-100 dark:bg-gray-800"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newItems = formData.items.filter((_, i: number) => i !== index);
                                        setFormData({ ...formData, items: newItems });
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {formData.items.length === 0 && (
                            <p className="text-center py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-100 dark:border-gray-800">
                                No items added yet. AI will auto-fill if available.
                            </p>
                        )}
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
                        {initialData ? "Update Expense" : "Record Expense"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
