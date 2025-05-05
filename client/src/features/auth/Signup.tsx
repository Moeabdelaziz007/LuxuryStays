import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { localRegister } from "@/lib/local-auth";
import { UserRole } from "@/features/auth/types";

// Simple signup page without advanced form components
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const navigate = useNavigate();
  
  // Check for Firebase connection issues
  useEffect(() => {
    const errorListener = (e: ErrorEvent) => {
      if (e.message && (
        e.message.includes('firebase') || 
        e.message.includes('Firestore') ||
        e.message.includes('WebChannelConnection')
      )) {
        console.warn('Firebase connection issue detected, falling back to local auth');
        setUseLocalAuth(true);
      }
    };
    
    window.addEventListener('error', errorListener);
    
    // Check if we should use local auth
    const connectionCheckTimeout = setTimeout(() => {
      // If Firebase auth is taking too long, use local auth
      try {
        if (!auth.currentUser) {
          console.warn('Firebase auth connection timeout, using local auth');
          setUseLocalAuth(true);
        }
      } catch (err) {
        console.error('Error checking Firebase auth:', err);
        setUseLocalAuth(true);
      }
    }, 3000);
    
    return () => {
      window.removeEventListener('error', errorListener);
      clearTimeout(connectionCheckTimeout);
    };
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (!name || name.length < 3) {
        throw new Error("يجب أن يكون الاسم 3 أحرف على الأقل");
      }
      
      console.log("Creating user with email:", email);
      
      if (useLocalAuth) {
        // Use local authentication when Firebase is unavailable
        console.log("Using local authentication for registration...");
        try {
          const user = await localRegister(name, email, password, UserRole.CUSTOMER);
          console.log("Local registration successful:", user);
          
          // Redirect to customer dashboard
          navigate('/customer');
          return;
        } catch (localErr: any) {
          console.error("Local registration error:", localErr);
          throw new Error(localErr.message || "فشل إنشاء الحساب محلياً");
        }
      }
      
      // Normal Firebase authentication
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
      } else if (err.message && err.message.includes('firebase') && !useLocalAuth) {
        // If we get a Firebase error but weren't using local auth, try to switch to local auth
        console.log("Firebase error detected, switching to local auth");
        setUseLocalAuth(true);
        setError("اتصال Firebase غير متوفر، جاري استخدام التخزين المحلي. حاول مرة أخرى.");
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
        
        {useLocalAuth && (
          <div className="mt-6 p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
            <p className="text-sm text-center text-green-400 font-bold mb-2">وضع التطوير المحلي نشط</p>
            <p className="text-xs text-center text-gray-400 mb-2">يمكنك تسجيل حساب جديد للدخول أو استخدام الحسابات المتوفرة في صفحة تسجيل الدخول</p>
          </div>
        )}
      </div>
    </div>
  );
}