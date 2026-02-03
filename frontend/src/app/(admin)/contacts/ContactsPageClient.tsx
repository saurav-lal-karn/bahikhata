"use client";
import React, { useEffect, useState } from "react";
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  ChevronDown
} from "lucide-react";

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
      setContacts(contacts.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!familyDetails?.id) return;

      try {
        setIsLoading(true);
        const contactsResponse = await contactService.getContacts(familyDetails.id);

        if (isMounted) {
          setContacts(contactsResponse);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch contacts:', error);
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone?.includes(searchTerm);
    const matchesType = !selectedType || contact.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Contacts Manager
          </h1>
          <p className="text-gray-500 font-medium italic">
            Manage your vendors, lenders, employers, and payees.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={openModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-5 h-5" /> Add Contact
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative isolate">
            <button 
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className={`p-2.5 rounded-xl transition-all border ${isFilterVisible ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:text-gray-600'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      {isFilterVisible && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Type</label>
              <div className="relative">
                <select 
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  <option value="">All Types</option>
                  <option value="VENDOR">Vendors</option>
                  <option value="LENDER">Lenders</option>
                  <option value="EMPLOYER">Employers</option>
                  <option value="OTHER">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end md:col-span-2">
              <button 
                onClick={() => { setSearchTerm(""); setSelectedType(null); }}
                className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
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
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-2xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
            {editingContact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {editingContact ? 'Update contact information' : 'Add a new vendor, lender, employer, or payee'}
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
