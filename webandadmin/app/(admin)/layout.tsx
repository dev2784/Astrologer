import "../globals.css";

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
            <a href="/admin/dashboard" className="p-3 rounded hover:bg-slate-800 transition">Dashboard</a>
            <a href="/admin/users" className="p-3 rounded hover:bg-slate-800 transition">Manage Users</a>
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