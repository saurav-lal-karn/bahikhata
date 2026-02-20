"use client";
import React, { useState } from "react";
import { UserPlus, Mail, Shield, User, Info } from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { familyService } from "@/services/familyService";
import { Family } from "@/types";
import toast from "react-hot-toast";

interface AddFamilyMemberProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    family?: Family;
}

export const AddFamilyMember: React.FC<AddFamilyMemberProps> = ({
    onSuccess,
    onCancel,
    family,
}) => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        role: "Member",
    });

    const roles = [
        { value: "Member", label: "Family Member (Can record & view)" },
        { value: "Admin", label: "Family Admin (Can manage members)" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await familyService.inviteMember({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                familyId: family?.id,
            });
            toast.success("Invitation sent successfully");
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error("Failed to send invitation");
        }
    };

    return (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Context (5/12) */}
            <div className="lg:col-span-5">
                <div className="flex h-full flex-col justify-center space-y-6 rounded-3xl border border-blue-100 bg-blue-50/50 p-8 dark:border-blue-800/50 dark:bg-blue-900/10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner ring-8 ring-blue-500/5 dark:bg-blue-900/20 dark:text-blue-400">
                        <UserPlus className="h-10 w-10" />
                    </div>
                    <div className="text-center">
                        <h4 className="mb-2 text-xl font-black text-gray-800 dark:text-white">
                            Share Data
                        </h4>
                        <p className="mx-auto max-w-[240px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            Collaborate on household budgets by inviting family
                            members.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4">
                        <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                            <Shield className="mt-1 h-5 w-5 shrink-0 text-purple-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-white">
                                    Role Management
                                </p>
                                <p className="text-[10px] font-medium text-gray-400">
                                    Control who can edit or just view data.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                            <Info className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                            <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-white">
                                    Instant Sync
                                </p>
                                <p className="text-[10px] font-medium text-gray-400">
                                    Changes made by members sync instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form (7/12) */}
            <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            First Name
                        </Label>
                        <div className="group relative">
                            <Input
                                required
                                placeholder="e.g. Aakash"
                                value={formData.firstName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 pl-11 transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                            />
                            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                            Last Name
                        </Label>
                        <div className="group relative">
                            <Input
                                required
                                placeholder="e.g. Lalkarn"
                                value={formData.lastName}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50 pl-11 transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                            />
                            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Email Address
                    </Label>
                    <div className="group relative">
                        <Input
                            required
                            type="email"
                            placeholder="member@email.com"
                            value={formData.email}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50 pl-11 transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900"
                        />
                        <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                        Designation & Role
                    </Label>
                    <Select
                        options={roles}
                        defaultValue="Member"
                        onChange={(value: string) =>
                            setFormData({ ...formData, role: value })
                        }
                        className="h-14 rounded-2xl"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="h-12 rounded-2xl px-8 font-bold text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="h-12 transform rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-12 font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 active:translate-y-0"
                    >
                        Send Invitation
                    </Button>
                </div>
            </form>
        </div>
    );
};
