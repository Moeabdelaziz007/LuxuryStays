import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Simple login page without advanced form components
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation is handled by auth context
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential') {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        setError(err.message || "فشل تسجيل الدخول");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const res = await signInWithPopup(auth, provider);
      // Check if user exists in Firestore
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: res.user.uid,
          email: res.user.email,
          name: res.user.displayName,
          role: "CUSTOMER", // Default role
          createdAt: new Date().toISOString(),
        });
      }
      // Navigation is handled by auth context
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("هذا النطاق غير مصرح له بتسجيل الدخول باستخدام Google. الرجاء إضافة النطاق في إعدادات Firebase Authentication.");
      } else {
        setError(err.message || "فشل تسجيل الدخول باستخدام Google");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg border border-green-400/20">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">🔐 تسجيل الدخول</h2>
        
        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
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
            autoComplete="current-password"
            minLength={6}
          />
          <button 
            type="submit" 
            className="bg-green-400 text-black font-bold py-2 px-4 w-full rounded hover:bg-green-500 transition-colors"
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-sm text-gray-500">أو</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="flex items-center justify-center gap-2 bg-white text-black font-bold py-2 px-4 rounded w-full hover:bg-gray-200 transition-colors"
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span>جاري تسجيل الدخول...</span>
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>دخول باستخدام Google</span>
            </>
          )}
        </button>

        <p className="text-sm mt-6 text-center">
          ليس لديك حساب؟ <Link to="/signup" className="text-green-400 hover:underline">سجل الآن</Link>
        </p>
      </div>
    </div>
  );
}