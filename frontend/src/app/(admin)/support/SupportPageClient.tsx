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
  Mail
} from "lucide-react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

const faqs = [
  {
    question: "How do I link a new bank account?",
    answer: "Navigate to the 'Wallets' section in the sidebar and click on 'Add Account'. You can link bank accounts, digital wallets, or even manual cash reserves."
  },
  {
    question: "Is my data secure and encrypted?",
    answer: "Yes, Bahikhata uses AES-256 local encryption for sensitive financial records. Your data is stored securely and is only accessible by you and your authorized family members."
  },
  {
    question: "How do I export my tax reports?",
    answer: "Go to the 'Tax Center' page. You will see an 'Export Tax Report' button in the top right corner. You can choose to export as PDF or CSV."
  },
  {
    question: "Can I manage multiple family units?",
    answer: "Currently, Bahikhata supports one primary family unit per account in the standard plan. The Pro plan allows you to manage multiple disconnected family ledgers."
  }
];

export default function SupportPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    subject: "",
    category: "General",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support Ticket Submitted:", formData);
    alert("Support ticket submitted! Our team will get back to you within 24 hours.");
    setFormData({ subject: "", category: "General", message: "" });
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-blue-100 dark:border-blue-800">
          <LifeBuoy className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">How can we help?</h1>
        <p className="text-gray-500 font-medium max-w-xl mx-auto italic">
          Search our knowledge base or get in touch with our financial experts.
        </p>
        <div className="max-w-xl mx-auto relative pt-4">
          <Search className="absolute left-4 top-[60%] -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search help articles..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg shadow-gray-200/20 dark:shadow-none focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <MessageCircle />, title: "Live Chat", desc: "Average response: 5 min", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: <Mail />, title: "Email Support", desc: "support@bahikhata.com", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: <FileText />, title: "Documentation", desc: "Detailed guides & API", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition-all cursor-pointer group">
            <div className={`p-3 rounded-2xl w-fit ${item.bg} ${item.color} mb-4 group-hover:rotate-12 transition-transform`}>
              {item.icon}
            </div>
            <h4 className="text-lg font-black text-gray-800 dark:text-white mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* FAQs */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-gray-900 border rounded-[2rem] overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-blue-200 dark:border-blue-800 ring-4 ring-blue-500/5' : 'border-gray-100 dark:border-gray-800'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-5 flex items-center justify-between text-left"
                >
                  <span className={`font-bold transition-colors ${openFaq === i ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                    {faq.question}
                  </span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
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
           <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
             <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Send a Message</h3>
             <p className="text-sm text-gray-500 font-medium mb-8">Can't find what you need? Reach out directly.</p>
             
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                 <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Query Subject</Label>
                 <Input 
                   required
                   value={formData.subject}
                   onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   placeholder="e.g. Help with Investment Export" 
                   className="h-12 rounded-2xl" 
                 />
               </div>
               
               <div className="space-y-2">
                 <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Category</Label>
                 <select 
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                   className="w-full h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10"
                 >
                   <option>General Inquiry</option>
                   <option>Technical Issue</option>
                   <option>Billing & Subscription</option>
                   <option>Feature Request</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <Label className="text-gray-700 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest">Message</Label>
                 <textarea 
                   required
                   value={formData.message}
                   onChange={(e) => setFormData({...formData, message: e.target.value})}
                   className="w-full rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 text-sm focus:ring-2 focus:ring-blue-500/10 min-h-[120px] outline-none font-medium" 
                   placeholder="Describe your issue in detail..."
                 ></textarea>
               </div>

               <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                 <Send className="w-5 h-5" /> Send Support Request
               </Button>
             </form>
           </div>
        </div>
      </div>
    </div>
  );
}
