import React from "react";
import SmartHeader from "@/components/layout/SmartHeader";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SmartHeader />
        <main className="flex-1 overflow-y-auto bg-black text-white p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export function PropertyAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SmartHeader />
        <main className="flex-1 overflow-y-auto bg-black text-white p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SmartHeader />
        <main className="flex-1 overflow-y-auto bg-black text-white p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}