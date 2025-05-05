import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

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

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: res.user.uid,
          email: res.user.email,
          name: res.user.displayName,
          role: "CUSTOMER", // Using uppercase to match our schema enums
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">🔐 تسجيل الدخول</h2>
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 mb-4 rounded bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full p-3 mb-4 rounded bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="bg-green-400 text-black font-bold py-2 px-4 w-full rounded hover:scale-105">تسجيل الدخول</button>

        <div className="my-4 text-center">
          <button onClick={handleGoogleLogin} className="bg-white text-black font-bold py-2 px-4 rounded w-full">🟢 دخول باستخدام Google</button>
        </div>

        <p className="text-sm mt-4 text-center">ليس لديك حساب؟ <a href="/signup" className="text-green-400 underline">سجل الآن</a></p>
      </div>
    </div>
  );
}