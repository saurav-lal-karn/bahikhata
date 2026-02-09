"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { 
  Camera, 
  MapPin, 
  Briefcase, 
  Edit3
} from "lucide-react";
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
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
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm group">
        {/* Cover Photo Placeholder */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <button className="absolute bottom-4 right-8 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-2xl transition-all border border-white/10">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 -mt-12 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-gray-900 shadow-xl bg-gray-50 dark:bg-gray-800">
                  <Image
                    width={128}
                    height={128}
                    src={getAvatarUrl(user?.avatar_url)}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-gray-900"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {user?.first_name} {user?.last_name}
                </h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 capitalize">
                    <Briefcase className="w-4 h-4 text-blue-500" /> {user?.role || "Member"}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                    <MapPin className="w-4 h-4 text-rose-500" /> {user?.city}, {user?.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={openModal}
                className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold transition-all"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
             <Edit3 className="text-blue-500" /> Edit Metadata
          </h3>
          <p className="text-sm text-gray-500 font-medium italic">Update your public identity.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">First Name</Label>
                <Input name="first_name" value={formData.first_name} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Last Name</Label>
                <Input name="last_name" value={formData.last_name} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">City</Label>
                <Input name="city" value={formData.city} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Country</Label>
                <Input name="country" value={formData.country} onChange={handleChange} className="h-12 rounded-2xl" />
              </div>
           </div>

           <div className="flex justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
             <Button variant="outline" onClick={closeModal} className="rounded-2xl px-8 h-12 font-bold">Cancel</Button>
             <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-blue-500/20">
               {isLoading ? "Saving..." : "Save Changes"}
             </Button>
           </div>
        </form>
      </Modal>
    </>
  );
}
