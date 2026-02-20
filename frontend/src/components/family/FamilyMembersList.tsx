"use client";
import React, { useEffect, useState } from "react";
import { Search, Trash2, ShieldCheck, Mail, MoreVertical } from "lucide-react";
import { familyService } from "@/services/familyService";
import type { FamilyMember } from "@/types";
import { formatDateTime } from "@/lib/utils";

export const FamilyMembersList = ({ familyId }: { familyId: string }) => {
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

    const filteredMembers = members.filter(
        (member) =>
            member.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvatarUrl = (url?: string) => {
        if (!url) return "/images/user/owner.jpg";
        if (url.startsWith("http")) return url;
        // Construct full URL
        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3080";
        try {
            const urlObj = new URL(apiUrl);
            return `${urlObj.origin}${url}`;
        } catch {
            return url;
        }
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-50 p-6 sm:flex-row sm:items-center dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    Family Directory
                </h3>

                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none sm:w-80 dark:border-gray-800 dark:bg-gray-900"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Member
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {filteredMembers.map((member) => (
                            <tr
                                key={member.id}
                                className="group transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.01]"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={getAvatarUrl(
                                                    member.avatar_url
                                                )}
                                                alt={
                                                    member.first_name +
                                                    " " +
                                                    member.last_name
                                                }
                                                className="h-11 w-11 rounded-full border border-gray-100 bg-gray-100 dark:border-gray-800"
                                                width={44}
                                                height={44}
                                            />
                                            <span
                                                className={`absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-black ${member.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}
                                            ></span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm leading-tight font-bold text-gray-800 dark:text-white/90">
                                                {member.first_name +
                                                    " " +
                                                    member.last_name}
                                            </h4>
                                            <p className="text-xs font-medium text-gray-500">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                                            member.role === "Owner"
                                                ? "border border-purple-100 bg-purple-50 text-purple-700 dark:border-purple-800/50 dark:bg-purple-900/10 dark:text-purple-400"
                                                : "border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-900/10 dark:text-blue-400"
                                        }`}
                                    >
                                        {member.role === "Owner" && (
                                            <ShieldCheck className="h-3 w-3" />
                                        )}
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {formatDateTime(member.created_at)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="rounded-lg p-2 text-gray-400 transition-all hover:bg-blue-50 hover:text-blue-500">
                                            <Mail className="h-4 w-4" />
                                        </button>
                                        {member.role !== "Owner" && (
                                            <button className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button className="rounded-lg p-2 text-gray-400 transition-all hover:text-gray-900">
                                            <MoreVertical className="h-4 w-4" />
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
