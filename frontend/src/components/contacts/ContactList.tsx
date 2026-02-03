"use client";
import React from "react";
import { Contact } from "@/types";
import { User, Mail, Phone, MapPin, Pencil, Trash2, MoreVertical } from "lucide-react";
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
  EMPLOYER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

interface ContactListProps {
  contacts: Contact[];
  isLoading?: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactList({ contacts, isLoading, onEdit, onDelete }: ContactListProps) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <User className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">No contacts yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Add vendors, lenders, employers, or other contacts to link to transactions and debts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-lg transition-all group"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-black text-gray-900 dark:text-white truncate">
                  {contact.name}
                </h4>
                <span
                  className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${TYPE_COLORS[contact.type] ?? TYPE_COLORS.OTHER}`}
                >
                  {TYPE_LABELS[contact.type] ?? contact.type}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                {contact.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </span>
                )}
                {contact.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {contact.phone}
                  </span>
                )}
                {contact.address && (
                  <span className="flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{contact.address}</span>
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
                setActiveMenu(activeMenu === contact.id ? null : contact.id);
              }}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all dropdown-toggle"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <Dropdown
                isOpen={activeMenu === contact.id}
                onClose={() => setActiveMenu(null)}
                className="absolute right-0 top-full mt-1 z-50 min-w-[140px]"
              >
                <DropdownItem
                  onClick={() => {
                    onEdit(contact);
                    setActiveMenu(null);
                  }}
                >
                  <div className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit</div>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onDelete(contact.id);
                    setActiveMenu(null);
                  }}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                </DropdownItem>
              </Dropdown>
          </div>
        </div>
      ))}
    </div>
  );
}
