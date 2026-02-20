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
    Plus,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import MultiSelect from "@/components/form/MultiSelect";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import { transactionService } from "@/services/transactionService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import {
    ExpenseCategory,
    PaymentMethod,
    WalletInfoType,
    TransactionType,
    Contact,
    Project,
    Tag as TagType,
    Transaction,
} from "@/types";
import type { Location } from "@/services/organizationService";
import { FieldConfidenceIndicator } from "@/components/shared/FieldConfidenceIndicator";
import { aiService } from "@/services/aiService";

interface AddExpenseFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    onFileSelect?: (hasFile: boolean) => void;
    familyId: string;
    initialData?: Transaction | null;
    prefilledData?: any; // New prop for AI pre-fill
    categories: ExpenseCategory[];
    paymentMethods: PaymentMethod[];
    wallets: WalletInfoType[];
    contacts: Contact[];
    projects: Project[];
    tags: TagType[];
    locations: Location[];
}

export const AddExpenseForm: FC<AddExpenseFormProps> = ({
    onSuccess,
    onCancel,
    onFileSelect,
    familyId,
    initialData,
    prefilledData,
    categories,
    paymentMethods,
    wallets,
    contacts,
    projects,
    tags,
    locations,
}) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        amount: initialData?.amount || 0,
        transaction_date: initialData
            ? new Date(initialData.transaction_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        description: initialData?.description || "",
        category_id: initialData?.category_id || "",
        payment_method_id: initialData?.payment_method_id || "",
        wallet_id: initialData?.wallet_id || "",
        contact_id: initialData?.contact_id || prefilledData?.contact_id || "",
        project_id: initialData?.project_id || prefilledData?.project_id || "",
        location_id:
            initialData?.location_id || prefilledData?.location_id || "",
        tags: initialData?.tags || ([] as string[]),
        family_id: familyId,
        file_id: initialData?.file_id || prefilledData?.file_id || "",
        items: initialData?.items || ([] as any[]),
    });

    const [scannedFile, setScannedFile] = useState<File | null>(null);
    const [scannedFileUrl, setScannedFileUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(!!prefilledData);
    const [analysisData, setAnalysisData] = useState<any>(prefilledData);

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

    const hasAppliedPrefill = React.useRef(false);

    // Initial pre-fill logic
    useEffect(() => {
        if (
            prefilledData &&
            !hasAppliedPrefill.current &&
            (categories.length > 0 || contacts.length > 0)
        ) {
            const analysis = prefilledData;

            // Find matching entities
            const categoryMatch = categories.find(
                (c) =>
                    c.name.toLowerCase() === analysis.category?.toLowerCase() ||
                    analysis.category
                        ?.toLowerCase()
                        .includes(c.name.toLowerCase())
            );

            const contactMatch = contacts.find(
                (c) =>
                    c.name.toLowerCase() ===
                    analysis.merchant_name?.toLowerCase() ||
                    c.name.toLowerCase() === analysis.vendor?.toLowerCase()
            );

            const paymentMatch = paymentMethods.find(
                (p) =>
                    p.name.toLowerCase() ===
                    analysis.payment_method?.toLowerCase() ||
                    analysis.payment_method
                        ?.toLowerCase()
                        .includes(p.name.toLowerCase())
            );

            const locationMatch = locations.find(
                (l) =>
                    l.name.toLowerCase() === analysis.location?.toLowerCase() ||
                    analysis.location
                        ?.toLowerCase()
                        .includes(l.name.toLowerCase())
            );

            setFormData((prev) => ({
                ...prev,
                title: analysis.merchant_name || analysis.vendor || prev.title,
                amount: analysis.amount || prev.amount,
                transaction_date: analysis.date
                    ? new Date(analysis.date).toISOString().split("T")[0]
                    : prev.transaction_date,
                category_id:
                    initialData?.category_id ||
                    categoryMatch?.id ||
                    (analysis.category ? "" : prev.category_id),
                contact_id:
                    initialData?.contact_id ||
                    contactMatch?.id ||
                    (analysis.merchant_name || analysis.vendor
                        ? ""
                        : prev.contact_id),
                payment_method_id:
                    initialData?.payment_method_id ||
                    paymentMatch?.id ||
                    (analysis.payment_method ? "" : prev.payment_method_id),
                location_id:
                    initialData?.location_id ||
                    locationMatch?.id ||
                    (analysis.location ? "" : prev.location_id),
                description:
                    initialData?.description ||
                    analysis.description ||
                    prev.description,
                tags: Array.from(
                    new Set([...prev.tags, ...(analysis.tags || [])])
                ),
                file_id:
                    initialData?.file_id || analysis.file_id || prev.file_id,
                items:
                    initialData?.items ||
                    analysis.line_items?.map((item: any) => ({
                        name: item.description,
                        amount: item.amount,
                        quantity: item.quantity || 1,
                        unit_price: (item.amount || 0) / (item.quantity || 1),
                    })) ||
                    prev.items,
            }));

            if (
                !initialData?.category_id &&
                !categoryMatch &&
                analysis.category
            ) {
                setIsCustomCategory(true);
                setCustomCategoryName(analysis.category || "");
            }

            if (
                !initialData?.contact_id &&
                !contactMatch &&
                (analysis.merchant_name || analysis.vendor)
            ) {
                setIsCustomContact(true);
                setCustomContactName(
                    analysis.merchant_name || analysis.vendor || ""
                );
            }

            if (
                !initialData?.payment_method_id &&
                !paymentMatch &&
                analysis.payment_method
            ) {
                setIsCustomPaymentMethod(true);
                setCustomPaymentMethodName(analysis.payment_method || "");
            }

            if (
                !initialData?.location_id &&
                !locationMatch &&
                analysis.location
            ) {
                setIsCustomLocation(true);
                setCustomLocationName(analysis.location || "");
            }

            setScanComplete(true);
            setAnalysisData(analysis);
            hasAppliedPrefill.current = true;
        }
    }, [
        prefilledData,
        categories,
        contacts,
        paymentMethods,
        locations,
        initialData,
    ]);

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
            "image/*": [],
            "application/pdf": [],
        },
        multiple: false,
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
                const categoryMatch = categories.find(
                    (c) =>
                        c.name.toLowerCase() ===
                        analysis.category?.toLowerCase() ||
                        analysis.category
                            ?.toLowerCase()
                            .includes(c.name.toLowerCase())
                );

                const contactMatch = contacts.find(
                    (c) =>
                        c.name.toLowerCase() ===
                        analysis.merchant_name?.toLowerCase() ||
                        c.name.toLowerCase() === analysis.vendor?.toLowerCase()
                );

                const paymentMatch = paymentMethods.find(
                    (p) =>
                        p.name.toLowerCase() ===
                        analysis.payment_method?.toLowerCase() ||
                        analysis.payment_method
                            ?.toLowerCase()
                            .includes(p.name.toLowerCase())
                );

                const locationMatch = locations.find(
                    (l) =>
                        l.name.toLowerCase() ===
                        analysis.location?.toLowerCase() ||
                        analysis.location
                            ?.toLowerCase()
                            .includes(l.name.toLowerCase())
                );

                setFormData((prev) => ({
                    ...prev,
                    title:
                        analysis.merchant_name || analysis.vendor || prev.title,
                    amount: analysis.amount || prev.amount,
                    transaction_date: analysis.date
                        ? new Date(analysis.date).toISOString().split("T")[0]
                        : prev.transaction_date,
                    category_id: categoryMatch
                        ? categoryMatch.id
                        : analysis.category
                            ? ""
                            : prev.category_id,
                    contact_id: contactMatch
                        ? contactMatch.id
                        : analysis.merchant_name || analysis.vendor
                            ? ""
                            : prev.contact_id,
                    payment_method_id: paymentMatch
                        ? paymentMatch.id
                        : analysis.payment_method
                            ? ""
                            : prev.payment_method_id,
                    location_id: locationMatch
                        ? locationMatch.id
                        : analysis.location
                            ? ""
                            : prev.location_id,
                    description: analysis.description || prev.description,
                    tags: Array.from(
                        new Set([...prev.tags, ...(analysis.tags || [])])
                    ),
                    file_id: result.file_id || prev.file_id,
                    items:
                        analysis.line_items?.map((item: any) => ({
                            name: item.description,
                            amount: item.amount,
                            quantity: item.quantity || 1,
                            unit_price:
                                (item.amount || 0) / (item.quantity || 1),
                        })) || prev.items,
                }));

                // Set custom fields if no match
                if (!categoryMatch && analysis.category) {
                    setIsCustomCategory(true);
                    setCustomCategoryName(analysis.category || "");
                } else {
                    setIsCustomCategory(false);
                    setCustomCategoryName("");
                }

                if (
                    !contactMatch &&
                    (analysis.merchant_name || analysis.vendor)
                ) {
                    setIsCustomContact(true);
                    setCustomContactName(
                        analysis.merchant_name || analysis.vendor || ""
                    );
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
                type: "EXPENSE" as TransactionType,
                title: formData.title,
                amount: Number(formData.amount),
                description: formData.description,
                transaction_date: new Date(
                    formData.transaction_date
                ).toISOString(),
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
                    value: customPaymentMethodName || "",
                },
                contact: {
                    id: formData.contact_id,
                    value: customContactName || "",
                },
                project: {
                    id: formData.project_id,
                    value: customProjectName || "",
                },
                location: {
                    id: formData.location_id,
                    value: customLocationName || "",
                },
                tags: formData.tags,
                items: formData.items.map((item) => ({
                    name: item.name,
                    amount: Number(item.amount),
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unit_price),
                })),
            };

            if (initialData) {
                await transactionService.updateTransaction(
                    initialData.id,
                    payload
                );
                toast.success("Expense updated successfully");
            } else {
                await transactionService.createTransaction(payload);
                toast.success("Expense added successfully");
            }

            // Invalidate queries
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.EXPENSES, familyId],
            });
            if (isCustomCategory)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.EXPENSE_TYPES, familyId],
                });
            if (isCustomContact)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.CONTACTS, familyId],
                });
            if (isCustomProject)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.PROJECTS, familyId],
                });
            if (isCustomLocation)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.LOCATIONS, familyId],
                });
            if (isCustomPaymentMethod)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.PAYMENT_METHODS, familyId],
                });

            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Failed to add expense");
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left Column: OCR Scan Section (4/12) */}
            <div className="lg:col-span-5">
                <div className="sticky top-0 space-y-4">
                    <div className="flex h-full min-h-[300px] flex-col justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-8 transition-all hover:border-purple-500/50 dark:border-gray-800 dark:bg-gray-900/50">
                        {!scannedFile ? (
                            <div
                                {...getRootProps()}
                                className="h-full cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-inner ring-8 ring-purple-500/5 dark:bg-purple-900/20 dark:text-purple-400">
                                        {isDragActive ? (
                                            <UploadCloud className="h-10 w-10 animate-bounce" />
                                        ) : (
                                            <Camera className="h-10 w-10" />
                                        )}
                                    </div>
                                    <h4 className="mb-2 text-xl font-black text-gray-800 dark:text-white">
                                        Quick Scan
                                    </h4>
                                    <p className="mb-6 max-w-[200px] text-sm leading-relaxed text-gray-500">
                                        Drop your receipt here to auto-fill the
                                        form instantly.
                                    </p>
                                    <span className="rounded-xl bg-purple-50 px-4 py-2 text-xs font-bold tracking-widest text-purple-600 uppercase dark:bg-purple-900/10 dark:text-purple-400">
                                        PNG, JPG or PDF
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in zoom-in-95 space-y-4 duration-300">
                                <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                    <div
                                        className={`absolute inset-0 bg-green-500/5 transition-opacity duration-1000 ${isScanning ? "opacity-100" : "opacity-0"}`}
                                    ></div>
                                    <div className="relative flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600 shadow-sm dark:bg-green-900/20 dark:text-green-400">
                                            {isScanning ? (
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-8 w-8" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            {scannedFileUrl && (
                                                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                                                    {scannedFile.type.startsWith(
                                                        "image"
                                                    ) ? (
                                                        <img
                                                            src={scannedFileUrl}
                                                            alt="Receipt Preview"
                                                            className="h-auto w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-105"
                                                            onClick={() =>
                                                                window.open(
                                                                    scannedFileUrl,
                                                                    "_blank"
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <iframe
                                                            src={scannedFileUrl}
                                                            className="h-[60vh] min-h-[400px] w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-105"
                                                            title="Receipt Preview"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            width="100%"
                                                            height="100%"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <h5 className="mb-1 truncate text-sm font-bold text-gray-800 dark:text-white">
                                                {scannedFile.name}
                                            </h5>
                                            <p className="text-xs font-medium text-gray-500 italic">
                                                {isScanning
                                                    ? "AI Engine Analyzing..."
                                                    : "Scan Complete • Fields Synced"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeFile}
                                        className="absolute top-2 right-2 rounded-lg bg-gray-50 p-1.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 dark:bg-gray-800 dark:hover:bg-red-900/40"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                {scanComplete && (
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleAnalyzeExpense(scannedFile)
                                        }
                                        className="flex w-full gap-2 rounded-2xl border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <RefreshCcw className="h-4 w-4" />{" "}
                                        Re-scan Receipt
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Form Fields (8/12) */}
            <form
                onSubmit={handleSubmit}
                className="flex max-h-[85vh] flex-col lg:col-span-12 xl:col-span-7"
            >
                <div className="scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent flex-1 space-y-6 overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Expense Title
                            </Label>
                            <div className="group relative">
                                <Input
                                    required
                                    placeholder="Where did you spend?"
                                    value={formData.title}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="h-14 rounded-2xl border-gray-200 bg-gray-50 pl-11 transition-all focus:border-purple-500 dark:border-gray-800 dark:bg-gray-900"
                                />
                                <FileSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                            </div>
                            {analysisData?.field_confidence?.merchant_name !==
                                undefined && (
                                    <FieldConfidenceIndicator
                                        confidence={
                                            analysisData.field_confidence
                                                .merchant_name
                                        }
                                        fieldName="merchant_name"
                                    />
                                )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Amount (₹)
                            </Label>
                            <Input
                                required
                                type="number"
                                step={0.01}
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFormData({
                                        ...formData,
                                        amount: Number(e.target.value),
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-200 bg-gray-50 text-lg font-black transition-all focus:border-purple-500 dark:border-gray-800 dark:bg-gray-900"
                            />
                            {analysisData?.field_confidence?.total_amount !==
                                undefined && (
                                    <FieldConfidenceIndicator
                                        confidence={
                                            analysisData.field_confidence
                                                .total_amount
                                        }
                                        fieldName="total_amount"
                                    />
                                )}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Transaction date
                            </Label>
                            <div className="[&_input]:h-14 [&_input]:rounded-2xl [&_input]:border-gray-200 [&_input]:bg-gray-50 [&_input]:px-5 [&_input]:text-sm [&_input]:font-medium [&_input]:transition-all [&_input]:focus:border-purple-500 [&_input]:dark:border-gray-800 [&_input]:dark:bg-gray-900">
                                <DatePicker
                                    id="transaction-date-picker"
                                    mode="single"
                                    defaultDate={formData.transaction_date}
                                    placeholder="Select transaction date"
                                    onChange={(selectedDates, dateStr) => {
                                        if (dateStr) {
                                            setFormData({
                                                ...formData,
                                                transaction_date: dateStr,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Wallet / Account
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className="group relative">
                                    <Select
                                        options={wallets.map((wallet) => ({
                                            value: wallet.id,
                                            label: wallet.name,
                                        }))}
                                        placeholder="Where did the money go from?"
                                        onChange={(value: string) =>
                                            setFormData({
                                                ...formData,
                                                wallet_id: value,
                                            })
                                        }
                                        className="h-14 rounded-2xl pl-11"
                                        value={formData.wallet_id}
                                    />
                                    <Wallet className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        window.open("/accounts", "_blank")
                                    }
                                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 shadow-sm transition-all hover:border-green-500 hover:text-green-500 dark:border-gray-800 dark:bg-gray-900"
                                    title="Add new wallet"
                                >
                                    <Plus className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Category
                            </Label>
                            <Select
                                options={[
                                    ...categories.map((category) => ({
                                        value: category.id,
                                        label: category.name,
                                    })),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Category",
                                    },
                                ]}
                                placeholder="Pick a category"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomCategory(true);
                                        setFormData({
                                            ...formData,
                                            category_id: "",
                                        });
                                    } else {
                                        setIsCustomCategory(false);
                                        setFormData({
                                            ...formData,
                                            category_id: value,
                                        });
                                    }
                                }}
                                value={formData.category_id}
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        {isCustomCategory && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-purple-600 uppercase dark:text-purple-400">
                                    New Category Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Subscriptions"
                                    value={customCategoryName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomCategoryName(e.target.value)}
                                    className="h-14 rounded-2xl border-purple-200 bg-purple-50/20 transition-all focus:border-purple-500 dark:border-purple-900/30 dark:bg-purple-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Payment Method
                            </Label>
                            <Select
                                options={[
                                    ...paymentMethods.map((method) => ({
                                        value: method.id,
                                        label: method.name,
                                    })),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Method",
                                    },
                                ]}
                                placeholder="Pick a payment method"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomPaymentMethod(true);
                                        setFormData({
                                            ...formData,
                                            payment_method_id: "",
                                        });
                                    } else {
                                        setIsCustomPaymentMethod(false);
                                        setFormData({
                                            ...formData,
                                            payment_method_id: value,
                                        });
                                    }
                                }}
                                value={formData.payment_method_id}
                                className="h-14 rounded-2xl"
                            />
                            {analysisData?.field_confidence?.payment_method !==
                                undefined && (
                                    <FieldConfidenceIndicator
                                        confidence={
                                            analysisData.field_confidence
                                                .payment_method
                                        }
                                        fieldName="payment_method"
                                    />
                                )}
                        </div>

                        {isCustomPaymentMethod && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                                    New Method Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Amazon Pay"
                                    value={customPaymentMethodName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setCustomPaymentMethodName(
                                            e.target.value
                                        )
                                    }
                                    className="h-14 rounded-2xl border-blue-200 bg-blue-50/20 transition-all focus:border-blue-500 dark:border-blue-900/30 dark:bg-blue-900/10"
                                />
                            </div>
                        )}

                        <div className="col-span-1 space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Vendor / Recipient
                            </Label>
                            <Select
                                options={[
                                    ...contacts.map((c) => ({
                                        value: c.id,
                                        label: c.name,
                                    })),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Contact",
                                    },
                                ]}
                                placeholder="Who did you pay?"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomContact(true);
                                        setFormData({
                                            ...formData,
                                            contact_id: "",
                                        });
                                    } else {
                                        setIsCustomContact(false);
                                        setFormData({
                                            ...formData,
                                            contact_id: value,
                                        });
                                    }
                                }}
                                value={formData.contact_id}
                                className="h-14 rounded-2xl"
                            />
                            {analysisData?.field_confidence?.vendor !==
                                undefined && (
                                    <FieldConfidenceIndicator
                                        confidence={
                                            analysisData.field_confidence.vendor
                                        }
                                        fieldName="vendor"
                                    />
                                )}
                        </div>

                        {isCustomContact && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-green-600 uppercase dark:text-green-400">
                                    New Contact Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. John Doe"
                                    value={customContactName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomContactName(e.target.value)}
                                    className="h-14 rounded-2xl border-green-200 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Project / Event
                            </Label>
                            <div className="group relative">
                                <Select
                                    options={[
                                        ...projects.map((p) => ({
                                            value: p.id,
                                            label: p.name,
                                        })),
                                        {
                                            value: "custom",
                                            label: "+ Add Custom Project",
                                        },
                                    ]}
                                    placeholder="Link to a project"
                                    onChange={(value: string) => {
                                        if (value === "custom") {
                                            setIsCustomProject(true);
                                            setFormData({
                                                ...formData,
                                                project_id: "",
                                            });
                                        } else {
                                            setIsCustomProject(false);
                                            setFormData({
                                                ...formData,
                                                project_id: value,
                                            });
                                        }
                                    }}
                                    value={formData.project_id}
                                    className="h-14 rounded-2xl pl-11"
                                />
                                <Package className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                            </div>
                        </div>

                        {isCustomProject && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-purple-600 uppercase dark:text-purple-400">
                                    New Project Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Amazon Pay"
                                    value={customProjectName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomProjectName(e.target.value)}
                                    className="h-14 rounded-2xl border-purple-200 bg-purple-50/20 transition-all focus:border-purple-500 dark:border-purple-900/30 dark:bg-purple-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Location
                            </Label>
                            <div className="group relative">
                                <Select
                                    options={[
                                        ...locations.map((l) => ({
                                            value: l.id,
                                            label: l.name,
                                        })),
                                        {
                                            value: "custom",
                                            label: "+ Add Custom Location",
                                        },
                                    ]}
                                    placeholder="Where did you spend?"
                                    onChange={(value: string) => {
                                        if (value === "custom") {
                                            setIsCustomLocation(true);
                                            setFormData({
                                                ...formData,
                                                location_id: "",
                                            });
                                        } else {
                                            setIsCustomLocation(false);
                                            setFormData({
                                                ...formData,
                                                location_id: value,
                                            });
                                        }
                                    }}
                                    value={formData.location_id}
                                    className="h-14 rounded-2xl pl-11"
                                />
                                <MapPin className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                {analysisData?.field_confidence?.location !==
                                    undefined && (
                                        <FieldConfidenceIndicator
                                            confidence={
                                                analysisData.field_confidence
                                                    .location
                                            }
                                            fieldName="location"
                                        />
                                    )}
                            </div>
                        </div>

                        {isCustomLocation && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-purple-600 uppercase dark:text-purple-400">
                                    New Location Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Amazon Pay"
                                    value={customLocationName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomLocationName(e.target.value)}
                                    className="h-14 rounded-2xl border-purple-200 bg-purple-50/20 transition-all focus:border-purple-500 dark:border-purple-900/30 dark:bg-purple-900/10"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
                        <div className="sm:col-span-12">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Tags
                                </Label>
                                <div className="group relative">
                                    <MultiSelect
                                        label=""
                                        options={tags.map((t) => ({
                                            value: t.name,
                                            text: t.name,
                                            selected: formData.tags.includes(
                                                t.name
                                            ),
                                        }))}
                                        onChange={(selected) =>
                                            setFormData({
                                                ...formData,
                                                tags: selected,
                                            })
                                        }
                                        defaultSelected={formData.tags}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 sm:col-span-12">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Description (Optional)
                            </Label>
                            <textarea
                                rows={4}
                                placeholder="Any extra context?"
                                value={formData.description}
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                className="min-h-[56px] w-full resize-none rounded-2xl border-gray-200 bg-gray-50 px-5 py-4 text-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 focus:outline-none dark:border-gray-800 dark:bg-gray-900"
                            />
                        </div>
                    </div>

                    {/* Transaction Items Section */}
                    <div className="space-y-4 border-t border-gray-100 pt-6 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-xs font-black tracking-widest text-gray-900 uppercase dark:text-white">
                                <Package className="h-4 w-4 text-purple-500" />
                                Transaction Items
                            </h4>
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        items: [
                                            ...formData.items,
                                            {
                                                name: "",
                                                amount: 0,
                                                quantity: 1,
                                                unit_price: 0,
                                            },
                                        ],
                                    })
                                }
                                className="text-[10px] font-black tracking-widest text-purple-600 uppercase hover:underline dark:text-purple-400"
                            >
                                + Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="group relative grid grid-cols-12 gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50"
                                >
                                    <div className="col-span-12 space-y-1 sm:col-span-5">
                                        <Label className="text-[8px] font-bold tracking-tight text-gray-400 uppercase">
                                            Item Name
                                        </Label>
                                        <Input
                                            placeholder="E.g. Apple"
                                            value={item.name || ""}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                const newItems = [
                                                    ...formData.items,
                                                ];
                                                newItems[index].name =
                                                    e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    items: newItems,
                                                });
                                            }}
                                            className="h-10 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1 sm:col-span-2">
                                        <Label className="text-[8px] font-bold tracking-tight text-gray-400 uppercase">
                                            Qty
                                        </Label>
                                        <Input
                                            type="number"
                                            value={item.quantity || 0}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                const qty = Number(
                                                    e.target.value
                                                );
                                                const newItems = [
                                                    ...formData.items,
                                                ];
                                                newItems[index].quantity = qty;
                                                newItems[index].amount =
                                                    qty *
                                                    (newItems[index]
                                                        .unit_price || 0);
                                                setFormData({
                                                    ...formData,
                                                    items: newItems,
                                                });
                                            }}
                                            className="h-10 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1 sm:col-span-2">
                                        <Label className="text-[8px] font-bold tracking-tight text-gray-400 uppercase">
                                            Unit Price
                                        </Label>
                                        <Input
                                            type="number"
                                            value={item.unit_price || 0}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) => {
                                                const price = Number(
                                                    e.target.value
                                                );
                                                const newItems = [
                                                    ...formData.items,
                                                ];
                                                newItems[index].unit_price =
                                                    price;
                                                newItems[index].amount =
                                                    price *
                                                    (newItems[index].quantity ||
                                                        0);
                                                setFormData({
                                                    ...formData,
                                                    items: newItems,
                                                });
                                            }}
                                            className="h-10 rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="col-span-4 space-y-1 sm:col-span-2">
                                        <Label className="text-[8px] font-bold tracking-tight text-gray-400 uppercase">
                                            Total
                                        </Label>
                                        <Input
                                            type="number"
                                            value={item.amount || 0}
                                            readOnly
                                            className="h-10 rounded-xl bg-gray-100 text-xs dark:bg-gray-800"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newItems =
                                                formData.items.filter(
                                                    (_, i: number) =>
                                                        i !== index
                                                );
                                            setFormData({
                                                ...formData,
                                                items: newItems,
                                            });
                                        }}
                                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:text-red-500 dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {formData.items.length === 0 && (
                                <p className="rounded-2xl border border-dashed border-gray-100 bg-gray-50/30 py-6 text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase dark:border-gray-800 dark:bg-gray-900/20">
                                    No items added yet. AI will auto-fill if
                                    available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="h-12 rounded-2xl px-8 font-bold text-gray-500 hover:text-gray-700"
                        >
                            Discard
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="h-12 transform rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-12 font-bold text-white shadow-xl shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:from-purple-500 hover:to-blue-500 active:translate-y-0"
                    >
                        {initialData ? "Update Expense" : "Record Expense"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
