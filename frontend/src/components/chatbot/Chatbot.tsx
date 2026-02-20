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
    Plus,
} from "lucide-react";

interface Message {
    id: string;
    text: string;
    sender: "bot" | "user";
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
                    sender: "bot",
                    timestamp: new Date(Date.now() - 3600000),
                },
            ],
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
                    sender: "bot",
                    timestamp: new Date(Date.now() - 86400000),
                },
            ],
        },
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
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showThreads, isExpanded]);

    const activeThread =
        threads.find((t) => t.id === activeThreadId) || threads[0];
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
                    sender: "bot",
                    timestamp: new Date(),
                },
            ],
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
            sender: "user",
            timestamp: new Date(),
        };

        setThreads((prev) =>
            prev.map((t) => {
                if (t.id === activeThreadId) {
                    return {
                        ...t,
                        messages: [...t.messages, userMsg],
                        lastMessage: userMsg.text,
                        timestamp: new Date(),
                    };
                }
                return t;
            })
        );

        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(userMsg.text),
                sender: "bot",
                timestamp: new Date(),
            };

            setThreads((prev) =>
                prev.map((t) => {
                    if (t.id === activeThreadId) {
                        return {
                            ...t,
                            messages: [...t.messages, botMsg],
                            lastMessage: botMsg.text,
                            timestamp: new Date(),
                        };
                    }
                    return t;
                })
            );
            setIsTyping(false);
        }, 1500);
    };

    const getBotResponse = (input: string): string => {
        const text = input.toLowerCase();
        if (text.includes("expense") || text.includes("spend"))
            return "You've spent ₹42,850 this month. Your largest category is 'Housing' at 30%. Would you like a detailed breakdown?";
        if (text.includes("income") || text.includes("earn"))
            return "Total family income for May is ₹1,04,400. You've received 85% of your expected payouts so far.";
        if (text.includes("budget"))
            return "You are currently within budget for all categories except 'Groceries', which is at 92%. Be careful!";
        if (text.includes("hello") || text.includes("hi"))
            return "Hello! I'm ready to analyze your financial data. What's on your mind?";
        return "That's interesting! I'm still learning, but I can help you with expense tracking, income analysis, and budget alerts.";
    };

    return (
        <div className="fixed right-6 bottom-6 z-[9999]">
            <div className="group/chat relative">
                {/* Tooltip */}
                {!isOpen && (
                    <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-lg border border-white/10 bg-gray-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white opacity-0 shadow-xl transition-opacity group-hover/chat:opacity-100 dark:border-gray-800 dark:bg-white dark:text-gray-900">
                        BahiAssistant Chat
                        <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-8 border-transparent border-l-gray-900 dark:border-l-white"></div>
                    </span>
                )}

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ${
                        isOpen
                            ? "scale-90 rotate-90 bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-110 active:scale-95"
                    }`}
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                    {isOpen ? (
                        <X className="h-7 w-7" />
                    ) : (
                        <MessageSquare className="h-7 w-7" />
                    )}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
                            1
                        </span>
                    )}
                </button>
            </div>

            {isOpen && (
                <div
                    className={`absolute right-0 bottom-20 ${isExpanded ? "h-[650px] w-[900px]" : "h-[600px] w-[400px]"} animate-in slide-in-from-bottom-4 zoom-in-95 flex max-h-[calc(100vh-8rem)] max-w-[calc(100vw-3rem)] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900`}
                >
                    <div
                        ref={sidebarRef}
                        className={` ${isExpanded ? "w-80" : "absolute inset-0 z-30 w-full md:w-80"} ${showThreads ? "flex" : "hidden"} flex shrink-0 flex-col border-r border-gray-50 bg-white shadow-xl transition-all md:shadow-none dark:border-gray-800 dark:bg-gray-900`}
                    >
                        <div className="flex items-center justify-between border-b border-gray-50 p-6 dark:border-gray-800">
                            {(isExpanded || showThreads) && (
                                <h5 className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                    Conversations
                                </h5>
                            )}
                            {!isExpanded && showThreads && (
                                <button
                                    onClick={() => setShowThreads(false)}
                                    className="p-2 text-gray-400 hover:text-blue-600 md:hidden"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="border-b border-gray-50 p-4 dark:border-gray-800">
                            <button
                                onClick={() => {
                                    createNewThread();
                                    if (!isExpanded) setShowThreads(false);
                                }}
                                className={`flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-xs font-bold text-white uppercase shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95`}
                            >
                                <Plus className="h-5 w-5 transition-transform hover:rotate-90" />
                                {(isExpanded || showThreads) && "New Chat"}
                            </button>
                        </div>
                        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-4">
                            {threads.map((thread) => (
                                <button
                                    key={thread.id}
                                    onClick={() => {
                                        setActiveThreadId(thread.id);
                                        if (!isExpanded) setShowThreads(false);
                                    }}
                                    className={`group relative flex w-full items-center justify-start rounded-2xl p-4 text-left transition-all ${
                                        activeThreadId === thread.id
                                            ? "border border-blue-100 bg-blue-50/30 shadow-sm dark:border-blue-900/30 dark:bg-blue-900/10"
                                            : "border border-transparent text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                                    }`}
                                >
                                    <div
                                        className={`flex w-full items-center gap-3`}
                                    >
                                        <div
                                            className={`shrink-0 rounded-xl p-2.5 transition-transform group-hover:scale-110 ${activeThreadId === thread.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/10" : "bg-gray-100 text-gray-400 dark:bg-gray-800"}`}
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        {(isExpanded || showThreads) && (
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={`truncate text-sm font-black ${activeThreadId === thread.id ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                                                >
                                                    {thread.title}
                                                </p>
                                                <p className="mt-0.5 truncate text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                                    {thread.lastMessage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {activeThreadId === thread.id &&
                                        (isExpanded || showThreads) && (
                                            <div className="absolute top-1/4 bottom-1/4 left-0 w-1 rounded-r-full bg-blue-600"></div>
                                        )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                            <div className="absolute top-0 right-0 scale-150 rotate-12 p-8 opacity-10">
                                <Sparkles className="h-20 w-20" />
                            </div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    <button
                                        ref={toggleButtonRef}
                                        onClick={() =>
                                            setShowThreads(!showThreads)
                                        }
                                        className="shrink-0 rounded-xl p-2 transition-colors hover:bg-white/10"
                                        title="Toggle Conversations"
                                    >
                                        <MoreHorizontal
                                            className={`h-5 w-5 transition-transform ${showThreads ? "rotate-90" : ""}`}
                                        />
                                    </button>
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 leading-none shadow-inner backdrop-blur-md">
                                        <Bot className="h-7 w-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="truncate text-lg leading-tight font-black">
                                            {activeThread.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                                                Online & Ready
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    <button
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        className="rounded-xl p-2 transition-colors hover:bg-white/10"
                                    >
                                        {isExpanded ? (
                                            <Minimize2 className="h-4 w-4" />
                                        ) : (
                                            <Maximize2 className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-xl p-2 transition-colors hover:bg-white/10"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto bg-gray-50/30 p-6 dark:bg-gray-900/10">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div
                                        className={`flex max-w-[85%] items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        <div
                                            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                                                msg.sender === "bot"
                                                    ? "border-blue-50 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20"
                                                    : "border-gray-50 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-800"
                                            }`}
                                        >
                                            {msg.sender === "bot" ? (
                                                <Bot className="h-4 w-4" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div
                                                className={`rounded-2xl p-4 text-sm leading-relaxed font-medium shadow-sm ${
                                                    msg.sender === "user"
                                                        ? "rounded-tr-none bg-blue-600 text-white"
                                                        : "rounded-tl-none border border-gray-100 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                            <p
                                                className={`px-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase ${msg.sender === "user" ? "text-right" : ""}`}
                                            >
                                                {msg.timestamp.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="animate-in fade-in flex justify-start duration-300">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl border border-blue-50 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></span>
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></span>
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-gray-50 px-6 py-3 dark:border-gray-800">
                            {["Budget status?", "Burn rate?", "Savings?"].map(
                                (action) => (
                                    <button
                                        key={action}
                                        onClick={() => {
                                            setInputValue(action);
                                        }}
                                        className="rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-xs font-bold whitespace-nowrap text-gray-500 transition-all hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-900/20"
                                    >
                                        {action}
                                    </button>
                                )
                            )}
                        </div>

                        <form
                            onSubmit={handleSend}
                            className="border-t border-gray-50 bg-white p-6 pt-2 dark:border-gray-800 dark:bg-gray-900"
                        >
                            <div className="group relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    placeholder="Ask BahiAssistant anything..."
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pr-14 pl-6 text-sm font-medium transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-xl bg-blue-600 p-2.5 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        className="text-gray-400 transition-colors hover:text-blue-500"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        className="text-gray-400 transition-colors hover:text-blue-500"
                                    >
                                        <ThumbsUp className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold tracking-widest text-gray-300 uppercase">
                                    Powered by Bahikhata AI
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
