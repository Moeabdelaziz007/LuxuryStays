import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { LogoutButton } from "@/features/auth/Auth-pages";

export default function Sidebar() {
  const { user } = useAuth();

  const links = [];

  if (user?.role === "CUSTOMER") {
    links.push({ to: "/customer", label: "🏠 الصفحة الرئيسية" });
  }

  if (user?.role === "PROPERTY_ADMIN") {
    links.push({ to: "/property-admin", label: "🏠 إدارة العقارات" });
  }

  if (user?.role === "SUPER_ADMIN") {
    links.push(
      { to: "/super-admin", label: "📊 لوحة المشرف" },
      { to: "/property-admin", label: "🏘️ إدارة العقارات" },
      { to: "/customer", label: "👤 حسابات الزبائن" },
      { to: "/settings", label: "⚙️ إعدادات النظام" }
    );
  }

  return (
    <aside className="w-64 h-screen bg-gray-950 text-white p-6 flex flex-col justify-between">
      <nav className="flex flex-col gap-4">
        <h2 className="text-green-400 text-lg font-bold mb-4">📁 لوحة التحكم</h2>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="hover:text-green-400 transition">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}