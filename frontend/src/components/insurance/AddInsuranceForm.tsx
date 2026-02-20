"use client";
import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { insuranceService } from "@/services/insuranceService";
import { contactService } from "@/services/contactService";
import { Contact, InsurancePolicyType, RecurringFrequency } from "@/types";
import toast from "react-hot-toast";

interface AddInsuranceFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const AddInsuranceForm: React.FC<AddInsuranceFormProps> = ({
    onSuccess,
    onCancel,
}) => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [formData, setFormData] = useState({
        policy_name: "",
        policy_number: "",
        type: "HEALTH" as InsurancePolicyType,
        premium_amount: "",
        premium_frequency: "MONTHLY" as RecurringFrequency,
        sum_assured: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        contact_id: "",
    });

    useEffect(() => {
        contactService.getContacts("").then(setContacts).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await insuranceService.createPolicy({
                ...formData,
                premium_amount: Number(formData.premium_amount),
                sum_assured: Number(formData.sum_assured),
            });
            toast.success("Insurance policy recorded");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add insurance", error);
            toast.error("Failed to add insurance");
        }
    };

    const types: { value: InsurancePolicyType; label: string }[] = [
        { value: "LIFE", label: "Life Insurance" },
        { value: "HEALTH", label: "Health Insurance" },
        { value: "MOTOR", label: "Motor Insurance" },
        { value: "TRAVEL", label: "Travel Insurance" },
        { value: "PROPERTY", label: "Property Insurance" },
        { value: "OTHER", label: "Other" },
    ];

    const frequencies: { value: RecurringFrequency; label: string }[] = [
        { value: "MONTHLY", label: "Monthly" },
        { value: "QUARTERLY", label: "Quarterly" },
        { value: "YEARLY", label: "Yearly" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Policy Name
                    </Label>
                    <Input
                        required
                        placeholder="e.g. LIC Jeevan Anand"
                        value={formData.policy_name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                                ...formData,
                                policy_name: e.target.value,
                            })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Policy Type
                    </Label>
                    <Select
                        options={types}
                        value={formData.type}
                        onChange={(val: string) =>
                            setFormData({
                                ...formData,
                                type: val as InsurancePolicyType,
                            })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Policy Number
                    </Label>
                    <Input
                        placeholder="ABC123456"
                        value={formData.policy_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                                ...formData,
                                policy_number: e.target.value,
                            })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Provider / Contact
                    </Label>
                    <Select
                        options={[
                            { value: "", label: "Select a provider" },
                            ...contacts.map((c) => ({
                                value: c.id,
                                label: c.name,
                            })),
                        ]}
                        value={formData.contact_id}
                        onChange={(val: string) =>
                            setFormData({ ...formData, contact_id: val })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Premium Amount (₹)
                    </Label>
                    <Input
                        required
                        type="number"
                        placeholder="0.00"
                        value={formData.premium_amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                                ...formData,
                                premium_amount: e.target.value,
                            })
                        }
                        className="h-12 rounded-2xl font-bold text-blue-600"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Frequency
                    </Label>
                    <Select
                        options={frequencies}
                        value={formData.premium_frequency}
                        onChange={(val: string) =>
                            setFormData({
                                ...formData,
                                premium_frequency: val as RecurringFrequency,
                            })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Sum Assured (₹)
                    </Label>
                    <Input
                        required
                        type="number"
                        placeholder="10,00,000"
                        value={formData.sum_assured}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                                ...formData,
                                sum_assured: e.target.value,
                            })
                        }
                        className="h-12 rounded-2xl font-black"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Start Date
                    </Label>
                    <Input
                        required
                        type="date"
                        value={formData.start_date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                                ...formData,
                                start_date: e.target.value,
                            })
                        }
                        className="h-12 rounded-2xl"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-50 pt-6 dark:border-gray-800">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="h-12 rounded-2xl px-8"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="h-12 rounded-2xl bg-blue-600 px-12 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500"
                >
                    <ShieldCheck className="mr-2 h-5 w-5" /> Record Policy
                </Button>
            </div>
        </form>
    );
};
