"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login({ email, password });
        } catch (err: any) {
            setError(
                err.message ||
                    "Failed to sign in. Please check your credentials."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-1 flex-col bg-gray-950 text-white lg:w-1/2">
            <div className="mx-auto mb-5 w-full max-w-md px-4 sm:px-0 sm:pt-10">
                <Link
                    href="/"
                    className="group inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
                >
                    <ChevronLeftIcon className="transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 sm:px-0">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
                            Welcome{" "}
                            <span className="text-purple-400 italic">Back</span>
                        </h1>
                        <p className="text-sm text-gray-400">
                            Sign in to manage your family ledgers.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition-all hover:bg-white/10">
                                <Image
                                    src="/images/icon/google.png"
                                    alt="Google"
                                    width={18}
                                    height={18}
                                />
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition-all hover:bg-white/10">
                                <span className="text-gray-400">X</span>
                                Coming Soon
                            </button>
                        </div>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="mx-4 flex-shrink text-xs font-bold tracking-widest text-gray-500 uppercase">
                                Or
                            </span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            <div>
                                <Label className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
                                    Email Address
                                </Label>
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-purple-500"
                                        required
                                    />
                                    <span
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer text-gray-500 transition-colors hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <EyeIcon />
                                        ) : (
                                            <EyeCloseIcon />
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={setIsChecked}
                                        className="rounded-md border-white/20"
                                    />
                                    <span className="font-medium text-gray-400">
                                        Keep me logged in
                                    </span>
                                </div>
                                <Link
                                    href="/reset-password"
                                    className="font-bold text-purple-400 transition-colors hover:text-purple-300"
                                >
                                    Forgot?
                                </Link>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-lg font-black shadow-xl shadow-purple-500/20 transition-all hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Signing In..." : "Sign In"}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-sm font-medium text-gray-500">
                            Don&apos;t have an account? {""}
                            <Link
                                href="/signup"
                                className="font-black text-purple-400 transition-colors hover:text-purple-300"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
