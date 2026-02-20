"use client";
import React, { useState } from "react";
import { FileText, Check, Upload, Shield, X } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

import { taxService } from "@/services/taxService";
import toast from "react-hot-toast";

interface AddDocumentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    familyId?: string;
}

export const AddDocumentForm: React.FC<AddDocumentFormProps> = ({
    onSuccess,
    onCancel,
    familyId,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        category: "Receipt",
        year: new Date().getFullYear().toString(),
        remarks: "",
    });

    const categories = [
        { value: "Receipt", label: "Expense Receipt" },
        { value: "Policy", label: "Insurance Policy" },
        { value: "Form 16", label: "Tax Form 16" },
        { value: "Investment Proof", label: "Investment Proof" },
        { value: "Other", label: "Other Financial Record" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!familyId) {
            toast.error("Family ID missing");
            return;
        }

        try {
            await taxService.createDocument({
                family_id: familyId,
                name: formData.name,
                category: formData.category,
                year: formData.year,
                remarks: formData.remarks,
                file_url: "", // Placeholder
            });
            toast.success("Document record created");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to upload document record", error);
            toast.error("Failed to upload document");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Document Name
                        </Label>
                        <Input
                            required
                            placeholder="e.g. Amazon Electronics Invoice"
                            value={formData.name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Category
                        </Label>
                        <Select
                            options={categories}
                            defaultValue={formData.category}
                            onChange={(val: string) =>
                                setFormData({ ...formData, category: val })
                            }
                            className="h-12 rounded-2xl"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Financial Year
                        </Label>
                        <Input
                            required
                            placeholder="2025-26"
                            value={formData.year}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    year: e.target.value,
                                })
                            }
                            className="h-12 rounded-2xl font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Files (Mock)
                        </Label>
                        <div className="group flex h-12 cursor-pointer items-center justify-between rounded-2xl border-2 border-dashed border-gray-100 px-4 transition-all hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-900">
                            <span className="text-xs font-bold text-gray-400">
                                Select PDF or Image...
                            </span>
                            <Upload className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                    Remarks / Tags
                </Label>
                <Input
                    placeholder="e.g. Laptop purchase, tax deductible"
                    value={formData.remarks}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="h-12 rounded-2xl"
                />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-800/50 dark:bg-indigo-900/10">
                <Shield className="h-5 w-5 shrink-0 text-indigo-500" />
                <p className="text-[10px] leading-relaxed font-medium text-gray-500 italic dark:text-gray-400">
                    Documents are encrypted at rest. Vault access requires your
                    account password for retrieval.
                </p>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-50 pt-8 dark:border-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-12 rounded-2xl px-8 font-bold text-gray-500"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-12 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-indigo-600"
                >
                    <Check className="h-5 w-5" /> Secure Upload
                </Button>
            </div>
        </form>
    );
};
