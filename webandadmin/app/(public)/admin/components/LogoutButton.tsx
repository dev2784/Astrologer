"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    // 1. Destroy the client-side token
    localStorage.removeItem("token");
    
    // 2. Destroy the server-side cookie by backdating its expiration
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    
    // 3. Hard redirect to the login portal (forces middleware to re-evaluate)
    window.location.href = "/admin";
  };

  return (
    
      <button onClick={handleLogout} className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-sm font-semibold transition">Log Out</button>
    
  );
}