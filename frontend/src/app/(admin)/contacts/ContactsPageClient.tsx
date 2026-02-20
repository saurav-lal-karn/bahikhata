"use client";
import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Filter, ChevronDown } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactForm } from "@/components/contacts/ContactForm";
import { useAuth } from "@/context/AuthContext";
import { contactService } from "@/services/contactService";
import { Contact } from "@/types";

export default function ContactsPageClient() {
    const { user } = useAuth();
    const familyDetails = user?.family;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const openModal = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
        // Refresh contacts
        if (familyDetails?.id) {
            contactService.getContacts(familyDetails.id).then(setContacts);
        }
    };

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;

        try {
            await contactService.deleteContact(id);
            setContacts(contacts.filter((c) => c.id !== id));
        } catch (error) {
            console.error("Failed to delete contact:", error);
            alert("Failed to delete contact");
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!familyDetails?.id) return;

            try {
                setIsLoading(true);
                const contactsResponse = await contactService.getContacts(
                    familyDetails.id
                );

                if (isMounted) {
                    setContacts(contactsResponse);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch contacts:", error);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [familyDetails]);

    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone?.includes(searchTerm);
        const matchesType = !selectedType || contact.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-3xl leading-tight font-black text-gray-900 dark:text-white">
                        Contacts Manager
                    </h1>
                    <p className="font-medium text-gray-500 italic">
                        Manage your vendors, lenders, employers, and payees.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={openModal}
                        className="flex transform items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-500 active:scale-95"
                    >
                        <Plus className="h-5 w-5" /> Add Contact
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search contacts..."
                            className="w-full rounded-2xl border border-gray-100 bg-white py-2.5 pr-4 pl-11 text-sm font-medium transition-all focus:ring-2 focus:ring-purple-500/20 dark:border-gray-800 dark:bg-gray-900"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative isolate">
                        <button
                            onClick={() => setIsFilterVisible(!isFilterVisible)}
                            className={`rounded-xl border p-2.5 transition-all ${isFilterVisible ? "border-purple-200 bg-purple-50 text-purple-600" : "border-gray-100 bg-white text-gray-400 hover:text-gray-600 dark:border-gray-800 dark:bg-gray-900"}`}
                        >
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Options */}
            {isFilterVisible && (
                <div className="animate-in slide-in-from-top-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm duration-300 dark:border-gray-800 dark:bg-gray-900">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="px-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                Contact Type
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedType || ""}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value || null)
                                    }
                                    className="w-full appearance-none rounded-2xl border border-transparent bg-gray-50 py-2.5 pr-10 pl-4 text-sm font-bold transition-all focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800/50"
                                >
                                    <option value="">All Types</option>
                                    <option value="VENDOR">Vendors</option>
                                    <option value="LENDER">Lenders</option>
                                    <option value="EMPLOYER">Employers</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-end md:col-span-2">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedType(null);
                                }}
                                className="w-full rounded-2xl bg-gray-100 py-2.5 text-xs font-black tracking-widest text-gray-600 uppercase transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <ContactList
                contacts={filteredContacts}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Add/Edit Contact Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                className="max-w-2xl p-10"
            >
                <div className="mb-10">
                    <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                        {editingContact ? "Edit Contact" : "Add New Contact"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                        {editingContact
                            ? "Update contact information"
                            : "Add a new vendor, lender, employer, or payee"}
                    </p>
                </div>
                <ContactForm
                    onSuccess={closeModal}
                    onCancel={closeModal}
                    family_id={familyDetails?.id || ""}
                    contact={editingContact}
                />
            </Modal>
        </div>
    );
}
