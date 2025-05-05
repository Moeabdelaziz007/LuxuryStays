import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaUsers, FaHome, FaTools, FaBullhorn, FaPalette, FaBell } from "react-icons/fa";

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const propsSnap = await getDocs(collection(db, "properties"));
      setProperties(propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const servSnap = await getDocs(collection(db, "services"));
      setServices(servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);
  
  const cards = [
    { 
      icon: <FaUsers size={24} />, 
      label: `المستخدمين (${users.length})`, 
      desc: "إدارة الحسابات والصلاحيات", 
      color: "bg-gradient-to-br from-green-400 to-lime-500" 
    },
    { 
      icon: <FaHome size={24} />, 
      label: `العقارات (${properties.length})`, 
      desc: "التحكم بالعقارات المعروضة", 
      color: "bg-gradient-to-br from-blue-400 to-cyan-500"
    },
    { 
      icon: <FaTools size={24} />, 
      label: `الخدمات (${services.length})`, 
      desc: "تعديل وإضافة الخدمات", 
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    { 
      icon: <FaPalette size={24} />, 
      label: "الثيم والتصميم", 
      desc: "تخصيص الهوية البصرية", 
      color: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    { 
      icon: <FaBell size={24} />, 
      label: "الإشعارات", 
      desc: "إرسال تنبيهات عامة أو خاصة", 
      color: "bg-gradient-to-br from-red-400 to-pink-600"
    },
    { 
      icon: <FaBullhorn size={24} />, 
      label: "العروض", 
      desc: "إدارة العروض الترويجية", 
      color: "bg-gradient-to-br from-indigo-500 to-blue-700"
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-10 text-center">لوحة المشرف العام</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className={`rounded-2xl p-6 shadow-xl ${card.color} hover:scale-105 transition-all cursor-pointer`}>
            <div className="flex items-center gap-4">
              <div className="bg-black bg-opacity-20 p-3 rounded-full">{card.icon}</div>
              <div>
                <h3 className="text-xl font-bold">{card.label}</h3>
                <p className="text-sm text-white/80">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}