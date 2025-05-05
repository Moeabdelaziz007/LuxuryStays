import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email,
          name,
          role: "CUSTOMER", // Using uppercase to match our schema enums
          createdAt: new Date().toISOString(),
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      // TODO: Add proper error handling
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">📝 إنشاء حساب جديد</h2>
        <input type="text" placeholder="الاسم الكامل" className="w-full p-3 mb-4 rounded bg-gray-800" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 mb-4 rounded bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-4 rounded bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup} className="bg-green-400 text-black font-bold py-2 px-4 w-full rounded hover:scale-105">إنشاء الحساب</button>
        <p className="text-sm mt-4 text-center">هل لديك حساب؟ <a href="/login" className="text-green-400 underline">تسجيل الدخول</a></p>
      </div>
    </div>
  );
}