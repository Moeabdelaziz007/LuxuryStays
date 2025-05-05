import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
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
        // Navigation is handled by auth context
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg border border-green-400/20">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">📝 إنشاء حساب جديد</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="الاسم الكامل" 
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:border-green-400 outline-none" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:border-green-400 outline-none" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:border-green-400 outline-none" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
            minLength={6}
          />
          <button 
            type="submit" 
            className="bg-green-400 text-black font-bold py-2 px-4 w-full rounded hover:bg-green-500 transition-colors"
            disabled={loading}
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>
        
        <p className="text-sm mt-6 text-center">
          هل لديك حساب؟ <Link to="/login" className="text-green-400 hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}