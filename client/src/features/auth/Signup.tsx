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
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(to right, rgba(57, 255, 20, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(57, 255, 20, 0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>
      
      {/* Floating Neon Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] right-[15%] w-32 h-32 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
        <div className="absolute bottom-[15%] left-[10%] w-48 h-48 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
        <div className="absolute top-[40%] left-[5%] w-24 h-24 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-black/50 p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#39FF14]/20 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-[80px] opacity-70"></div>
          
          {/* Logo */}
          <div className="text-center mb-6 relative">
            <h1 className="inline-block text-[40px] font-black relative mb-2">
              <span className="text-[#39FF14] animate-neon-pulse" 
                    style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                Stay
              </span>
              <span className="text-white">X</span>
            </h1>
            <p className="text-lg text-gray-300">انضم إلينا اليوم ✨</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-md mb-6 text-sm animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="أدخل اسمك الكامل" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  minLength={3}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-1.5 transition group-focus-within:text-[#39FF14]">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="أدخل كلمة مرور قوية" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">يجب أن تكون كلمة المرور 6 أحرف على الأقل</p>
            </div>
            
            <button 
              type="submit" 
              className="relative group w-full mt-6"
              disabled={loading}
            >
              <div className="relative z-10 bg-[#39FF14] text-black font-bold py-3 rounded-lg w-full text-center transform group-hover:scale-[1.01] transition-transform">
                {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </div>
              <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              بالتسجيل، أنت توافق على <span className="text-[#39FF14]">شروط الخدمة</span> و <span className="text-[#39FF14]">سياسة الخصوصية</span>
            </p>
          </div>
          
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black/50 px-4 text-sm text-gray-500 backdrop-blur-md">أو</span>
            </div>
          </div>
          
          <p className="text-sm mt-6 text-center text-gray-400">
            هل لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-[#39FF14] hover:text-white transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}