"use client";
import React, { useState, useRef, Fragment, FC } from "react";
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
import {
    ExpenseCategory,
    PaymentMethod,
    WalletInfoType,
    Contact,
    Project,
    Tag,
} from "@/types";
import { Location } from "@/services/organizationService";
import { transactionService } from "@/services/transactionService";
import toast from "react-hot-toast";

interface BulkImportExpensesProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    onFileSelect?: (hasFile: boolean) => void;
    familyId: string;
    categories: ExpenseCategory[];
    wallets: WalletInfoType[];
    paymentMethods: PaymentMethod[];
    contacts: Contact[];
    projects: Project[];
    tags: Tag[];
    locations: Location[];
}

interface Item {
    itemname: string;
    quantity: number;
    unitprice: number;
    total: number;
}

interface ImportedExpense {
    id: string;
    title: string;
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
    status: "valid" | "invalid";
    error?: string;
    warnings?: Record<string, string>;
    isExpanded?: boolean;
}

export const BulkImportExpenses: FC<BulkImportExpensesProps> = ({
    onSuccess,
    onCancel,
    onFileSelect,
    familyId,
    categories,
    wallets,
    paymentMethods,
    contacts,
    projects,
    tags,
    locations,
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
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
        },
        multiple: false,
    });

    const parseJsonField = (field: any): any => {
        if (!field) return undefined;
        if (typeof field === "object") return field;
        try {
            return JSON.parse(field);
        } catch (e) {
            console.warn("Failed to parse JSON field:", field, e);
            return undefined;
        }
    };

    const validateRow = (row: any, index: number): ImportedExpense => {
        const id = `row-${index}-${Date.now()}`;
        const title = row.title || row.Title || "";
        const amountStr = row.amount || row.Amount || "";
        const categoryName = row.category || row.Category || "Uncategorized";
        let dateStr = row.date || row.Date || "";

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

        const rowTags = Array.isArray(parseJsonField(tagsRaw))
            ? parseJsonField(tagsRaw)
            : [];
        const items = Array.isArray(parseJsonField(itemsRaw))
            ? parseJsonField(itemsRaw)
            : [];

        let status: "valid" | "invalid" = "valid";
        let error = "";
        const warnings: Record<string, string> = {};

        // Validate Name
        if (!title || typeof title !== "string" || title.trim() === "") {
            status = "invalid";
            error = "Missing title";
        }

        // Validate Amount
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            status = "invalid";
            error = "Invalid amount";
        }

        // Validate Date
        if (!dateStr) {
            status = "invalid";
            error = "Missing date";
        } else {
            if (typeof dateStr === "number") {
                const date = new Date(
                    Math.round((dateStr - 25569) * 86400 * 1000)
                );
                dateStr = date.toISOString().split("T")[0];
            } else if (new Date(dateStr).toString() === "Invalid Date") {
                status = "invalid";
                error = "Invalid date format";
            }
        }

        // Entity Validation - Check if they exist in props
        if (
            categoryName &&
            !categories.some(
                (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            )
        ) {
            warnings["category"] = `New category will be created`;
        }

        if (
            accountName &&
            !wallets.some(
                (w) => w.name.toLowerCase() === accountName.toLowerCase()
            )
        ) {
            warnings["account"] = `New wallet will be created`;
        }

        if (
            paymentMethodName &&
            !paymentMethods.some(
                (pm) =>
                    pm.name.toLowerCase() === paymentMethodName.toLowerCase()
            )
        ) {
            warnings["payment_method"] = `New payment method will be created`;
        }

        if (
            vendorName &&
            !contacts.some(
                (c) => c.name.toLowerCase() === vendorName.toLowerCase()
            )
        ) {
            warnings["vendor"] = `New vendor will be created`;
        }

        if (
            projectName &&
            !projects.some(
                (p) => p.name.toLowerCase() === projectName.toLowerCase()
            )
        ) {
            warnings["project"] = `New project will be created`;
        }

        if (
            locationName &&
            !locations.some(
                (l) => l.name.toLowerCase() === locationName.toLowerCase()
            )
        ) {
            warnings["location"] = `New location will be created`;
        }

        // For tags, check each tag
        if (rowTags.length > 0) {
            const newTags = rowTags.filter(
                (t: string) =>
                    !tags.some(
                        (existing) =>
                            existing.name.toLowerCase() === t.toLowerCase()
                    )
            );
            if (newTags.length > 0) {
                warnings["tags"] =
                    `${newTags.length} new tag(s) will be created`;
            }
        }

        return {
            id,
            title,
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
            isExpanded: false,
        };
    };

    const handleFileSelection = async (selectedFile: File) => {
        setFile(selectedFile);
        setIsProcessing(true);
        setImportedData([]);
        if (onFileSelect) onFileSelect(true);

        try {
            if (selectedFile.name.endsWith(".csv")) {
                Papa.parse(selectedFile, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const parsedData = results.data.map(
                            (row: any, index: number) => validateRow(row, index)
                        );
                        setImportedData(parsedData);
                        setIsProcessing(false);
                    },
                    error: (error) => {
                        console.error("CSV Parse Error:", error);
                        setIsProcessing(false);
                    },
                });
            } else if (selectedFile.name.endsWith(".xlsx")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target?.result;
                    if (data) {
                        const workbook = XLSX.read(data, { type: "binary" });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        const parsedData = jsonData.map(
                            (row: any, index: number) => validateRow(row, index)
                        );
                        setImportedData(parsedData);
                    }
                    setIsProcessing(false);
                };
                reader.onerror = () => {
                    console.error("Excel Read Error");
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
        setImportedData((prev) => prev.filter((row) => row.id !== id));
    };

    const removeItem = (id: string, itemName: string) => {
        setImportedData((prev) =>
            prev.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          items: row?.items?.filter(
                              (item) => item.itemname !== itemName
                          ),
                      }
                    : row
            )
        );
    };

    const toggleRowExpansion = (id: string) => {
        setImportedData((prev) =>
            prev.map((row) =>
                row.id === id ? { ...row, isExpanded: !row.isExpanded } : row
            )
        );
    };

    const handleImport = async () => {
        const validData = importedData.filter((row) => row.status === "valid");
        if (validData.length === 0) return;

        setIsProcessing(true);
        const toastId = toast.loading("Processing import...");

        console.log("Starting import for", validData.length, "rows");

        try {
            const transactions = validData.map((row) => ({
                type: "EXPENSE",
                amount: parseFloat(row.amount),
                title: row.title,
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
                items:
                    row.items?.map((item) => ({
                        name: item.itemname,
                        amount: item.total,
                        quantity: item.quantity,
                        unit_price: item.unitprice,
                    })) || [],
            }));

            // Filter out rows without wallet keys (though validation should catch this)
            const validTransactions = transactions.filter((t) => t.wallet_name);

            if (validTransactions.length === 0) {
                toast.error(
                    "No valid transactions to import (missing wallets?)",
                    {
                        id: toastId,
                    }
                );
                setIsProcessing(false);
                return;
            }

            const response = await transactionService.bulkImport(
                { transactions: validTransactions },
                familyId
            );
            console.log("Bulk Import Response:", response);

            // Async Import Handling
            if (response.success_count === 0 && response.failed_count === 0) {
                toast.success(
                    `Import started for ${validTransactions.length} expenses. You will receive a notification when complete.`,
                    { id: toastId }
                );
            } else {
                // Fallback for sync behavior if ever reverted
                toast.success(
                    `Successfully imported ${response.success_count} expenses!`,
                    { id: toastId }
                );
                if (response.failed_count > 0) {
                    toast.error(
                        `Failed to import ${response.failed_count} expenses. check logs.`
                    );
                }
            }

            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error("Bulk Import Error:", error);
            toast.error(
                `Failed to complete bulk import: ${error.response?.data?.message || error.message}`,
                { id: toastId }
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleDropdown = () => {
        setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
    };

    const WarningIcon = ({ title }: { title?: string }) => (
        <div className="group/icon relative ml-1 inline-flex items-center">
            <AlertTriangle className="h-3 w-3 cursor-help text-amber-500" />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover/icon:opacity-100">
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
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
                            isDragActive
                                ? "border-brand-500 bg-brand-50/10"
                                : "hover:border-brand-500 border-gray-200 hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                        }`}
                    >
                        <input {...getInputProps()} />
                        <div className="bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                            <Upload className="h-10 w-10" />
                        </div>
                        <h4 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                            Upload Data File
                        </h4>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Selected CSV or Excel files will be scanned and
                            validated before import.
                        </p>
                        <div className="flex gap-4">
                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400">
                                .CSV
                            </span>
                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-400">
                                .XLSX
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                                <FileSpreadsheet className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                                    Need a template?
                                </p>
                                <p className="text-xs font-medium text-blue-700/70 dark:text-blue-400/70">
                                    Download our CSV or Excel template to ensure
                                    smooth import.
                                </p>
                            </div>
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <Button
                                variant="outline"
                                onClick={toggleDropdown}
                                className="dropdown-toggle gap-2 rounded-xl border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100"
                            >
                                <Download className="h-4 w-4" /> Templates{" "}
                                <ChevronDown className="h-3 w-3" />
                            </Button>

                            <Dropdown
                                isOpen={isTemplateDropdownOpen}
                                onClose={() => setIsTemplateDropdownOpen(false)}
                                className="right-0 w-48"
                            >
                                <div className="p-1">
                                    <DropdownItem
                                        tag="a"
                                        href="/data/expense_template.csv"
                                        className="rounded-lg text-xs font-medium"
                                        onClick={() =>
                                            setIsTemplateDropdownOpen(false)
                                        }
                                    >
                                        Download CSV Template
                                    </DropdownItem>
                                    <DropdownItem
                                        tag="a"
                                        href="/data/expense_template.xlsx"
                                        className="rounded-lg text-xs font-medium"
                                        onClick={() =>
                                            setIsTemplateDropdownOpen(false)
                                        }
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
                    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20">
                                <FileSpreadsheet className="h-6 w-6" />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white">
                                    {file.name}
                                </h5>
                                <p className="text-xs font-medium tracking-wide text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB •{" "}
                                    {importedData.length} records found
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="max-h-[500px] overflow-auto">
                            <table className="w-full min-w-[1200px] border-collapse text-left">
                                <thead className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="w-10 px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase"></th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Expense
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Date
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Category
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Account
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Payment
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Vendor
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Items
                                        </th>
                                        <th className="px-5 py-4 text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                            Tags
                                        </th>
                                        <th className="sticky right-0 bg-gray-50 px-5 py-4 text-right text-[10px] font-black tracking-widest text-gray-500 uppercase dark:bg-gray-800">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {isProcessing
                                        ? Array(5)
                                              .fill(0)
                                              .map((_, i) => (
                                                  <tr
                                                      key={i}
                                                      className="animate-pulse"
                                                  >
                                                      <td
                                                          colSpan={12}
                                                          className="px-5 py-4"
                                                      >
                                                          <div className="h-4 w-full rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                                                      </td>
                                                  </tr>
                                              ))
                                        : importedData.map((row) => (
                                              <Fragment key={row.id}>
                                                  <tr
                                                      className={`group text-sm transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50 ${row.isExpanded ? "bg-gray-50/80 dark:bg-gray-800/80" : ""}`}
                                                  >
                                                      <td className="px-5 py-4 text-center">
                                                          {row.items &&
                                                              row.items.length >
                                                                  0 && (
                                                                  <button
                                                                      onClick={() =>
                                                                          toggleRowExpansion(
                                                                              row.id
                                                                          )
                                                                      }
                                                                      className="hover:text-brand-600 text-gray-400 transition-colors"
                                                                  >
                                                                      {row.isExpanded ? (
                                                                          <ChevronUp className="h-4 w-4" />
                                                                      ) : (
                                                                          <ChevronRight className="h-4 w-4" />
                                                                      )}
                                                                  </button>
                                                              )}
                                                      </td>
                                                      <td className="px-5 py-4">
                                                          {row.status ===
                                                          "valid" ? (
                                                              <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase">
                                                                  <CheckCircle2 className="h-3.5 w-3.5" />{" "}
                                                                  Valid
                                                              </div>
                                                          ) : (
                                                              <div
                                                                  className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase"
                                                                  title={
                                                                      row.error
                                                                  }
                                                              >
                                                                  <AlertCircle className="h-3.5 w-3.5" />{" "}
                                                                  Error
                                                              </div>
                                                          )}
                                                      </td>
                                                      <td
                                                          className="max-w-[200px] truncate px-5 py-4 font-black text-gray-900 dark:text-white"
                                                          title={row.title}
                                                      >
                                                          {row.title}
                                                      </td>
                                                      <td className="text-brand-600 px-5 py-4 font-black">
                                                          ₹{row.amount}
                                                      </td>
                                                      <td className="px-5 py-4 font-medium whitespace-nowrap text-gray-500">
                                                          {row.date}
                                                      </td>
                                                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                                                          <span className="flex items-center">
                                                              {row.category}
                                                              {row.warnings
                                                                  ?.category && (
                                                                  <WarningIcon
                                                                      title={
                                                                          row
                                                                              .warnings
                                                                              .category
                                                                      }
                                                                  />
                                                              )}
                                                          </span>
                                                      </td>
                                                      <td className="px-5 py-4 text-xs text-gray-500">
                                                          <span className="flex items-center">
                                                              {row.account ||
                                                                  "-"}
                                                              {row.warnings
                                                                  ?.account && (
                                                                  <WarningIcon
                                                                      title={
                                                                          row
                                                                              .warnings
                                                                              .account
                                                                      }
                                                                  />
                                                              )}
                                                          </span>
                                                      </td>
                                                      <td className="px-5 py-4 text-xs text-gray-500">
                                                          <span className="flex items-center">
                                                              {row.payment_method ||
                                                                  "-"}
                                                              {row.warnings
                                                                  ?.payment_method && (
                                                                  <WarningIcon
                                                                      title={
                                                                          row
                                                                              .warnings
                                                                              .payment_method
                                                                      }
                                                                  />
                                                              )}
                                                          </span>
                                                      </td>
                                                      <td className="px-5 py-4 text-xs text-gray-500">
                                                          <span className="flex items-center">
                                                              {row.vendor ||
                                                                  "-"}
                                                              {row.warnings
                                                                  ?.vendor && (
                                                                  <WarningIcon
                                                                      title={
                                                                          row
                                                                              .warnings
                                                                              .vendor
                                                                      }
                                                                  />
                                                              )}
                                                          </span>
                                                      </td>
                                                      <td className="px-5 py-4 text-xs font-bold text-gray-600">
                                                          {row.items?.length
                                                              ? `${row.items.length} Items`
                                                              : "-"}
                                                      </td>
                                                      <td className="px-5 py-4">
                                                          <div className="flex max-w-[150px] flex-wrap gap-1">
                                                              {row.tags &&
                                                              row.tags.length >
                                                                  0
                                                                  ? row.tags.map(
                                                                        (
                                                                            tag,
                                                                            idx
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                                            >
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )
                                                                  : "-"}
                                                              {row.warnings
                                                                  ?.tags && (
                                                                  <WarningIcon
                                                                      title={
                                                                          row
                                                                              .warnings
                                                                              .tags
                                                                      }
                                                                  />
                                                              )}
                                                          </div>
                                                      </td>
                                                      <td className="sticky right-0 bg-white px-5 py-4 text-right transition-colors group-hover:bg-gray-50 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                                                          <button
                                                              onClick={() =>
                                                                  removeRow(
                                                                      row.id
                                                                  )
                                                              }
                                                              className="rounded-lg p-2 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
                                                          >
                                                              <Trash2 className="h-4 w-4" />
                                                          </button>
                                                      </td>
                                                  </tr>
                                                  {row.isExpanded &&
                                                      row.items &&
                                                      row.items.length > 0 && (
                                                          <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                                              <td
                                                                  colSpan={12}
                                                                  className="px-10 py-4"
                                                              >
                                                                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                                                                      <table className="w-full text-left">
                                                                          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                                                              <tr>
                                                                                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">
                                                                                      Item
                                                                                      Name
                                                                                  </th>
                                                                                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                                                                      Quantity
                                                                                  </th>
                                                                                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                                                                      Unit
                                                                                      Price
                                                                                  </th>
                                                                                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                                                                      Total
                                                                                  </th>
                                                                                  <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase">
                                                                                      Actions
                                                                                  </th>
                                                                              </tr>
                                                                          </thead>
                                                                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                                                              {row.items.map(
                                                                                  (
                                                                                      item,
                                                                                      idx
                                                                                  ) => (
                                                                                      <tr
                                                                                          key={
                                                                                              idx
                                                                                          }
                                                                                          className="text-xs"
                                                                                      >
                                                                                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                                                              {
                                                                                                  item.itemname
                                                                                              }
                                                                                          </td>
                                                                                          <td className="px-4 py-3 text-right text-gray-500">
                                                                                              {
                                                                                                  item.quantity
                                                                                              }
                                                                                          </td>
                                                                                          <td className="px-4 py-3 text-right text-gray-500">
                                                                                              ₹
                                                                                              {
                                                                                                  item.unitprice
                                                                                              }
                                                                                          </td>
                                                                                          <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                                                                                              ₹
                                                                                              {
                                                                                                  item.total
                                                                                              }
                                                                                          </td>
                                                                                          <td className="sticky right-0 bg-white px-4 py-3 text-right transition-colors group-hover:bg-gray-50 dark:bg-gray-900 dark:group-hover:bg-gray-800">
                                                                                              <button
                                                                                                  onClick={() =>
                                                                                                      removeItem(
                                                                                                          row.id,
                                                                                                          item.itemname
                                                                                                      )
                                                                                                  }
                                                                                                  className="rounded-lg p-2 text-gray-300 transition-all hover:bg-red-50 hover:text-red-500"
                                                                                              >
                                                                                                  <Trash2 className="h-4 w-4" />
                                                                                              </button>
                                                                                          </td>
                                                                                      </tr>
                                                                                  )
                                                                              )}
                                                                          </tbody>
                                                                      </table>
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      )}
                                              </Fragment>
                                          ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    {
                                        importedData.filter(
                                            (r) => r.status === "valid"
                                        ).length
                                    }{" "}
                                    Ready
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                                    {
                                        importedData.filter(
                                            (r) => r.status === "invalid"
                                        ).length
                                    }{" "}
                                    Errors
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
                                disabled={
                                    isProcessing ||
                                    importedData.filter(
                                        (r) => r.status === "valid"
                                    ).length === 0
                                }
                                className="bg-brand-600 hover:bg-brand-500 shadow-brand-500/20 h-auto rounded-2xl px-12 py-3 font-bold text-white shadow-xl"
                            >
                                {isProcessing
                                    ? "Processing..."
                                    : `Confirm Import (${importedData.filter((r) => r.status === "valid").length})`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
