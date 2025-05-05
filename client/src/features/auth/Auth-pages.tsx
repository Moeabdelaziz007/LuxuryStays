import React from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-md text-sm transition-colors"
    >
      تسجيل الخروج
    </button>
  );
}