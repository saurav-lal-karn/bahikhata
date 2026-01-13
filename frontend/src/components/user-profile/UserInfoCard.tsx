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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    { label: "First Name", value: user?.first_name, icon: <User className="w-4 h-4" /> },
    { label: "Last Name", value: user?.last_name, icon: <User className="w-4 h-4" /> },
    { label: "Email Address", value: user?.email, icon: <Mail className="w-4 h-4" /> },
    { label: "Phone Number", value: user?.phone_number || "Not set", icon: <Phone className="w-4 h-4" /> }
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
                <Input name="first_name" value={formData.first_name} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Last Name</Label>
                <Input name="last_name" value={formData.last_name} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Email</Label>
                <Input value={user?.email || ""} disabled className="h-12 rounded-2xl cursor-not-allowed opacity-60" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Phone</Label>
                <Input name="phone_number" value={formData.phone_number} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
           </div>

           <div className="flex justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
             <Button variant="outline" onClick={closeModal} className="rounded-2xl px-8 h-12 font-bold">Cancel</Button>
             <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-blue-500/20">
                {isLoading ? "Updating..." : "Update Identity"}
             </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
