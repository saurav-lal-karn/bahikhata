import { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';

import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bahikhata | Personal Expense Tracker",
    template: "%s | Bahikhata",
  },
  description: "Monitor your family ledgers, track expenses, and manage your budget with Bahikhata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AuthProvider>
          <ThemeProvider>
             <SidebarProvider>
                <SocketProvider>
                  {children}
                </SocketProvider>
                <Toaster 
                  position="top-right" 
                  containerStyle={{
                    zIndex: 100000,
                  }}
                />
             </SidebarProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
