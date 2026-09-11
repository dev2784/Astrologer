import "../globals.css";
import Link from "next/link";
import { Sun, Menu } from "lucide-react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/ui/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://hatkeshwarjyotish.com"),

  title: {
    default:
      "Mangal Dosh Puja Ujjain | Mangalnath Mandir Puja | Hatkeshwar Jyotish",
    template: "%s | Hatkeshwar Jyotish",
  },

  description:
    "Book Mangal Dosh Puja, Mangal Bhat Puja, Mangalnath Mandir Puja, Kaal Sarp Dosh Puja, Yagya, Anushthan, Vivah Puja and Kundli services in Ujjain.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "Mangal Dosh Puja Ujjain | Mangalnath Mandir Puja",
    description:
      "Mangal Dosh Puja, Mangal Bhat Puja, Kaal Sarp Puja, Yagya, Anushthan, Vivah Puja and Kundli services in Ujjain.",
    url: "https://hatkeshwarjyotish.com",
    siteName: "Hatkeshwar Jyotish",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
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