"use client";
import React from "react";
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
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Edit3
} from "lucide-react";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  return (
    <>
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
                    src="/images/user/owner.jpg"
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-gray-900">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mb-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Saurav Karn</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                    <Briefcase className="w-4 h-4 text-blue-500" /> Lead Architect
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                    <MapPin className="w-4 h-4 text-rose-500" /> Kathmandu, Nepal
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
              <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl">
                 {[
                   { icon: <Facebook />, link: "https://facebook.com" },
                   { icon: <Twitter />, link: "https://twitter.com" },
                   { icon: <Instagram />, link: "https://instagram.com" }
                 ].map((social, idx) => (
                   <a 
                    key={idx}
                    href={social.link} 
                    target="_blank" 
                    className="p-2.5 hover:bg-white dark:hover:bg-gray-900 rounded-xl text-gray-400 hover:text-blue-500 transition-all"
                   >
                     {React.cloneElement(social.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                   </a>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-4xl p-10">
        <div className="mb-10">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
             <Edit3 className="text-blue-500" /> Edit Metadata
          </h3>
          <p className="text-sm text-gray-500 font-medium italic">Update your public identity and social footprint.</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Display Name</Label>
                <Input defaultValue="Saurav Karn" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Headline Role</Label>
                <Input defaultValue="Lead Architect" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Location</Label>
                <Input defaultValue="Kathmandu, Nepal" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Facebook URL</Label>
                <Input defaultValue="https://facebook.com/saurav" className="h-12 rounded-2xl" />
              </div>
           </div>

           <div className="flex justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
             <Button variant="outline" onClick={closeModal} className="rounded-2xl px-8 h-12 font-bold">Cancel</Button>
             <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-12 font-bold shadow-lg shadow-blue-500/20">Save Changes</Button>
           </div>
        </form>
      </Modal>
    </>
  );
}
