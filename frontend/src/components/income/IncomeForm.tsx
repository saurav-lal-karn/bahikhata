"use client";
import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    Clock,
    Plus,
    ArrowUpCircle,
    ShieldCheck,
    FileText,
    Camera,
    UploadCloud,
    Loader2,
    CheckCircle2,
    X,
    RefreshCcw,
    Wallet,
    MapPin,
    Package,
    FileSearch,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import {
    WalletInfoType,
    TransactionType,
    Transaction,
    TransactionCategory,
    Tag as TagType,
    Location as LocationType,
    Contact,
    Project,
    PaymentMethod,
} from "@/types";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface IncomeFormProps {
    familyId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    onFileSelect?: (hasFile: boolean) => void;
    wallets: WalletInfoType[];
    incomeTypes: TransactionCategory[];
    tags: TagType[];
    locations: LocationType[];
    income?: Transaction;
    prefilledData?: any;
    projects: Project[];
    contacts: Contact[];
    paymentMethods: PaymentMethod[];
}

import { transactionService } from "@/services/transactionService";
import { transactionCategoryService } from "@/services/transactionCategoryService";
import DatePicker from "../form/date-picker";
import MultiSelect from "@/components/form/MultiSelect";
import { aiService } from "@/services/aiService";
import { FieldConfidenceIndicator } from "@/components/shared/FieldConfidenceIndicator";

export const IncomeForm: FC<IncomeFormProps> = ({
    onSuccess,
    onCancel,
    onFileSelect,
    wallets,
    incomeTypes,
    familyId,
    income,
    prefilledData,
    tags,
    locations,
    projects,
    contacts,
    paymentMethods,
}) => {
    const queryClient = useQueryClient();

    const [isCustomSource, setIsCustomSource] = useState<boolean>(false);
    const [customSourceName, setCustomSourceName] = useState<string>("");
    const [isCustomContact, setIsCustomContact] = useState<boolean>(false);
    const [customContactName, setCustomContactName] = useState<string>("");
    const [isCustomProject, setIsCustomProject] = useState<boolean>(false);
    const [customProjectName, setCustomProjectName] = useState<string>("");
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [customLocationName, setCustomLocationName] = useState("");
    const [isCustomPaymentMethod, setIsCustomPaymentMethod] = useState(false);
    const [customPaymentMethodName, setCustomPaymentMethodName] = useState("");

    const [scannedFile, setScannedFile] = useState<File | null>(null);
    const [scannedFileUrl, setScannedFileUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(!!prefilledData);
    const [analysisData, setAnalysisData] = useState<any>(prefilledData);

    const isEditing = !!income;
    const hasAppliedPrefill = React.useRef(false);

    const [formData, setFormData] = useState({
        title: income?.title || "",
        amount: income?.amount || 0,
        source_id: income?.category_id || "",
        wallet_id: income?.wallet_id || "",
        date: income?.transaction_date
            ? new Date(income.transaction_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        description: income?.description || "",
        contact_id: income?.contact_id || prefilledData?.contact_id || "",
        project_id: income?.project_id || prefilledData?.project_id || "",
        location_id: income?.location_id || prefilledData?.location_id || "",
        payment_method_id:
            income?.payment_method_id || prefilledData?.payment_method_id || "",
        tags: income?.tags || ([] as string[]),
        family_id: familyId,
        file_id: income?.file_id || prefilledData?.file_id || "",
    });

    // AI pre-fill effect
    useEffect(() => {
        if (
            prefilledData &&
            !hasAppliedPrefill.current &&
            (incomeTypes.length > 0 || contacts.length > 0)
        ) {
            const analysis = prefilledData.analysis || prefilledData;

            // Find matching entities
            const sourceMatch = incomeTypes.find(
                (t) =>
                    t.name.toLowerCase() === analysis.category?.toLowerCase() ||
                    analysis.category
                        ?.toLowerCase()
                        .includes(t.name.toLowerCase())
            );

            const contactMatch = contacts.find(
                (c) =>
                    c.name.toLowerCase() ===
                        analysis.merchant_name?.toLowerCase() ||
                    c.name.toLowerCase() === analysis.vendor?.toLowerCase() ||
                    c.name.toLowerCase() === analysis.payer?.toLowerCase()
            );

            const projectMatch = projects.find(
                (p) =>
                    p.name.toLowerCase() === analysis.project?.toLowerCase() ||
                    analysis.project
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
                title:
                    analysis.merchant_name ||
                    analysis.vendor ||
                    analysis.payer ||
                    prev.title,
                amount: analysis.amount || prev.amount,
                date: analysis.date
                    ? new Date(analysis.date).toISOString().split("T")[0]
                    : prev.date,
                source_id:
                    income?.category_id ||
                    sourceMatch?.id ||
                    (analysis.category ? "" : prev.source_id),
                contact_id:
                    income?.contact_id ||
                    contactMatch?.id ||
                    (analysis.merchant_name || analysis.vendor || analysis.payer
                        ? ""
                        : prev.contact_id),
                project_id:
                    income?.project_id || projectMatch?.id || prev.project_id,
                location_id:
                    income?.location_id ||
                    locationMatch?.id ||
                    prev.location_id,
                description:
                    income?.description ||
                    analysis.description ||
                    prev.description,
                tags: Array.from(
                    new Set([...prev.tags, ...(analysis.tags || [])])
                ),
                file_id: prefilledData.file_id || prev.file_id,
            }));

            if (!income?.category_id && !sourceMatch && analysis.category) {
                setIsCustomSource(true);
                setCustomSourceName(analysis.category || "");
            }

            if (
                !income?.contact_id &&
                !contactMatch &&
                (analysis.merchant_name || analysis.vendor || analysis.payer)
            ) {
                setIsCustomContact(true);
                setCustomContactName(
                    analysis.merchant_name ||
                        analysis.vendor ||
                        analysis.payer ||
                        ""
                );
            }

            if (!income?.location_id && !locationMatch && analysis.location) {
                setIsCustomLocation(true);
                setCustomLocationName(analysis.location || "");
            }

            setScanComplete(true);
            setAnalysisData(analysis);
            hasAppliedPrefill.current = true;
        }
    }, [prefilledData, incomeTypes, contacts, projects, locations, income]);

    const handleAnalyzeIncome = async (file: File) => {
        setIsScanning(true);
        setScanComplete(false);

        try {
            const result = await aiService.analyzeFile(file, familyId);
            const analysis = result.analysis;
            setAnalysisData(analysis);

            if (analysis) {
                const sourceMatch = incomeTypes.find(
                    (t) =>
                        t.name.toLowerCase() ===
                            analysis.category?.toLowerCase() ||
                        analysis.category
                            ?.toLowerCase()
                            .includes(t.name.toLowerCase())
                );

                const contactMatch = contacts.find(
                    (c) =>
                        c.name.toLowerCase() ===
                            analysis.merchant_name?.toLowerCase() ||
                        c.name.toLowerCase() ===
                            analysis.vendor?.toLowerCase() ||
                        c.name.toLowerCase() === analysis.payer?.toLowerCase()
                );

                const projectMatch = projects.find(
                    (p) =>
                        p.name.toLowerCase() ===
                            analysis.project?.toLowerCase() ||
                        analysis.project
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
                        analysis.merchant_name ||
                        analysis.vendor ||
                        analysis.payer ||
                        prev.title,
                    amount: analysis.amount || prev.amount,
                    date: analysis.date
                        ? new Date(analysis.date).toISOString().split("T")[0]
                        : prev.date,
                    source_id: sourceMatch
                        ? sourceMatch.id
                        : analysis.category
                          ? ""
                          : prev.source_id,
                    contact_id: contactMatch
                        ? contactMatch.id
                        : analysis.merchant_name ||
                            analysis.vendor ||
                            analysis.payer
                          ? ""
                          : prev.contact_id,
                    project_id: projectMatch
                        ? projectMatch.id
                        : prev.project_id,
                    location_id: locationMatch
                        ? locationMatch.id
                        : prev.location_id,
                    description: analysis.description || prev.description,
                    tags: Array.from(
                        new Set([...prev.tags, ...(analysis.tags || [])])
                    ),
                    file_id: result.file_id || prev.file_id,
                }));

                if (!sourceMatch && analysis.category) {
                    setIsCustomSource(true);
                    setCustomSourceName(analysis.category || "");
                } else {
                    setIsCustomSource(false);
                    setCustomSourceName("");
                }

                if (
                    !contactMatch &&
                    (analysis.merchant_name ||
                        analysis.vendor ||
                        analysis.payer)
                ) {
                    setIsCustomContact(true);
                    setCustomContactName(
                        analysis.merchant_name ||
                            analysis.vendor ||
                            analysis.payer ||
                            ""
                    );
                } else {
                    setIsCustomContact(false);
                    setCustomContactName("");
                }
            }

            setScanComplete(true);
            toast.success("Analysis complete! Form updated.");
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Failed to analyze document");
        } finally {
            setIsScanning(false);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setScannedFile(acceptedFiles[0]);
            handleAnalyzeIncome(acceptedFiles[0]);
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

    const removeFile = () => {
        setScannedFile(null);
        setScanComplete(false);
        setScannedFileUrl(null);
        if (onFileSelect) onFileSelect(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let categoryId = formData.source_id;

            if (isCustomSource && customSourceName) {
                const newCategory =
                    await transactionCategoryService.createCategory({
                        name: customSourceName,
                        type: "INCOME" as TransactionType,
                        family_id: familyId,
                    });
                categoryId = newCategory.id;
            }

            const payload = {
                type: "INCOME" as TransactionType,
                title: formData.title,
                amount: Number(formData.amount),
                description: formData.description,
                transaction_date: new Date(formData.date).toISOString(),
                wallet_id: formData.wallet_id,
                category_id: categoryId,
                payment_method_id: formData.payment_method_id || "",
                contact_id: formData.contact_id || "",
                project_id: formData.project_id || "",
                location_id: formData.location_id || "",
                tags: formData.tags,
                family_id: familyId,
                file_id: formData.file_id || undefined,
                category: {
                    id: categoryId,
                    value: customSourceName || "",
                },
                payment_method: {
                    id: formData.payment_method_id || "",
                    value: customPaymentMethodName || "",
                },
                contact: {
                    id: formData.contact_id || "",
                    value: customContactName || "",
                },
                project: {
                    id: formData.project_id || "",
                    value: customProjectName || "",
                },
                location: {
                    id: formData.location_id || "",
                    value: customLocationName || "",
                },
                items: [],
            };

            if (isEditing && income?.id) {
                await transactionService.updateTransaction(income.id, payload);
                toast.success("Income updated successfully");
            } else {
                await transactionService.createTransaction(payload);
                toast.success("Income added successfully");
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.INCOMES, familyId],
            });
            if (isCustomSource)
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.INCOME_TYPES, familyId],
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
            toast.error(
                `Failed to ${isEditing ? "update" : "add"} income. Please try again`
            );
        }
    };

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Left Column: OCR Scan Section (5/12) */}
            <div className="lg:col-span-5">
                <div className="sticky top-0 space-y-4">
                    <div className="flex h-full min-h-[300px] flex-col justify-center rounded-3xl border border-dashed border-green-200 bg-green-50/50 p-8 transition-all hover:border-green-500/50 dark:border-green-800/50 dark:bg-green-900/10">
                        {!scannedFile ? (
                            <div
                                {...getRootProps()}
                                className="h-full cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner ring-8 ring-green-500/5 dark:bg-green-900/20 dark:text-green-400">
                                        {isDragActive ? (
                                            <UploadCloud className="h-10 w-10 animate-bounce" />
                                        ) : (
                                            <Camera className="h-10 w-10" />
                                        )}
                                    </div>
                                    <h4 className="mb-2 text-xl font-black text-gray-800 dark:text-white">
                                        Scan Document
                                    </h4>
                                    <p className="mb-6 max-w-[200px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                        Drop your payslip or receipt here to
                                        auto-fill details.
                                    </p>
                                    <span className="rounded-xl bg-green-50 px-4 py-2 text-xs font-bold tracking-widest text-green-600 uppercase dark:bg-green-900/10 dark:text-green-400">
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
                                                <div className="mb-3 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                                                    {scannedFile.type.startsWith(
                                                        "image"
                                                    ) ? (
                                                        <img
                                                            src={scannedFileUrl}
                                                            alt="Document Preview"
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
                                                            className="min-h-[300px] w-full object-cover"
                                                            title="Document Preview"
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
                                            handleAnalyzeIncome(scannedFile)
                                        }
                                        className="flex w-full gap-2 rounded-2xl border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                                    >
                                        <RefreshCcw className="h-4 w-4" />{" "}
                                        Re-scan Document
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Form Fields (7/12) */}
            <form
                onSubmit={handleSubmit}
                className="flex max-h-[85vh] flex-col lg:col-span-7"
            >
                <div className="scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent flex-1 space-y-6 overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Transaction Title
                            </Label>
                            <div className="group relative">
                                <Input
                                    required
                                    placeholder="e.g. Freelance Payout"
                                    value={formData.title}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="h-14 rounded-2xl border-gray-100 bg-gray-50 pl-11 transition-all focus:border-green-500 dark:border-gray-800 dark:bg-gray-900"
                                />
                                <FileSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
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
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        amount: Number(e.target.value),
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 text-lg font-black transition-all focus:border-green-500 dark:border-gray-800 dark:bg-gray-900"
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
                                    defaultDate={formData.date}
                                    placeholder="Select transaction date"
                                    onChange={(selectedDates, dateStr) => {
                                        if (dateStr) {
                                            setFormData({
                                                ...formData,
                                                date: dateStr,
                                            });
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Deposit To
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className="group relative flex-1">
                                    <Select
                                        value={formData.wallet_id}
                                        options={wallets.map(
                                            (wallet: WalletInfoType) => ({
                                                value: wallet.id,
                                                label: wallet.name,
                                            })
                                        )}
                                        onChange={(value: string) => {
                                            setFormData({
                                                ...formData,
                                                wallet_id: value,
                                            });
                                        }}
                                        className="h-14 rounded-2xl pl-11"
                                        placeholder="Select a wallet"
                                    />
                                    <Wallet className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
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
                                Income Source
                            </Label>
                            <Select
                                value={
                                    isCustomSource
                                        ? "custom"
                                        : formData.source_id
                                }
                                options={[
                                    ...incomeTypes.map(
                                        (type: TransactionCategory) => ({
                                            value: type.id,
                                            label: type.name,
                                        })
                                    ),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Source",
                                    },
                                ]}
                                placeholder="Pick a source"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomSource(true);
                                        setFormData({
                                            ...formData,
                                            source_id: "",
                                        });
                                    } else {
                                        setIsCustomSource(false);
                                        setFormData({
                                            ...formData,
                                            source_id: value,
                                        });
                                    }
                                }}
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        {isCustomSource && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-green-600 uppercase dark:text-green-400">
                                    New Source Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Dividend Yield"
                                    value={customSourceName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomSourceName(e.target.value)}
                                    className="h-14 rounded-2xl border-green-100 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Payment Method
                            </Label>
                            <Select
                                value={
                                    isCustomPaymentMethod
                                        ? "custom"
                                        : formData.payment_method_id
                                }
                                options={[
                                    ...paymentMethods.map(
                                        (method: PaymentMethod) => ({
                                            value: method.id,
                                            label: method.name,
                                        })
                                    ),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Payment Method",
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
                                className="h-14 rounded-2xl"
                            />
                        </div>

                        {isCustomPaymentMethod && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-green-600 uppercase dark:text-green-400">
                                    New Payment Method
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Cash, Bank Transfer, etc."
                                    value={customPaymentMethodName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setCustomPaymentMethodName(
                                            e.target.value
                                        )
                                    }
                                    className="h-14 rounded-2xl border-green-100 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Payer / Employer
                            </Label>
                            <Select
                                value={formData.contact_id}
                                options={[
                                    ...contacts.map((c: Contact) => ({
                                        value: c.id,
                                        label: c.name,
                                    })),
                                    {
                                        value: "custom",
                                        label: "+ Add Custom Payer",
                                    },
                                ]}
                                placeholder="Who paid you?"
                                onChange={(value: string) => {
                                    if (value === "custom") {
                                        setIsCustomContact(true);
                                        setFormData({
                                            ...formData,
                                            contact_id: "",
                                        });
                                    } else {
                                        setFormData({
                                            ...formData,
                                            contact_id: value,
                                        });
                                        setIsCustomContact(false);
                                    }
                                }}
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
                                    New Payer Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Acme Corp"
                                    value={customContactName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomContactName(e.target.value)}
                                    className="h-14 rounded-2xl border-green-100 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Project / Event
                            </Label>
                            <div className="group relative">
                                <Select
                                    value={formData.project_id}
                                    options={[
                                        ...projects.map((p: Project) => ({
                                            value: p.id,
                                            label: p.name,
                                        })),
                                        {
                                            value: "custom",
                                            label: "+ Add Custom Project",
                                        },
                                    ]}
                                    onChange={(value: string) => {
                                        if (value === "custom") {
                                            setIsCustomProject(true);
                                            setFormData({
                                                ...formData,
                                                project_id: "",
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                project_id: value,
                                            });
                                            setIsCustomProject(false);
                                        }
                                    }}
                                    className="h-14 rounded-2xl pl-11"
                                    placeholder="Link to project"
                                />
                                <Package className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
                            </div>
                        </div>

                        {isCustomProject && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-green-600 uppercase dark:text-green-400">
                                    New Project Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Side Gig"
                                    value={customProjectName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomProjectName(e.target.value)}
                                    className="h-14 rounded-2xl border-green-100 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Location
                            </Label>
                            <div className="group relative">
                                <Select
                                    value={formData.location_id}
                                    options={[
                                        ...locations.map((l: LocationType) => ({
                                            value: l.id,
                                            label: l.name,
                                        })),
                                        {
                                            value: "custom",
                                            label: "+ Add Custom Location",
                                        },
                                    ]}
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
                                    className="h-14 rounded-2xl pl-11"
                                    placeholder="Where did this happen?"
                                />
                                <MapPin className="absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-500" />
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
                                <Label className="text-[10px] font-bold tracking-widest text-green-600 uppercase dark:text-green-400">
                                    New Location Name
                                </Label>
                                <Input
                                    required
                                    placeholder="e.g. Remote"
                                    value={customLocationName}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                    ) => setCustomLocationName(e.target.value)}
                                    className="h-14 rounded-2xl border-green-100 bg-green-50/20 transition-all focus:border-green-500 dark:border-green-900/30 dark:bg-green-900/10"
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
                                        options={tags.map((t: TagType) => ({
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
                                className="min-h-[56px] w-full resize-none rounded-2xl border-gray-200 bg-gray-50 px-5 py-4 text-sm transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/10 focus:outline-none dark:border-gray-800 dark:bg-gray-900"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-50 pt-6 dark:border-gray-800">
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
                            className="h-12 transform rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-12 font-bold text-white shadow-xl shadow-green-500/20 transition-all hover:-translate-y-0.5 hover:from-green-500 hover:to-emerald-500 active:translate-y-0"
                        >
                            {isEditing ? "Save Changes" : "Add to Balance"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
