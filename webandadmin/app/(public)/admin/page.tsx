"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Fixed endpoint: Ensure it matches Fastify's /api/auth prefix
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Security check: Ensure the person logging in is actually an ADMIN
      if (data.user.role !== "ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }

      // Keep localStorage for easy client-side API requests
      localStorage.setItem("token", data.token);

      // Add the token to a browser cookie so the Next.js server can read it
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict${window.location.protocol === "https:" ? "; Secure" : ""}`;
      
      // Redirect to the admin dashboard
      window.location.href = "/admin/dashboard";
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
        </div>

        {/* The Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 font-medium rounded text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="admin@shreemahakal.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition ${
                isLoading ? "bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={isLoading ? "loading" : "idle"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {isLoading ? "Authenticating..." : "Secure Sign In"}
                </motion.span>
              </AnimatePresence>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}