"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { MapPin, Globe, Hash, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserAddressCard() {
    const { isOpen, openModal, closeModal } = useModal();
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        country: "",
        city: "",
        postal_code: "",
        street: "", // Added street although not displayed in summary card, needed for full update context if used
    });

    useEffect(() => {
        if (user) {
            setFormData({
                country: user.country || "",
                city: user.city || "",
                postal_code: user.postal_code || "",
                street: user.street || "",
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
            toast.success("Address updated successfully!");
            closeModal();
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update address.");
        } finally {
            setIsLoading(false);
        }
    };

    const addressItems = [
        {
            label: "Country / Region",
            value: user?.country || "Not set",
            icon: <Globe className="h-4 w-4" />,
        },
        {
            label: "City / District",
            value: user?.city || "Not set",
            icon: <MapPin className="h-4 w-4" />,
        },
        {
            label: "Postal Code",
            value: user?.postal_code || "Not set",
            icon: <Hash className="h-4 w-4" />,
        },
    ];

    return (
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-10 flex items-center justify-between">
                <div>
                    <h4 className="flex items-center gap-3 text-xl font-black text-gray-800 dark:text-white">
                        <MapPin className="h-6 w-6 text-rose-500" /> Residency
                    </h4>
                    <p className="mt-1 text-sm font-medium text-gray-500 italic">
                        Geographic residency details.
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
                {addressItems.map((item, i) => (
                    <div key={i} className="group space-y-1">
                        <p className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                            {item.icon} {item.label}
                        </p>
                        <p className="text-base font-bold text-gray-800 transition-colors group-hover:text-rose-500 dark:text-white">
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
                        Update Address
                    </h3>
                    <p className="text-sm font-medium text-gray-500 italic">
                        Ensure your residency data is accurate.
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
                                Country
                            </Label>
                            <Input
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                City/District
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
                                Postal Code
                            </Label>
                            <Input
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleChange}
                                className="h-12 rounded-2xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                Street Address
                            </Label>
                            <Input
                                name="street"
                                value={formData.street}
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
                            {isLoading ? "Updating..." : "Set Residency"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
