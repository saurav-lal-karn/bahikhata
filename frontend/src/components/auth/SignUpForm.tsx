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

export default function SignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChecked) {
            setError(
                "Please agree to the Terms of Service and Privacy Policy."
            );
            return;
        }
        setError(null);
        setIsSubmitting(true);

        try {
            await signup({ firstName, lastName, email, password });
        } catch (err: any) {
            setError(
                err.message || "Failed to create account. Please try again."
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

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-0">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
                            Create{" "}
                            <span className="text-blue-400 italic">
                                Account
                            </span>
                        </h1>
                        <p className="text-sm text-gray-400">
                            Start your journey to financial freedom today.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
                                        First Name
                                    </Label>
                                    <Input
                                        placeholder="Saurav"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
                                        Last Name
                                    </Label>
                                    <Input
                                        placeholder="Karn"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block text-xs font-bold tracking-wider text-gray-300 uppercase">
                                    Email Address
                                </Label>
                                <Input
                                    placeholder="name@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-blue-500"
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
                                        className="rounded-xl border-white/10 bg-white/5 text-white transition-all placeholder:text-gray-600 focus:border-blue-500"
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

                            <div className="flex items-start gap-3 py-2">
                                <Checkbox
                                    checked={isChecked}
                                    onChange={setIsChecked}
                                    className="mt-1 rounded-md border-white/20"
                                />
                                <p className="text-xs leading-relaxed font-medium text-gray-400">
                                    By signing up, you agree to our{" "}
                                    <Link
                                        href="#"
                                        className="text-blue-400 hover:underline"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="#"
                                        className="text-blue-400 hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-black shadow-xl shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                                </Button>
                            </div>
                        </form>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="mx-4 flex-shrink text-xs font-bold tracking-widest text-gray-500 uppercase">
                                Or
                            </span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

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

                        <p className="text-center text-sm font-medium text-gray-500">
                            Already have an account? {""}
                            <Link
                                href="/signin"
                                className="font-black text-blue-400 transition-colors hover:text-blue-300"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
