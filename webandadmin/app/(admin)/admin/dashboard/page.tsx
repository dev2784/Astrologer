import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardCharts from "@/components/ui/DashboardCharts"; // Adjust path as needed
import { Users, CalendarCheck, Star } from "lucide-react";

// 1. Fetch User Profile
async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// 2. Fetch Dashboard Metrics (Currently Mocked - Connect to Fastify later)
async function getDashboardStats() {
  // TODO: Create an endpoint in Fastify (e.g., /admin/stats) to return real aggregated data.
  // Returning hardcoded data for now so the UI renders immediately.
  return {
    totalBookings: 142,
    pendingReviews: 12,
    activeUsers: 84,
    chartData: [
      { month: "Jan", bookings: 45, reviews: 12 },
      { month: "Feb", bookings: 52, reviews: 18 },
      { month: "Mar", bookings: 38, reviews: 15 },
      { month: "Apr", bookings: 65, reviews: 25 },
      { month: "May", bookings: 48, reviews: 10 },
      { month: "Jun", bookings: 74, reviews: 32 },
    ]
  };
}

export default async function DashboardPage() {
  // Fetch data in parallel to keep page load fast
  const [profileData, statsData] = await Promise.all([
    getProfile(),
    getDashboardStats()
  ]);

  // Security fallback
  if (!profileData || !profileData.user) {
    redirect("/admin");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, {profileData.user.email} ({profileData.user.role})</p>
      </div>
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <CalendarCheck size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Bookings</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{statsData.totalBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
            <Star size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{statsData.pendingReviews}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Users</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{statsData.activeUsers}</p>
          </div>
        </div>

      </div>

      {/* Render Client-Side Charts */}
      <DashboardCharts data={statsData.chartData} />

    </div>
  );
}