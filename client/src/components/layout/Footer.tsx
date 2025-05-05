import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white p-4 text-center border-t border-white/10">
      <p className="text-sm text-white/50">© {new Date().getFullYear()} StayX. جميع الحقوق محفوظة.</p>
    </footer>
  );
}