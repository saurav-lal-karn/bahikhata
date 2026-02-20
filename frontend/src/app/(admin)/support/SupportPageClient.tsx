"use client";
import React, { useState } from "react";
import {
    LifeBuoy,
    Search,
    MessageCircle,
    Book,
    ChevronDown,
    ChevronUp,
    Send,
    HelpCircle,
    FileText,
    Mail,
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

const faqs = [
    {
        question: "How do I link a new bank account?",
        answer: "Navigate to the 'Wallets' section in the sidebar and click on 'Add Account'. You can link bank accounts, digital wallets, or even manual cash reserves.",
    },
    {
        question: "Is my data secure and encrypted?",
        answer: "Yes, Bahikhata uses AES-256 local encryption for sensitive financial records. Your data is stored securely and is only accessible by you and your authorized family members.",
    },
    {
        question: "How do I export my tax reports?",
        answer: "Go to the 'Tax Center' page. You will see an 'Export Tax Report' button in the top right corner. You can choose to export as PDF or CSV.",
    },
    {
        question: "Can I manage multiple family units?",
        answer: "Currently, Bahikhata supports one primary family unit per account in the standard plan. The Pro plan allows you to manage multiple disconnected family ledgers.",
    },
];

export default function SupportPageClient() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [formData, setFormData] = useState({
        subject: "",
        category: "General",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Support Ticket Submitted:", formData);
        alert(
            "Support ticket submitted! Our team will get back to you within 24 hours."
        );
        setFormData({ subject: "", category: "General", message: "" });
    };

    return (
        <div className="mx-auto max-w-6xl space-y-10 pb-20">
            {/* Header */}
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[2rem] border-2 border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                    <LifeBuoy className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                    How can we help?
                </h1>
                <p className="mx-auto max-w-xl font-medium text-gray-500 italic">
                    Search our knowledge base or get in touch with our financial
                    experts.
                </p>
                <div className="relative mx-auto max-w-xl pt-4">
                    <Search className="absolute top-[60%] left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        className="w-full rounded-3xl border border-gray-100 bg-white py-4 pr-4 pl-12 shadow-lg shadow-gray-200/20 outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                    {
                        icon: <MessageCircle />,
                        title: "Live Chat",
                        desc: "Average response: 5 min",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50 dark:bg-emerald-900/20",
                    },
                    {
                        icon: <Mail />,
                        title: "Email Support",
                        desc: "support@bahikhata.com",
                        color: "text-blue-600",
                        bg: "bg-blue-50 dark:bg-blue-900/20",
                    },
                    {
                        icon: <FileText />,
                        title: "Documentation",
                        desc: "Detailed guides & API",
                        color: "text-purple-600",
                        bg: "bg-purple-50 dark:bg-purple-900/20",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="group cursor-pointer rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div
                            className={`w-fit rounded-2xl p-3 ${item.bg} ${item.color} mb-4 transition-transform group-hover:rotate-12`}
                        >
                            {item.icon}
                        </div>
                        <h4 className="mb-1 text-lg font-black text-gray-800 dark:text-white">
                            {item.title}
                        </h4>
                        <p className="text-xs font-medium text-gray-500">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* FAQs */}
                <div className="col-span-12 space-y-6 lg:col-span-7">
                    <h3 className="flex items-center gap-3 text-2xl font-black text-gray-800 dark:text-white">
                        <HelpCircle className="h-6 w-6 text-blue-500" />{" "}
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`overflow-hidden rounded-[2rem] border bg-white transition-all duration-300 dark:bg-gray-900 ${openFaq === i ? "border-blue-200 ring-4 ring-blue-500/5 dark:border-blue-800" : "border-gray-100 dark:border-gray-800"}`}
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaq(openFaq === i ? null : i)
                                    }
                                    className="flex w-full items-center justify-between px-8 py-5 text-left"
                                >
                                    <span
                                        className={`font-bold transition-colors ${openFaq === i ? "text-blue-600" : "text-gray-700 dark:text-gray-300"}`}
                                    >
                                        {faq.question}
                                    </span>
                                    {openFaq === i ? (
                                        <ChevronUp className="h-5 w-5 text-blue-500" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="animate-in fade-in slide-in-from-top-2 px-8 pb-6">
                                        <p className="text-sm leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-2 text-2xl font-black text-gray-800 dark:text-white">
                            Send a Message
                        </h3>
                        <p className="mb-8 text-sm font-medium text-gray-500">
                            Can't find what you need? Reach out directly.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Query Subject
                                </Label>
                                <Input
                                    required
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Help with Investment Export"
                                    className="h-12 rounded-2xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Category
                                </Label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                        })
                                    }
                                    className="h-12 w-full rounded-2xl border-gray-100 bg-gray-50 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900"
                                >
                                    <option>General Inquiry</option>
                                    <option>Technical Issue</option>
                                    <option>Billing & Subscription</option>
                                    <option>Feature Request</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold tracking-widest text-gray-700 uppercase dark:text-gray-300">
                                    Message
                                </Label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message: e.target.value,
                                        })
                                    }
                                    className="min-h-[120px] w-full rounded-2xl border-gray-100 bg-gray-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900"
                                    placeholder="Describe your issue in detail..."
                                ></textarea>
                            </div>

                            <Button
                                type="submit"
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-black text-white shadow-xl shadow-blue-500/20 hover:bg-blue-500"
                            >
                                <Send className="h-5 w-5" /> Send Support
                                Request
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
