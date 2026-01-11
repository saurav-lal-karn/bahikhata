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
  Trash2,
  Moon,
  Sun,
  Laptop,
  Globe
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const tabs = [
    { id: "profile", label: "My Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "billing", label: "Plan & Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
          Account Settings
        </h1>
        <p className="text-gray-500 font-medium">
          Manage your personal identity, security, and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 p-2 bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl shadow-indigo-500/10 hidden lg:block">
            <h5 className="font-black text-lg mb-2">Pro Plan</h5>
            <p className="text-xs text-white/70 font-medium leading-relaxed mb-6">Unlock multi-family support and advanced OCR insights.</p>
            <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 rounded-2xl font-bold py-2.5 shadow-none border-none">Upgrade Now</Button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 relative bg-gray-50/30 dark:bg-gray-800/20">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Saurav" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Saurav Karn</h3>
                      <p className="text-sm text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                        <Mail className="w-4 h-4" /> saurav@example.com
                      </p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-800/50">Verified Member</span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-800/50">Family Owner</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Public Display Name</Label>
                      <Input defaultValue="Saurav Karn" className="h-14 rounded-2xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Contact Email</Label>
                      <Input defaultValue="saurav@example.com" disabled className="h-14 rounded-2xl bg-gray-50/50 cursor-not-allowed" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Bio (Optional)</Label>
                    <textarea 
                      className="w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 text-sm focus:ring-2 focus:ring-blue-500/10 min-h-[100px] outline-none" 
                      placeholder="Write a short summary about yourself..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-800">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-10 h-12 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">Update Profile</Button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                <h4 className="text-lg font-black text-gray-800 dark:text-white mb-6">App Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl text-blue-600">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Appearance</p>
                        <p className="text-[10px] text-gray-400 font-medium">Light theme active</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded-xl text-purple-600">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Language</p>
                        <p className="text-[10px] text-gray-400 font-medium">English (US)</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8 text-left">
              <div className="bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-800 dark:text-white">Security & Access</h4>
                    <p className="text-sm text-gray-500 font-medium italic">Keep your records safe.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <Smartphone className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Multi-factor Authentication</p>
                        <p className="text-[10px] text-gray-400 font-medium">Secure your account with MFA via SMS or App.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-red-500 border border-red-500/20 bg-red-500/5 px-2 py-0.5 rounded-full uppercase tracking-widest">Disabled</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <ShieldCheck className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">Password Change</p>
                        <p className="text-[10px] text-gray-400 font-medium">Update your password to stay secure.</p>
                      </div>
                    </div>
                    <button className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest">Change</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {(activeTab === "notifications" || activeTab === "billing") && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <Smartphone className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">Section Under Development</h4>
              <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">We're working hard to bring you more control over your account. Stay tuned!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
