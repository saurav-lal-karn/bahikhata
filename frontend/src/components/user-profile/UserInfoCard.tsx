"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User, Mail, Phone, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserInfoCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone_number: user.phone_number || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await userService.updateMe(formData);
            await checkAuth();
            toast.success("Identity updated successfully!");
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update identity.");
        } finally {
            setIsLoading(false);
        }
    };

    const infoItems = [
        {
            label: "First Name",
            value: user?.first_name,
            icon: <User className="h-4 w-4" />,
        },
        {
            label: "Last Name",
            value: user?.last_name,
            icon: <User className="h-4 w-4" />,
        },
        {
            label: "Email Address",
            value: user?.email,
            icon: <Mail className="h-4 w-4" />,
        },
        {
            label: "Phone Number",
            value: user?.phone_number || "Not set",
            icon: <Phone className="h-4 w-4" />,
        },
    ];

    return (
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h4 className="flex items-center gap-3 text-xl font-black text-gray-800 dark:text-white">
                        <User className="h-6 w-6 text-blue-500" /> Personal
                        Identity
                    </h4>
                    <p className="mt-1 text-sm font-medium text-gray-500 italic">
                        Foundational account information.
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="rounded-2xl bg-gray-50 p-3 text-gray-400 transition-all hover:scale-110 hover:text-blue-500 dark:bg-gray-800"
                >
                    <Edit3 className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {infoItems.map((item, i) => (
                    <div key={i} className="group space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            {item.icon} {item.label}
                        </p>
                        <p className="text-base font-bold text-gray-800 transition-colors group-hover:text-blue-500 dark:text-white">
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-4xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        Refine Identity
                    </h3>
                    <p className="text-sm font-medium text-gray-500 italic">
                        Update your legal name and contact details.
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                Email
                            </Label>
                            <Input
                                value={user?.email || ""}
                                disabled
                                className="h-12 cursor-not-allowed rounded-2xl opacity-60"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Phone
                            </Label>
                            <Input
                                name="phone_number"
                                value={formData.phone_number}
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
                            {isLoading ? "Updating..." : "Update Identity"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
