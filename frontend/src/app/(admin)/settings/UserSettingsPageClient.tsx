"use client";
import React, { useState } from "react";
import {
    User,
    Mail,
    Lock,
    Smartphone,
    Bell,
    ShieldCheck,
    CreditCard,
    ChevronRight,
    Camera,
    Moon,
    Sun,
    Laptop,
    Globe,
    Star,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserSettingsPageClient() {
    const { user, checkAuth } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone_number: user?.phone_number || "",
        street: user?.street || "",
        city: user?.city || "",
        state: user?.state || "",
        postal_code: user?.postal_code || "",
        country: user?.country || "",
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Update state when user data loads
    React.useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone_number: user.phone_number || "",
                street: user.street || "",
                city: user.city || "",
                state: user.state || "",
                postal_code: user.postal_code || "",
                country: user.country || "",
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        const toastId = toast.loading("Uploading avatar...");
        try {
            await userService.uploadAvatar(file);
            await checkAuth();
            toast.success("Avatar updated successfully!", { id: toastId });
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload avatar.", { id: toastId });
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        try {
            await userService.updateMe(formData);
            await checkAuth();
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const getAvatarUrl = (url?: string) => {
        if (!url) return "/images/user/owner.jpg";
        if (url.startsWith("http")) return url;
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
        try {
            const urlObj = new URL(apiUrl);
            return `${urlObj.origin}${url}`;
        } catch {
            return url;
        }
    };

    const tabs = [
        {
            id: "profile",
            label: "My Profile",
            icon: <User className="h-4 w-4" />,
        },
        {
            id: "security",
            label: "Security",
            icon: <Lock className="h-4 w-4" />,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
        },
        {
            id: "billing",
            label: "Plan & Billing",
            icon: <CreditCard className="h-4 w-4" />,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                    Account Settings
                </h1>
                <p className="font-medium text-gray-500 italic">
                    Customize your financial workstation and security
                    parameters.
                </p>
            </div>

            <div className="flex flex-col gap-10 lg:flex-row">
                {/* Navigation Sidebar */}
                <aside className="shrink-0 lg:w-72">
                    <nav className="no-scrollbar flex gap-2 overflow-x-auto rounded-[2rem] border border-gray-100 bg-white p-2 shadow-sm lg:flex-col dark:border-gray-800 dark:bg-gray-900">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-black whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="group relative mt-8 hidden overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 to-indigo-800 p-8 text-white shadow-2xl shadow-blue-500/20 lg:block">
                        <Star className="absolute -top-4 -right-4 h-24 w-24 text-white/10 transition-transform duration-700 group-hover:rotate-12" />
                        <h5 className="relative z-10 mb-3 text-xl font-black text-white">
                            Pro Plan
                        </h5>
                        <p className="relative z-10 mb-8 text-xs leading-relaxed font-medium text-white/70">
                            Unlock automated OCR processing and multi-family
                            support.
                        </p>
                        <Button className="relative z-10 w-full rounded-2xl border-none bg-white py-3.5 font-black text-blue-700 shadow-none transition-transform hover:bg-blue-50 active:scale-95">
                            Upgrade Workspace
                        </Button>
                    </div>
                </aside>

                {/* Dynamic Content Area */}
                <main className="flex-1">
                    {activeTab === "profile" && (
                        <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
                            {/* Profile Card */}
                            <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="relative border-b border-gray-50 bg-gray-50/20 p-8 dark:border-gray-800 dark:bg-gray-800/20">
                                    <div className="flex flex-col items-center gap-8 md:flex-row">
                                        <div className="group relative">
                                            <div className="h-32 w-32 overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl transition-transform duration-300 group-hover:scale-105 dark:border-gray-900">
                                                <img
                                                    src={getAvatarUrl(
                                                        user?.avatar_url
                                                    )}
                                                    alt="Avatar"
                                                    className="h-full w-full object-cover"
                                                />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="absolute -right-2 -bottom-2 rounded-2xl border-4 border-white bg-blue-600 p-3 text-white shadow-xl transition-transform hover:scale-110 dark:border-gray-900"
                                            >
                                                <Camera className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h3 className="mb-2 text-3xl font-black text-gray-900 dark:text-white">
                                                {user?.first_name}{" "}
                                                {user?.last_name}
                                            </h3>
                                            <p className="mb-5 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 italic md:justify-start">
                                                <Mail className="h-4 w-4 text-blue-500" />{" "}
                                                {user?.email}
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-emerald-600 uppercase dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                                                    Verified Member
                                                </span>
                                                <span className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-[10px] font-black tracking-[0.15em] text-indigo-600 uppercase dark:border-indigo-800/50 dark:bg-indigo-900/20 dark:text-indigo-400">
                                                    {user?.role === "admin"
                                                        ? "Workspace Admin"
                                                        : "Member"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10 p-8">
                                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                First Name
                                            </Label>
                                            <Input
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                Last Name
                                            </Label>
                                            <Input
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-10 p-8">
                                    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                                        <div className="space-y-3">
                                            <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                Email
                                            </Label>
                                            <Input
                                                value={user?.email || ""}
                                                disabled
                                                className="h-14 cursor-not-allowed rounded-2xl border-none bg-gray-100/50 font-bold opacity-60 dark:bg-gray-800/50"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                Phone Number
                                            </Label>
                                            <Input
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="space-y-10 p-8">
                                    <div className="space-y-6 border-t border-gray-50 pt-6 dark:border-gray-800">
                                        <h4 className="text-sm font-black tracking-widest text-gray-900 uppercase dark:text-white">
                                            Address Details
                                        </h4>
                                        <div className="space-y-3">
                                            <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                Street Address
                                            </Label>
                                            <Input
                                                name="street"
                                                value={formData.street}
                                                onChange={handleChange}
                                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                            <div className="space-y-3">
                                                <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                    City
                                                </Label>
                                                <Input
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                    State
                                                </Label>
                                                <Input
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="pl-1 text-[10px] font-black tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                                    Postal Code
                                                </Label>
                                                <Input
                                                    name="postal_code"
                                                    value={formData.postal_code}
                                                    onChange={handleChange}
                                                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Headline Removed */}
                                <div className="flex justify-end border-t border-gray-50 pt-6 dark:border-gray-800">
                                    <Button
                                        onClick={handleUpdate}
                                        disabled={isLoading}
                                        className="h-14 rounded-2xl bg-blue-600 px-12 font-black text-white shadow-2xl shadow-blue-500/30 transition-all hover:bg-blue-500 active:scale-95"
                                    >
                                        {isLoading
                                            ? "Saving..."
                                            : "Synchronize Profile"}
                                    </Button>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <h4 className="mb-8 text-xl font-black text-gray-800 dark:text-white">
                                    System Preferences
                                </h4>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="group flex cursor-pointer items-center justify-between rounded-3xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-500/30 dark:border-gray-800 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-5">
                                            <div className="rounded-2xl bg-white p-4 text-amber-500 shadow-sm transition-transform group-hover:rotate-6 dark:bg-gray-900">
                                                <Sun className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                                    Visual Mode
                                                </p>
                                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                                    Light Theme Active
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
                                    </div>
                                    <div className="group flex cursor-pointer items-center justify-between rounded-3xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-500/30 dark:border-gray-800 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-5">
                                            <div className="rounded-2xl bg-white p-4 text-purple-600 shadow-sm transition-transform group-hover:rotate-6 dark:bg-gray-900">
                                                <Globe className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                                    Regional Interface
                                                </p>
                                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                                    English (Global)
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="animate-in fade-in slide-in-from-right-4 space-y-8 duration-500">
                            <div className="rounded-[2.5rem] border border-gray-100 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="mb-12 flex items-center gap-6">
                                    <div className="rounded-3xl bg-rose-50 p-4 text-rose-600 shadow-sm dark:bg-rose-900/20 dark:text-rose-400">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl leading-tight font-black text-gray-800 dark:text-white">
                                            Vault Security
                                        </h4>
                                        <p className="mt-1 text-sm font-medium text-gray-500 italic">
                                            Multi-layered account protection.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        {
                                            title: "2-Factor Authentication",
                                            desc: "Adds an extra layer of security using OTP.",
                                            status: "Inactive",
                                            statusColor:
                                                "text-rose-500 bg-rose-500/10 border-rose-500/20",
                                            icon: <Smartphone />,
                                        },
                                        {
                                            title: "Personal Access Tokens",
                                            desc: "Manage API keys for external integrations.",
                                            status: "0 Active",
                                            statusColor:
                                                "text-gray-400 bg-gray-400/10 border-gray-400/20",
                                            icon: <Lock />,
                                        },
                                    ].map((sec, i) => (
                                        <div
                                            key={i}
                                            className="group flex items-center justify-between rounded-3xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-blue-500/20 dark:border-gray-800 dark:bg-gray-900/50"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="text-gray-400 transition-colors group-hover:text-blue-500">
                                                    {React.cloneElement(
                                                        sec.icon as React.ReactElement<any>,
                                                        { className: "w-7 h-7" }
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-gray-800 dark:text-white">
                                                        {sec.title}
                                                    </p>
                                                    <p className="text-[11px] font-medium text-gray-400">
                                                        {sec.desc}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`rounded-full border px-3 py-1 text-[9px] font-black tracking-widest uppercase ${sec.statusColor}`}
                                            >
                                                {sec.status}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="flex items-center justify-between rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-500/20">
                                        <div className="flex items-center gap-6">
                                            <Lock className="h-7 w-7 opacity-80" />
                                            <div>
                                                <p className="text-base font-black">
                                                    Credential Update
                                                </p>
                                                <p className="text-[11px] font-medium text-white/70">
                                                    Last rotated: 4 months ago
                                                </p>
                                            </div>
                                        </div>
                                        <button className="rounded-2xl bg-white px-5 py-2 text-[10px] font-black tracking-widest text-blue-600 uppercase transition-colors hover:bg-blue-50">
                                            Rotate Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {(activeTab === "notifications" ||
                        activeTab === "billing") && (
                        <div className="animate-in fade-in slide-in-from-right-4 flex flex-col items-center justify-center py-32 text-center duration-500">
                            <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gray-50 text-gray-300 dark:bg-gray-800">
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />
                                <Star className="relative z-10 h-10 w-10 animate-pulse" />
                            </div>
                            <h4 className="mb-3 text-2xl font-black text-gray-900 dark:text-white">
                                Enterprise Feature
                            </h4>
                            <p className="mx-auto max-w-sm text-sm font-medium text-gray-500 italic">
                                This module is currently being calibrated for
                                our Bahikhata Enterprise rollout. Visit our
                                roadmap for release timelines.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
