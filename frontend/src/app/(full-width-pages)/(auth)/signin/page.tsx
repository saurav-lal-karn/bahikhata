import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Bahikhata",
  description: "Sign in to your Bahikhata account to manage your family expenses.",
};

export default function SignIn() {
  return <SignInForm />;
}
