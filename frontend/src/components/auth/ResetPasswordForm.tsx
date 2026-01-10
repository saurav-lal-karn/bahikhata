"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSent(true);
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-gray-950 text-white min-h-screen">
      <div className="w-full max-w-md px-4 sm:px-0 sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white group"
        >
          <ChevronLeftIcon className="group-hover:-translate-x-1 transition-transform" />
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-4 sm:px-0 mx-auto">
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          {!isSent ? (
            <>
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
                  Reset <span className="text-pink-400 italic">Password</span>
                </h1>
                <p className="text-sm text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-2 block font-bold text-xs uppercase tracking-wider">
                    Email Address
                  </Label>
                  <Input 
                    placeholder="name@example.com" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-pink-500 transition-all w-full"
                    required
                  />
                </div>

                <div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl py-4 font-black text-lg hover:from-pink-500 hover:to-purple-500 transition-all shadow-xl shadow-pink-500/20">
                    Send Reset Link
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black mb-4">Check your email</h2>
              <p className="text-gray-400 mb-8">
                We've sent a password reset link to <br />
                <span className="text-white font-bold">{email}</span>
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-pink-400 font-bold hover:text-pink-300 transition-colors"
              >
                Didn't receive it? Try again
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm font-medium text-gray-500">
              Remember your password? {""}
              <Link
                href="/signin"
                className="text-pink-400 font-black hover:text-pink-300 transition-colors"
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
