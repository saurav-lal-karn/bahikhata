import { Metadata } from "next";
import React from "react";
import SupportPageClient from "./SupportPageClient";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with your Bahikhata account and financial management.",
};

export default function SupportPage() {
  return <SupportPageClient />;
}
