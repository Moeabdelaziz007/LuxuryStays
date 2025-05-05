import React from "react";
import SmartHeader from "./SmartHeader";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SmartHeader />
        <main className="flex-1 overflow-y-auto bg-black text-white p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}