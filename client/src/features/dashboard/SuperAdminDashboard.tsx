import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaUsers, FaHome, FaTools, FaBullhorn, FaPalette, FaBell } from "react-icons/fa";

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [view, setView] = useState("main");
  const [notification, setNotification] = useState("");
  const [target, setTarget] = useState("all");
  const [sent, setSent] = useState(false);
  const [theme, setTheme] = useState({ primary: "#00FF94", background: "#000000" });
  const [savedTheme, setSavedTheme] = useState(false);
  const [newOffer, setNewOffer] = useState({ title: "", description: "", active: true });

  useEffect(() => {
    const fetchData = async () => {
      setUsers((await getDocs(collection(db, "users"))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProperties((await getDocs(collection(db, "properties"))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setServices((await getDocs(collection(db, "services"))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setOffers((await getDocs(collection(db, "offers"))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const saveTheme = async () => {
    await setDoc(doc(db, "settings", "theme"), theme);
    setSavedTheme(true);
    setTimeout(() => setSavedTheme(false), 2000);
  };
  
  const addOffer = async () => {
    await addDoc(collection(db, "offers"), {
      ...newOffer,
      createdAt: serverTimestamp(),
    });
    setNewOffer({ title: "", description: "", active: true });
    
    // Refresh offers
    const offersSnapshot = await getDocs(collection(db, "offers"));
    setOffers(offersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    setView("offers");
  };

  const sendNotification = async () => {
    if (!notification) return;
    const payload = {
      message: notification,
      target,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "notifications"), payload);
    setSent(true);
    setNotification("");
  };

  if (view === "users") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">👤 إدارة المستخدمين</h1>
        <button onClick={() => setView("main")} className="mb-6 text-sm text-green-400 underline">← رجوع</button>
        <div className="grid md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-gray-900 p-4 rounded-xl">
              <h3 className="font-bold text-lg text-green-400">{u.name || "مستخدم بدون اسم"}</h3>
              <p className="text-sm text-white/80">📧 {u.email}</p>
              <p className="text-sm text-gray-400">🎭 الدور: {u.role || "غير محدد"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "services") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">🛎️ إدارة الخدمات</h1>
        <button onClick={() => setView("main")} className="mb-6 text-sm text-green-400 underline">← رجوع</button>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-gray-900 p-4 rounded-xl">
              <h3 className="font-bold text-lg text-green-400">{s.title}</h3>
              <p className="text-sm text-white/80">💬 {s.description}</p>
              <p className="text-sm text-gray-400">💲 السعر: {s.price || 0}$</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "notifications") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">🔔 إرسال إشعار</h1>
        <button onClick={() => setView("main")} className="mb-6 text-sm text-green-400 underline">← رجوع</button>
        <div className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto">
          <label className="block mb-4">
            <span className="text-white">📝 نص الإشعار:</span>
            <textarea value={notification} onChange={(e) => setNotification(e.target.value)} rows={4} className="w-full mt-2 p-2 rounded bg-gray-800 text-white" />
          </label>
          <label className="block mb-4">
            <span className="text-white">🎯 الفئة المستهدفة:</span>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full mt-2 p-2 rounded bg-gray-800 text-white">
              <option value="all">جميع المستخدمين</option>
              <option value="customer">العملاء فقط</option>
              <option value="admin">المشرفين فقط</option>
            </select>
          </label>
          <button onClick={sendNotification} className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105">
            إرسال الإشعار
          </button>
          {sent && <p className="text-green-400 mt-4">✅ تم إرسال الإشعار بنجاح!</p>}
        </div>
      </div>
    );
  }

  if (view === "theme") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">🎨 تخصيص الهوية البصرية</h1>
        <button onClick={() => setView("main")} className="mb-6 text-sm text-green-400 underline">← رجوع</button>
        <div className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-green-400 mb-2">اللون الرئيسي</h3>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={theme.primary} 
                onChange={(e) => setTheme({...theme, primary: e.target.value})} 
                className="w-16 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-white">{theme.primary}</span>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-lg text-green-400 mb-2">لون الخلفية</h3>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={theme.background} 
                onChange={(e) => setTheme({...theme, background: e.target.value})} 
                className="w-16 h-10 rounded cursor-pointer"
              />
              <span className="text-sm text-white">{theme.background}</span>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={saveTheme} className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105">
              حفظ التخصيص
            </button>
            {savedTheme && <p className="text-green-400 mt-4">✅ تم حفظ التخصيص بنجاح!</p>}
          </div>
        </div>
      </div>
    );
  }

  if (view === "offers") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">🎁 العروض الترويجية</h1>
        <button onClick={() => setView("main")} className="mb-4 text-sm text-green-400 underline">← رجوع</button>
        <button onClick={() => setView("add-offer")} className="mb-6 ml-4 text-sm bg-green-500 px-4 py-2 rounded font-bold">➕ إضافة عرض</button>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-gray-900 p-4 rounded-xl">
              <h3 className="font-bold text-lg text-green-400">{offer.title}</h3>
              <p className="text-sm text-white/80">{offer.description}</p>
              <p className="text-sm text-gray-400">⚡ الحالة: {offer.active ? "فعالة" : "معطلة"}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (view === "add-offer") {
    return (
      <div className="bg-black text-white min-h-screen p-8">
        <h1 className="text-3xl font-bold text-green-400 mb-6">➕ إضافة عرض جديد</h1>
        <button onClick={() => setView("offers")} className="mb-6 text-sm text-green-400 underline">← رجوع</button>
        <div className="bg-gray-900 p-6 rounded-xl max-w-xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="عنوان العرض"
            value={newOffer.title}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <textarea
            placeholder="وصف العرض"
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
            className="w-full p-2 rounded bg-gray-800 text-white"
            rows={4}
          />
          <label className="text-white text-sm">
            <input
              type="checkbox"
              checked={newOffer.active}
              onChange={(e) => setNewOffer({ ...newOffer, active: e.target.checked })}
              className="mr-2"
            />
            تفعيل العرض عند الإضافة
          </label>
          <button onClick={addOffer} className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105">
            حفظ العرض
          </button>
        </div>
      </div>
    );
  }
  
  const cards = [
    { 
      icon: <FaUsers size={24} />, 
      label: `المستخدمين (${users.length})`, 
      desc: "إدارة الحسابات والصلاحيات", 
      color: "bg-gradient-to-br from-green-400 to-lime-500",
      onClick: () => setView("users")
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
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      onClick: () => setView("services")
    },
    { 
      icon: <FaPalette size={24} />, 
      label: "الثيم والتصميم", 
      desc: "تخصيص الهوية البصرية", 
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      onClick: () => setView("theme")
    },
    { 
      icon: <FaBell size={24} />, 
      label: "الإشعارات", 
      desc: "إرسال تنبيهات عامة أو خاصة", 
      color: "bg-gradient-to-br from-red-400 to-pink-600",
      onClick: () => setView("notifications")
    },
    { 
      icon: <FaBullhorn size={24} />, 
      label: `العروض (${offers.length})`, 
      desc: "إدارة العروض الترويجية", 
      color: "bg-gradient-to-br from-indigo-500 to-blue-700",
      onClick: () => setView("offers")
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-4xl font-bold text-green-400 mb-10 text-center">لوحة المشرف العام</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div 
            key={i} 
            onClick={card.onClick} 
            className={`rounded-2xl p-6 shadow-xl ${card.color} hover:scale-105 transition-all cursor-pointer`}
          >
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