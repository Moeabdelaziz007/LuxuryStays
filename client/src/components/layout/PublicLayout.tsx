import React from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-950 text-white p-4 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-green-400">StayX</Link>
          <nav className="space-x-4">
            <Link to="/" className="hover:text-green-400 transition-colors">الرئيسية</Link>
            <Link to="/about" className="hover:text-green-400 transition-colors">من نحن</Link>
            <Link to="/login" className="bg-green-400 text-black px-4 py-2 rounded hover:bg-green-500 transition-colors">تسجيل الدخول</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-black text-white">
        {children}
      </main>
      <Footer />
    </div>
  );
}