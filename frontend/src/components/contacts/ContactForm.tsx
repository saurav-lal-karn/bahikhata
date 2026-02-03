"use client";
import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { contactService, CreateContactRequest, UpdateContactRequest } from "@/services/contactService";
import { Contact } from "@/types";
import toast from "react-hot-toast";

const CONTACT_TYPES = [
  { value: "VENDOR", label: "Vendor" },
  { value: "LENDER", label: "Lender" },
  { value: "EMPLOYER", label: "Employer" },
  { value: "OTHER", label: "Other" },
];

interface ContactFormProps {
  family_id: string;
  contact?: Contact | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ContactForm({ family_id, contact, onSuccess, onCancel }: ContactFormProps) {
  const isEdit = !!contact?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "VENDOR" as CreateContactRequest["type"],
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name ?? "",
        type: (contact.type as CreateContactRequest["type"]) ?? "VENDOR",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        address: contact.address ?? "",
        notes: contact.notes ?? "",
      });
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEdit && contact) {
        const payload: UpdateContactRequest = {
          name: formData.name.trim(),
          type: formData.type,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        };
        await contactService.updateContact(contact.id, payload);
        toast.success("Contact updated");
      } else {
        const payload: CreateContactRequest = {
          family_id,
          name: formData.name.trim(),
          type: formData.type,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        };
        await contactService.createContact(payload);
        toast.success("Contact added");
      }
      onSuccess();
    } catch (err) {
      console.error("Contact save failed", err);
      toast.error(isEdit ? "Failed to update contact" : "Failed to add contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
            Name *
          </Label>
          <Input
            required
            placeholder="e.g. Acme Corp, John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-2xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
            Type
          </Label>
          <Select
            options={CONTACT_TYPES}
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as CreateContactRequest["type"] })}
            placeholder="Select type"
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
            Email
          </Label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="rounded-2xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
            Phone
          </Label>
          <Input
            type="tel"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
          Address
        </Label>
        <Input
          placeholder="Street, city, country"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="rounded-2xl h-12"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">
          Notes
        </Label>
        <TextArea
          placeholder="Optional notes about this contact"
          rows={3}
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          className="rounded-2xl"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl px-6 py-3 font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Update Contact" : "Add Contact"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-2xl px-6 py-3 font-bold"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
