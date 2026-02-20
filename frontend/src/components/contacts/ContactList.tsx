"use client";
import React from "react";
import { Contact } from "@/types";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Pencil,
    Trash2,
    MoreVertical,
} from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

const TYPE_LABELS: Record<string, string> = {
    VENDOR: "Vendor",
    LENDER: "Lender",
    EMPLOYER: "Employer",
    OTHER: "Other",
};

const TYPE_COLORS: Record<string, string> = {
    VENDOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    LENDER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    EMPLOYER:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

interface ContactListProps {
    contacts: Contact[];
    isLoading?: boolean;
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

export function ContactList({
    contacts,
    isLoading,
    onEdit,
    onDelete,
}: ContactListProps) {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-24 rounded-3xl bg-gray-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
                <User className="mx-auto mb-4 h-14 w-14 text-gray-300 dark:text-gray-600" />
                <p className="font-medium text-gray-500 dark:text-gray-400">
                    No contacts yet
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                    Add vendors, lenders, employers, or other contacts to link
                    to transactions and debts.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:shadow-lg sm:flex-row sm:items-center dark:border-gray-800 dark:bg-gray-900"
                >
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                            <User className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h4 className="truncate text-lg font-black text-gray-900 dark:text-white">
                                    {contact.name}
                                </h4>
                                <span
                                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${TYPE_COLORS[contact.type] ?? TYPE_COLORS.OTHER}`}
                                >
                                    {TYPE_LABELS[contact.type] ?? contact.type}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                {contact.email && (
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="truncate">
                                            {contact.email}
                                        </span>
                                    </span>
                                )}
                                {contact.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                        {contact.phone}
                                    </span>
                                )}
                                {contact.address && (
                                    <span className="flex min-w-0 items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="truncate">
                                            {contact.address}
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative flex-shrink-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(
                                    activeMenu === contact.id
                                        ? null
                                        : contact.id
                                );
                            }}
                            className="dropdown-toggle rounded-xl p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        <Dropdown
                            isOpen={activeMenu === contact.id}
                            onClose={() => setActiveMenu(null)}
                            className="absolute top-full right-0 z-50 mt-1 min-w-[140px]"
                        >
                            <DropdownItem
                                onClick={() => {
                                    onEdit(contact);
                                    setActiveMenu(null);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Pencil className="h-4 w-4" /> Edit
                                </div>
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    onDelete(contact.id);
                                    setActiveMenu(null);
                                }}
                                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </div>
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            ))}
        </div>
    );
}
