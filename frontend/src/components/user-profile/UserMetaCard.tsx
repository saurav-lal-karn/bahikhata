"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { Camera, MapPin, Briefcase, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserMetaCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        city: "",
        country: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                city: user.city || "",
                country: user.country || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // specific max size check if needed (e.g. 5MB)
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
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await userService.updateMe(formData);
            await checkAuth();
            toast.success("Profile updated successfully!");
            closeModal();
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
        // Construct full URL
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
        try {
            const urlObj = new URL(apiUrl);
            return `${urlObj.origin}${url}`;
        } catch {
            return url;
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
            />
            <div className="group overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* Cover Photo Placeholder */}
                <div className="relative h-40 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <button className="absolute right-8 bottom-4 rounded-2xl border border-white/10 bg-white/20 p-3 text-white backdrop-blur-md transition-all hover:bg-white/30">
                        <Camera className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative -mt-12 px-8 pb-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
                        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
                            <div className="group/avatar relative">
                                <div className="h-32 w-32 overflow-hidden rounded-[2.5rem] border-8 border-white bg-gray-50 shadow-xl dark:border-gray-900 dark:bg-gray-800">
                                    <Image
                                        width={128}
                                        height={128}
                                        src={getAvatarUrl(user?.avatar_url)}
                                        alt="user"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="absolute right-1 bottom-1 rounded-xl border-4 border-white bg-blue-600 p-2.5 text-white shadow-lg transition-transform hover:scale-110 dark:border-gray-900"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="mb-2">
                                <h3 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                                    {user?.first_name} {user?.last_name}
                                </h3>
                                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 capitalize">
                                        <Briefcase className="h-4 w-4 text-blue-500" />{" "}
                                        {user?.role || "Member"}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                                        <MapPin className="h-4 w-4 text-rose-500" />{" "}
                                        {user?.city}, {user?.country}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 flex items-center gap-3">
                            <button
                                onClick={openModal}
                                className="flex items-center gap-2 rounded-2xl bg-gray-50 px-6 py-3 font-bold text-gray-900 transition-all hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            >
                                <Edit3 className="h-4 w-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        <Edit3 className="text-blue-500" /> Edit Metadata
                    </h3>
                    <p className="text-sm font-medium text-gray-500 italic">
                        Update your public identity.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                First Name
                            </Label>
                            <Input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Last Name
                            </Label>
                            <Input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                City
                            </Label>
                            <Input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Country
                            </Label>
                            <Input
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t border-gray-50 pt-6 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={closeModal}
                            className="h-12 rounded-2xl px-8 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 rounded-2xl bg-blue-600 px-12 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
