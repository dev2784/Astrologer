import "../globals.css";
import { Sun, Menu } from "lucide-react";

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
      <body className="bg-slate-50 text-slate-900 antialiased flex flex-col min-h-screen">
        
        {/* UNIVERSAL HEADER */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo & Brand Name */}
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white group-hover:bg-orange-500 transition">
                  <Sun size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-serif text-red-900 leading-none">
                    Acharya Ji
                  </h1>
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">
                    Vedic Astrologer
                  </span>
                </div>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-8 font-medium text-slate-600">
                <a href="/" className="hover:text-orange-600 transition">Home</a>
                <a href="/services" className="hover:text-orange-600 transition">Services</a>
                <a href="/muhurat" className="hover:text-orange-600 transition">Muhurat</a>
                <a href="#book" className="text-orange-600 hover:text-red-900 transition">Contact</a>
              </nav>

              {/* Mobile Menu Button (Functionality to be added later) */}
              <div className="md:hidden flex items-center">
                <button className="text-slate-600 hover:text-orange-600 focus:outline-none">
                  <Menu size={28} />
                </button>
              </div>
              
            </div>
          </div>
        </header>

        {/* MAIN PAGE CONTENT (This is where page.tsx gets injected) */}
        <main className="flex-1">
          {children}
        </main>

        {/* UNIVERSAL FOOTER */}
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Jyotishacharya Services. All rights reserved.</p>
        </footer>

      </body>
    </html>
  );
}