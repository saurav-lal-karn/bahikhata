"use client";
import React, { useState, useEffect } from "react";
import {
    Building,
    Bell,
    ShieldAlert,
    Save,
    ArrowLeft,
    Trash2,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { familyService } from "@/services/familyService";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function FamilySettingsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family; // Replace with actual family ID from user context

    const [formData, setFormData] = useState({
        familyName: "",
        currency: "INR",
        budgetAlerts: false,
        weeklyReport: false,
        hidePortfolio: false,
        restrictDeletion: false,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const currencies = [
        { value: "INR", label: "Indian Rupee (₹)" },
        { value: "USD", label: "US Dollar ($)" },
        { value: "EUR", label: "Euro (€)" },
        { value: "GBP", label: "British Pound (£)" },
    ];

    // Fetch family settings on component mount
    useEffect(() => {
        const fetchFamilySettings = async () => {
            try {
                setLoading(true);
                const data = await familyService.getFamily(
                    familyDetails?.id || ""
                );
                setFormData({
                    familyName: data.name,
                    currency: data.currency,
                    budgetAlerts: data.budgetAlerts,
                    weeklyReport: data.weeklyReport,
                    hidePortfolio: data.hidePortfolio,
                    restrictDeletion: data.restrictDeletion,
                });
            } catch (error: any) {
                console.error("Failed to fetch family settings:", error);
                toast.error(error.message || "Failed to load family settings");
            } finally {
                setLoading(false);
            }
        };
        if (familyDetails?.id && familyDetails?.id !== "") {
            fetchFamilySettings();
        }

        // Cleanup
        return () => {
            fetchFamilySettings();
        };
    }, [familyDetails]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await familyService.updateFamilySettings(familyDetails?.id || "", {
                name: formData.familyName,
                currency: formData.currency,
                budgetAlerts: formData.budgetAlerts,
                weeklyReport: formData.weeklyReport,
                hidePortfolio: formData.hidePortfolio,
                restrictDeletion: formData.restrictDeletion,
            });
            toast.success("Family settings saved successfully!");
        } catch (error: any) {
            console.error("Failed to save family settings:", error);
            toast.error(error.message || "Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/family"
                    className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Family Settings
                    </h1>
                    <p className="font-medium text-gray-500">
                        Configure global defaults for your household group.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* General Settings Section */}
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 border-b border-gray-50 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/30">
                        <Building className="h-5 w-5 text-blue-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            General Information
                        </h3>
                    </div>
                    <div className="space-y-6 p-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Family Display Name
                                </Label>
                                <Input
                                    value={formData.familyName}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            familyName: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Smith Household"
                                    className="h-12 rounded-2xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Base Currency
                                </Label>
                                <Select
                                    options={currencies}
                                    defaultValue={formData.currency}
                                    onChange={(val: string) =>
                                        setFormData({
                                            ...formData,
                                            currency: val,
                                        })
                                    }
                                    className="h-12 rounded-2xl"
                                />
                                <p className="text-[10px] font-medium text-gray-400">
                                    All financial calculations will use this
                                    currency.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notification Preferences */}
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 border-b border-gray-50 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/30">
                        <Bell className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Family Notifications
                        </h3>
                    </div>
                    <div className="space-y-6 p-8">
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    Over-budget Alerts
                                </p>
                                <p className="text-xs text-gray-500">
                                    Notify family owner when spending exceeds
                                    90% of budget.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.budgetAlerts}
                                onChange={() =>
                                    setFormData({
                                        ...formData,
                                        budgetAlerts: !formData.budgetAlerts,
                                    })
                                }
                                className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] checked:bg-blue-600 checked:after:left-7"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    Weekly Summary Report
                                </p>
                                <p className="text-xs text-gray-500">
                                    Send an email summary of all transactions to
                                    all members.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.weeklyReport}
                                onChange={() =>
                                    setFormData({
                                        ...formData,
                                        weeklyReport: !formData.weeklyReport,
                                    })
                                }
                                className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] checked:bg-blue-600 checked:after:left-7"
                            />
                        </div>
                    </div>
                </section>

                {/* Granular Permissions Section */}
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 border-b border-gray-50 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/30">
                        <ShieldAlert className="h-5 w-5 text-emerald-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">
                            Privacy & Permissions
                        </h3>
                    </div>
                    <div className="space-y-6 p-8">
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    Hide Investment Portfolio
                                </p>
                                <p className="text-xs text-gray-500">
                                    Only family owner can see the detailed
                                    investment breakdown.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.hidePortfolio}
                                onChange={() =>
                                    setFormData({
                                        ...formData,
                                        hidePortfolio: !formData.hidePortfolio,
                                    })
                                }
                                className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] checked:bg-emerald-600 checked:after:left-7"
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    Restrict Transaction Deletion
                                </p>
                                <p className="text-xs text-gray-500">
                                    Only Admin and Owner can delete existing
                                    records.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.restrictDeletion}
                                onChange={() =>
                                    setFormData({
                                        ...formData,
                                        restrictDeletion:
                                            !formData.restrictDeletion,
                                    })
                                }
                                className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] checked:bg-emerald-600 checked:after:left-7"
                            />
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="overflow-hidden rounded-3xl border border-red-100 bg-red-50/10 dark:border-red-900/30 dark:bg-red-900/5">
                    <div className="flex items-center gap-3 border-b border-red-50 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-900/20">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        <h3 className="font-bold text-red-700 dark:text-red-400">
                            Danger Zone
                        </h3>
                    </div>
                    <div className="space-y-6 p-8">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-800 dark:text-white">
                                    Transfer Ownership
                                </p>
                                <p className="text-xs text-gray-500">
                                    Hand over the administrative controls to
                                    another member.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="rounded-xl border-red-200 px-6 text-xs font-bold text-red-600 uppercase hover:bg-red-50"
                            >
                                Transfer Control
                            </Button>
                        </div>

                        <div className="flex flex-col justify-between gap-4 border-t border-red-100 pt-6 md:flex-row md:items-center dark:border-red-900/30">
                            <div className="space-y-1">
                                <p className="text-sm leading-tight font-bold text-gray-800 dark:text-white">
                                    Delete Family Account
                                </p>
                                <p className="text-xs font-medium text-gray-400">
                                    Permanently delete all expenses, income, and
                                    member data. This action is irreversible.
                                </p>
                            </div>
                            <Button className="gap-2 rounded-xl bg-red-600 px-6 text-xs font-bold text-white uppercase hover:bg-red-700">
                                <Trash2 className="h-4 w-4" /> Delete Family
                            </Button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-12 font-bold text-white shadow-xl shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />{" "}
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
