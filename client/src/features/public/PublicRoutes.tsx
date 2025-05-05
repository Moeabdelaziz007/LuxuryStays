// ✅ PublicRoutes.tsx — ربط صفحة من نحن بمسارات الزوار
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AboutUs } from "@/components/AboutFooter";
import PublicHome from "@/features/public/Home";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
}