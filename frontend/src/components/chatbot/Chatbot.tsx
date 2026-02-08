"use client";
import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  MoreHorizontal,
  ThumbsUp,
  RotateCcw,
  Maximize2,
  Minimize2,
  Plus
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>("1");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "Budget Analysis",
      lastMessage: "You have spent 92% of your 'Groceries' budget.",
      timestamp: new Date(),
      messages: [
        {
          id: "m1",
          text: "Namaste! I'm BahiAssistant. I've analyzed your May budget. You're Doing great, but your grocery spending is a bit high this month.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 3600000)
        }
      ]
    },
    {
      id: "2",
      title: "Family Income",
      lastMessage: "Total family income for May is ₹1,04,400.",
      timestamp: new Date(Date.now() - 86400000),
      messages: [
        {
          id: "m2",
          text: "I see you're asking about family earnings. Total family income for May is ₹1,04,400 across all members.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 86400000)
        }
      ]
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isExpanded && 
        showThreads && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setShowThreads(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showThreads, isExpanded]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const messages = activeThread.messages;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const createNewThread = () => {
    const newId = Date.now().toString();
    const newThread: Thread = {
      id: newId,
      title: "New Discussion",
      lastMessage: "Started just now",
      timestamp: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          text: "Hello! I'm ready to help with a new financial topic. What's on your mind?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newId);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, userMsg],
          lastMessage: userMsg.text,
          timestamp: new Date()
        };
      }
      return t;
    }));

    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMsg.text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, botMsg],
            lastMessage: botMsg.text,
            timestamp: new Date()
          };
        }
        return t;
      }));
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    const text = input.toLowerCase();
    if (text.includes("expense") || text.includes("spend")) return "You've spent ₹42,850 this month. Your largest category is 'Housing' at 30%. Would you like a detailed breakdown?";
    if (text.includes("income") || text.includes("earn")) return "Total family income for May is ₹1,04,400. You've received 85% of your expected payouts so far.";
    if (text.includes("budget")) return "You are currently within budget for all categories except 'Groceries', which is at 92%. Be careful!";
    if (text.includes("hello") || text.includes("hi")) return "Hello! I'm ready to analyze your financial data. What's on your mind?";
    return "That's interesting! I'm still learning, but I can help you with expense tracking, income analysis, and budget alerts.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="relative group/chat">
        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover/chat:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 dark:border-gray-800">
            BahiAssistant Chat
            <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
          </span>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden
            ${isOpen 
              ? 'rotate-90 bg-gray-900 dark:bg-white text-white dark:text-gray-900 scale-90' 
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-110 active:scale-95'}`}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-bounce">
              1
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className={`absolute bottom-20 right-0 ${isExpanded ? 'w-[900px] h-[650px]' : 'w-[400px] h-[600px]'} max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 transition-all`}>
          
          <div 
            ref={sidebarRef}
            className={`
              ${isExpanded ? 'w-80' : 'w-full md:w-80 absolute inset-0 z-30'} 
              ${showThreads ? 'flex' : 'hidden'}
              border-r border-gray-50 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col shrink-0 transition-all shadow-xl md:shadow-none
            `}
          >
            <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
              {(isExpanded || showThreads) && <h5 className="font-black text-xs uppercase tracking-widest text-gray-400">Conversations</h5>}
              {!isExpanded && showThreads && (
                <button onClick={() => setShowThreads(false)} className="md:hidden p-2 text-gray-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
              )}
            </div>
            <div className="p-4 border-b border-gray-50 dark:border-gray-800">
              <button 
                onClick={() => { createNewThread(); if(!isExpanded) setShowThreads(false); }}
                className={`w-full h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase shadow-lg shadow-blue-500/20 transition-all active:scale-95 px-4`}
              >
                <Plus className="w-5 h-5 transition-transform hover:rotate-90" />
                {(isExpanded || showThreads) && "New Chat"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => { setActiveThreadId(thread.id); if(!isExpanded) setShowThreads(false); }}
                  className={`w-full text-left rounded-2xl transition-all group relative flex items-center p-4 justify-start
                    ${activeThreadId === thread.id 
                      ? 'bg-blue-50/30 dark:bg-blue-900/10 shadow-sm border border-blue-100 dark:border-blue-900/30' 
                      : 'border border-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/30 text-gray-400'}`}
                >
                  <div className={`flex items-center gap-3 w-full`}>
                    <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 
                      ${activeThreadId === thread.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/10' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    {(isExpanded || showThreads) && (
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-black truncate ${activeThreadId === thread.id ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                          {thread.title}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest mt-0.5">
                          {thread.lastMessage}
                        </p>
                      </div>
                    )}
                  </div>
                  {activeThreadId === thread.id && (isExpanded || showThreads) && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
                <Sparkles className="w-20 h-20" />
              </div>
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    ref={toggleButtonRef}
                    onClick={() => setShowThreads(!showThreads)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
                    title="Toggle Conversations"
                  >
                    <MoreHorizontal className={`w-5 h-5 transition-transform ${showThreads ? 'rotate-90' : ''}`} />
                  </button>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner shrink-0 leading-none">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-lg leading-tight truncate">
                      {activeThread.title}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online & Ready</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-gray-900/10">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-1
                      ${msg.sender === 'bot' 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 border-blue-50 dark:border-blue-800' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-50 dark:border-gray-700'}`}>
                      {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm
                        ${msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'}`}>
                        {msg.text}
                      </div>
                      <p className={`text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 border border-blue-50 dark:border-blue-800 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-6 py-3 border-t border-gray-50 dark:border-gray-800 flex gap-2 overflow-x-auto no-scrollbar">
              {['Budget status?', 'Burn rate?', 'Savings?'].map((action) => (
                <button 
                  key={action}
                  onClick={() => {
                    setInputValue(action);
                  }}
                  className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 hover:text-blue-600 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold whitespace-nowrap transition-all"
                >
                  {action}
                </button>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-6 pt-2 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
              <div className="relative group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask BahiAssistant anything..."
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <button type="button" className="text-gray-400 hover:text-blue-500 transition-colors"><RotateCcw className="w-4 h-4" /></button>
                  <button type="button" className="text-gray-400 hover:text-blue-500 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Powered by Bahikhata AI</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
