import React from "react";
import { Link } from "react-router-dom";

export function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">📌 من نحن - StayX</h1>
      <p className="text-lg leading-relaxed text-white/80 mb-4">
        StayX هي منصة ذكية لحجز الفلل والإقامات الفاخرة على الساحل الشمالي ورأس الحكمة. نهدف لتوفير تجربة صيفية استثنائية تشمل الإقامة، والخدمات، والترفيه، بواجهة فاخرة وسهلة.
      </p>
      <p className="text-lg leading-relaxed text-white/80 mb-4">
        تأسست StayX من قبل <strong className="text-green-400">محمد عبدالعزيز</strong>، طالب في جامعة Kennesaw State ومهتم بتقنية المعلومات والذكاء الاصطناعي.
      </p>
      <p className="text-lg leading-relaxed text-white/80">
        للتواصل: 📧 <a href="mailto:Amrikyy@gmail.com" className="underline text-green-400">Amrikyy@gmail.com</a> | 📞 مصر: +201094228044 | أمريكا: +17706160211
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white p-4 text-center border-t border-white/10">
      <p className="text-sm text-white/50">
        © {new Date().getFullYear()} StayX. جميع الحقوق محفوظة. | <Link to="/about" className="underline text-green-400 ml-2">من نحن</Link>
      </p>
    </footer>
  );
}