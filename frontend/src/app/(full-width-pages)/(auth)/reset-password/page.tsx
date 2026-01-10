import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Bahikhata",
  description: "Reset your Bahikhata password to regain access to your account.",
};

export default function ResetPassword() {
  return <ResetPasswordForm />;
}
