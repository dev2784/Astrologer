import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. Server-side fetch function
async function getProfile() {
  // Await the cookies object (Required in Next.js 15+)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  // 2. Hit your Fastify backend with the token attached
  const res = await fetch("process.env.NEXT_PUBLIC_API_BASE_URL/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Prevent Next.js from aggressively caching this dynamic data
    cache: "no-store", 
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardPage() {
  const data = await getProfile();

  // 3. Security fallback: If the backend rejects the token (e.g., expired), kick them out
  if (!data || !data.user) {
    redirect("/admin");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, {data.user.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Account Role</h3>
          <p className="text-2xl font-bold mt-2 text-slate-900">
            {data.user.role}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
          <p className="text-lg font-bold mt-2 text-slate-900">
            {new Date(data.user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}