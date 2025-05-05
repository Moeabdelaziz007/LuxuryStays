import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res.user) navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // TODO: Add proper error handling
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">🔐 تسجيل الدخول</h2>
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 mb-4 rounded bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-4 rounded bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-green-400 text-black font-bold py-2 px-4 w-full rounded hover:scale-105">تسجيل الدخول</button>
        <p className="text-sm mt-4 text-center">ليس لديك حساب؟ <a href="/signup" className="text-green-400 underline">سجل الآن</a></p>
      </div>
    </div>
  );
}