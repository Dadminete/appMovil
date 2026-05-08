

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Quantum FinTech - Empresa Tecnológica",
  description: "Sistema de gestión financiera premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background circuit-dots pb-24 transition-colors duration-300">
        <AuthProvider>
          <ThemeProvider>
            <main className="flex-1">{children}</main>
            <Navbar />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


