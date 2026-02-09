"use client";
import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Smartphone, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  Camera,
  Moon,
  Sun,
  Laptop,
  Globe,
  Star
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import toast from "react-hot-toast";

export default function UserSettingsPageClient() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
    street: user?.street || "",
    city: user?.city || "",
    state: user?.state || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Update state when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone_number: user.phone_number || "",
        street: user.street || "",
        city: user.city || "",
        state: user.state || "",
        postal_code: user.postal_code || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await userService.updateMe(formData);
      await checkAuth();
      toast.success("Profile updated successfully!");
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
    try {
       const urlObj = new URL(apiUrl);
       return `${urlObj.origin}${url}`;
    } catch {
       return url;
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "billing", label: "Plan & Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 font-medium italic">
          Customize your financial workstation and security parameters.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <nav className="flex lg:flex-col gap-2 p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-x-auto no-scrollbar shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-8 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20 hidden lg:block overflow-hidden relative group">
            <Star className="absolute -right-4 -top-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
            <h5 className="font-black text-xl mb-3 relative z-10 text-white">Pro Plan</h5>
            <p className="text-xs text-white/70 font-medium leading-relaxed mb-8 relative z-10">Unlock automated OCR processing and multi-family support.</p>
            <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 rounded-2xl font-black py-3.5 shadow-none border-none relative z-10 transition-transform active:scale-95">Upgrade Workspace</Button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 relative bg-gray-50/20 dark:bg-gray-800/20">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-gray-900 shadow-2xl transition-transform group-hover:scale-105 duration-300">
                        <img src={getAvatarUrl(user?.avatar_url)} alt="Avatar" className="w-full h-full object-cover" />
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/png, image/jpeg, image/jpg"
                          />
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform border-4 border-white dark:border-gray-900"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{user?.first_name} {user?.last_name}</h3>
                      <p className="text-sm text-gray-400 font-bold mb-5 flex items-center justify-center md:justify-start gap-2 italic">
                        <Mail className="w-4 h-4 text-blue-500" /> {user?.email}
                      </p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-emerald-100 dark:border-emerald-800/50">Verified Member</span>
                        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-indigo-100 dark:border-indigo-800/50">
                          {user?.role === 'admin' ? 'Workspace Admin' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">First Name</Label>
                            <Input name="first_name" value={formData.first_name} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">Last Name</Label>
                            <Input name="last_name" value={formData.last_name} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">Email</Label>
                      <Input value={user?.email || ""} disabled className="h-14 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed opacity-60 border-none font-bold" />
                    </div>
                     <div className="space-y-3">
                      <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">Phone Number</Label>
                      <Input name="phone_number" value={formData.phone_number} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                    </div>
                  </div>
                </div>

                  {/* Address Section */}
                <div className="p-8 space-y-10">
                  <div className="space-y-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Address Details</h4>
                     <div className="space-y-3">
                        <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">Street Address</Label>
                        <Input name="street" value={formData.street} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-3">
                          <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">City</Label>
                          <Input name="city" value={formData.city} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                        </div>
                         <div className="space-y-3">
                          <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">State</Label>
                          <Input name="state" value={formData.state} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                        </div>
                         <div className="space-y-3">
                          <Label className="text-gray-700 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest pl-1">Postal Code</Label>
                          <Input name="postal_code" value={formData.postal_code} onChange={handleChange} className="h-14 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 focus:ring-blue-500/20 transition-all" />
                        </div>
                      </div>
                  </div>
                  </div>
                  {/* Headline Removed */}
                  <div className="flex justify-end pt-6 border-t border-gray-50 dark:border-gray-800">
                    <Button onClick={handleUpdate} disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-12 h-14 font-black shadow-2xl shadow-blue-500/30 transition-all active:scale-95">
                      {isLoading ? "Saving..." : "Synchronize Profile"}
                    </Button>
                  </div>
                </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
                <h4 className="text-xl font-black text-gray-800 dark:text-white mb-8">System Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl text-amber-500 shadow-sm group-hover:rotate-6 transition-transform">
                        <Sun className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">Visual Mode</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Light Theme Active</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl text-purple-600 shadow-sm group-hover:rotate-6 transition-transform">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">Regional Interface</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">English (Global)</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm">
                <div className="flex items-center gap-6 mb-12">
                  <div className="p-4 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 rounded-3xl shadow-sm">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">Vault Security</h4>
                    <p className="text-sm text-gray-500 font-medium italic mt-1">Multi-layered account protection.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { title: "2-Factor Authentication", desc: "Adds an extra layer of security using OTP.", status: "Inactive", statusColor: "text-rose-500 bg-rose-500/10 border-rose-500/20", icon: <Smartphone /> },
                    { title: "Personal Access Tokens", desc: "Manage API keys for external integrations.", status: "0 Active", statusColor: "text-gray-400 bg-gray-400/10 border-gray-400/20", icon: <Lock /> }
                  ].map((sec, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/20 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                           {React.cloneElement(sec.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-800 dark:text-white">{sec.title}</p>
                          <p className="text-[11px] text-gray-400 font-medium">{sec.desc}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black border px-3 py-1 rounded-full uppercase tracking-widest ${sec.statusColor}`}>{sec.status}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center justify-between p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 text-white">
                    <div className="flex items-center gap-6">
                       <Lock className="w-7 h-7 opacity-80" />
                       <div>
                         <p className="text-base font-black">Credential Update</p>
                         <p className="text-[11px] text-white/70 font-medium">Last rotated: 4 months ago</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-black bg-white text-blue-600 px-5 py-2 rounded-2xl uppercase tracking-widest hover:bg-blue-50 transition-colors">Rotate Password</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {(activeTab === "notifications" || activeTab === "billing") && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-8 text-gray-300 relative">
                 <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                 <Star className="w-10 h-10 relative z-10 animate-pulse" />
              </div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Enterprise Feature</h4>
              <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto italic">This module is currently being calibrated for our Bahikhata Enterprise rollout. Visit our roadmap for release timelines.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
