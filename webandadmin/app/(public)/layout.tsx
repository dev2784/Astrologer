import "../globals.css";
import Link from "next/link";
import { Sun, Menu } from "lucide-react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/ui/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "Pandit Ji | Vedic Astrology & Puja Services",
  description: "Authentic Vedic Rituals, Shadi Byah, and Astrological Guidance.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <LanguageProvider>
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">
        
        {/* UNIVERSAL HEADER */}
        <Navbar />
        <Breadcrumbs />

        {/* MAIN PAGE CONTENT (This is where page.tsx gets injected) */}
        <main className="flex-1">
          {children}
        </main>

        {/* UNIVERSAL FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jyotishacharya Services. All rights reserved.</p>
        </footer>
        </body>
        </LanguageProvider>
    </html>
  );
}