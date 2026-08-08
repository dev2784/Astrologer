import "../globals.css";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel",
  description: "Secure management dashboard",
};

import LogoutButton from "../(public)/admin/components/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight">Admin System</h2>
          </div>
          <nav className="flex-1 px-4 flex flex-col gap-2">
            <Link href="/admin/dashboard" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">Dashboard</Link>
            <Link href="/admin/categories" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">Manage Categories</Link>
            <Link href="/admin/pujas" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Pujas
            </Link>
            <Link href="/admin/booking" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Bookings
            </Link>
            <Link href="/admin/muhurat" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Muhurat
            </Link>
            <Link href="/admin/panchang" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Panchang
            </Link>
            <Link href="/admin/gallery" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Gallery
            </Link>
            <Link href="/admin/review" className="block px-4 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-100 hover:text-slate-700 transition">
              Manage Review
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-700">
           <LogoutButton />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4 flex justify-end">
            <span className="text-sm font-medium text-gray-600">Admin Session Active</span>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
