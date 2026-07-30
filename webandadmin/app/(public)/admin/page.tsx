"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = activeTab === "login" ? "/auth/login" : "/auth/register";
    
    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (activeTab === "login") {
        // Keep localStorage for easy client-side API requests
        localStorage.setItem("token", data.token);

        // Add the token to a browser cookie so the Next.js server can read it
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
        // Redirect to the admin dashboard
        window.location.href = "/admin/dashboard";
      } else {
        // If registration was successful, switch to login tab
        setActiveTab("login");
        alert("Registration successful. Please log in.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Animated Tabs Header */}
        <div className="flex relative bg-slate-900 p-2">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "login" | "register")}
              className={`flex-1 py-3 text-sm font-medium z-10 transition-colors ${
                activeTab === tab ? "text-slate-900" : "text-white hover:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              
              {/* The Sliding Pill Animation */}
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-y-2 bg-white rounded-md z-[-1]"
                  style={{ width: "calc(50% - 12px)" }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* The Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
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
              />
            </div>

            {/* Form Button with AnimatePresence for smooth text changes */}
            <button
              type="submit"
              className="mt-4 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {activeTab === "login" ? "Sign In to Admin" : "Create Account"}
                </motion.span>
              </AnimatePresence>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}