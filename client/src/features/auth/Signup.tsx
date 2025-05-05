import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// Simple signup page without advanced form components
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
      if (!name || name.length < 3) {
        throw new Error("يجب أن يكون الاسم 3 أحرف على الأقل");
      }
      
      console.log("Creating user with email:", email);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      if (res.user) {
        console.log("User created successfully:", res.user.uid);
        const userData = {
          uid: res.user.uid,
          email,
          name,
          role: "CUSTOMER", // Using uppercase to match our schema enums
          createdAt: new Date().toISOString(),
        };
        
        console.log("Saving user data to Firestore:", userData);
        await setDoc(doc(db, "users", res.user.uid), userData);
        console.log("User data saved to Firestore");
        // Navigation is handled by auth context
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Custom Arabic error messages
      if (err.code === 'auth/email-already-in-use') {
        setError("البريد الإلكتروني مستخدم بالفعل");
      } else if (err.code === 'auth/weak-password') {
        setError("كلمة المرور ضعيفة جداً، يجب أن تحتوي على 6 أحرف على الأقل");
      } else if (err.code === 'auth/invalid-email') {
        setError("البريد الإلكتروني غير صالح");
      } else {
        setError(err.message || "فشل إنشاء الحساب");
      }
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
            autoComplete="name"
            minLength={3}
          />
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:border-green-400 outline-none" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:border-green-400 outline-none" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required 
            autoComplete="new-password"
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