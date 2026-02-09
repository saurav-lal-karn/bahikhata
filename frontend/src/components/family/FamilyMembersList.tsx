"use client";
import React, { useEffect, useState } from "react";
import { 
  Search, 
  Trash2, 
  ShieldCheck, 
  Mail,
  MoreVertical,
} from "lucide-react";
import { familyService } from "@/services/familyService";
import type { FamilyMember } from "@/types";
import { formatDateTime } from "@/lib/utils";

export const FamilyMembersList = ({familyId}: {familyId: string}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await familyService.getFamilyMembers(familyId);
      setMembers(response);
    };

    if (familyId && familyId !== "") {
      fetchMembers();
    }

    return () => {
      fetchMembers();
    };
  }, [familyId]);

  const filteredMembers = members.filter(member => 
    member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="rounded-3xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900/50 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
          Family Directory
        </h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-80"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-50 dark:border-gray-800">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Member</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500">Joined</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={getAvatarUrl(member.avatar_url)} 
                        alt={member.first_name + " " + member.last_name}
                        className="w-11 h-11 rounded-full bg-gray-100 border border-gray-100 dark:border-gray-800"
                        width={44}
                        height={44}
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-black rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-tight">
                        {member.first_name + " " + member.last_name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                    ${member.role === 'Owner' 
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50' 
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50'}`}>
                    {member.role === 'Owner' && <ShieldCheck className="w-3 h-3" />}
                    {member.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {formatDateTime(member.created_at)}
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                    {member.role !== 'Owner' && (
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-900 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
