"use client"; // Required for SessionProvider & AuthProvider

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./AuthProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </div>
      </AuthProvider>
    </SessionProvider>
  );
}
