"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User, Mail, Phone, FileText, Edit3 } from "lucide-react";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  const infoItems = [
    { label: "First Name", value: "Saurav", icon: <User className="w-4 h-4" /> },
    { label: "Last Name", value: "Karn", icon: <User className="w-4 h-4" /> },
    { label: "Email Address", value: "saurav@example.com", icon: <Mail className="w-4 h-4" /> },
    { label: "Phone Number", value: "+977 980 000000", icon: <Phone className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h4 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-3">
            <User className="w-6 h-6 text-blue-500" /> Personal Identity
          </h4>
          <p className="text-sm text-gray-500 font-medium italic mt-1">Foundational account information.</p>
        </div>
        <button 
          onClick={openModal}
          className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-blue-500 hover:scale-110 transition-all rounded-2xl"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {infoItems.map((item, i) => (
          <div key={i} className="space-y-1 group">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               {item.icon} {item.label}
            </p>
            <p className="text-base font-bold text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">
              {item.value}
            </p>
          </div>
        ))}
        <div className="col-span-1 md:col-span-2 space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <FileText className="w-4 h-4" /> Bio / Summary
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic">
            Passionate family wealth manager focused on creating a sustainable financial legacy through organized budgeting and long-term asset allocation strategies.
          </p>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Refine Identity</h3>
          <p className="text-sm text-gray-500 font-medium italic">Update your legal name and contact details.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">First Name</Label>
                <Input defaultValue="Saurav" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Last Name</Label>
                <Input defaultValue="Karn" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Email</Label>
                <Input defaultValue="saurav@example.com" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Phone</Label>
                <Input defaultValue="+977 980 000000" className="h-12 rounded-2xl" />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Bio</Label>
                <textarea 
                  className="w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 text-sm focus:ring-2 focus:ring-blue-500/10 min-h-[100px] outline-none font-medium" 
                  defaultValue="Passionate family wealth manager..."
                ></textarea>
              </div>
           </div>

           <div className="flex justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
             <Button variant="outline" onClick={closeModal} className="rounded-2xl px-8 h-12 font-bold">Cancel</Button>
             <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-blue-500/20">Update Identity</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
