"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full bg-gray-950 text-white min-h-screen">
      <div className="w-full max-w-md px-4 sm:px-0 sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white group"
        >
          <ChevronLeftIcon className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md px-4 sm:px-0 mx-auto py-10">
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-black tracking-tight text-white">
              Create <span className="text-blue-400 italic">Account</span>
            </h1>
            <p className="text-sm text-gray-400">
              Start your journey to financial freedom today.
            </p>
          </div>

          <div className="space-y-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-gray-300 mb-2 block font-bold text-xs uppercase tracking-wider">
                    First Name
                  </Label>
                  <Input 
                    placeholder="Saurav" 
                    type="text" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block font-bold text-xs uppercase tracking-wider">
                    Last Name
                  </Label>
                  <Input 
                    placeholder="Karn" 
                    type="text" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block font-bold text-xs uppercase tracking-wider">
                  Email Address
                </Label>
                <Input 
                  placeholder="name@example.com" 
                  type="email" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <Label className="text-gray-300 mb-2 block font-bold text-xs uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl focus:border-blue-500 transition-all"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <Checkbox checked={isChecked} onChange={setIsChecked} className="mt-1 border-white/20 rounded-md" />
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  By signing up, you agree to our {" "}
                  <Link href="#" className="text-blue-400 hover:underline">Terms of Service</Link> and {" "}
                  <Link href="#" className="text-blue-400 hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl py-4 font-black text-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-xl shadow-blue-500/20">
                  Sign Up
                </Button>
              </div>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button className="flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10">
                <Image src="/images/icon/google.png" alt="Google" width={18} height={18} />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10">
                <span className="text-gray-400">X</span>
                Coming Soon
              </button>
            </div>

            <p className="text-sm font-medium text-center text-gray-500">
              Already have an account? {""}
              <Link
                href="/signin"
                className="text-blue-400 font-black hover:text-blue-300 transition-colors"
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
