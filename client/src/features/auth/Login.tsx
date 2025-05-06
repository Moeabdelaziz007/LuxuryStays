import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { localLogin, initializeLocalUsers } from "@/lib/local-auth";
import { UserRole } from "@/features/auth/types";

// Simple login page without advanced form components
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [useLocalAuth, setUseLocalAuth] = useState(false);
  const navigate = useNavigate();
  
  // Initialize test users for local authentication
  useEffect(() => {
    // Force reset local users (only needed for this update)
    localStorage.removeItem('stayx_local_users');
    
    // Initialize local users for testing when Firebase is unavailable
    initializeLocalUsers();
    
    // Set a listener for Firebase connection errors
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
      try {
        // If Firebase auth is taking too long or not available, use local auth
        if (!auth || !auth.currentUser) {
          console.warn('Firebase auth connection timeout, falling back to local auth');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      
      if (useLocalAuth) {
        // Use local authentication when Firebase is unavailable
        console.log("Using local authentication...");
        try {
          const user = await localLogin(email, password);
          console.log("Local login successful:", user);
          
          // Manually redirect based on role
          if (user.role === UserRole.SUPER_ADMIN) {
            navigate('/super-admin');
          } else if (user.role === UserRole.PROPERTY_ADMIN) {
            navigate('/property-admin');
          } else {
            navigate('/customer');
          }
          return;
        } catch (localErr: any) {
          console.error("Local login error:", localErr);
          throw new Error(localErr.message || "فشل تسجيل الدخول محلياً");
        }
      }
      
      // Check if Firebase auth is available
      if (!auth) {
        setUseLocalAuth(true);
        throw new Error("Firebase auth not available");
      }
      
      // Normal Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase login successful:", userCredential.user.uid);
      // Navigation is handled by auth context
    } catch (err: any) {
      console.error("Login error:", err);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found') {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else if (err.code === 'auth/wrong-password') {
        setError("كلمة المرور غير صحيحة");
      } else if (err.message && err.message.includes('firebase') && !useLocalAuth) {
        // If we get a Firebase error but weren't using local auth, try to switch to local auth
        console.log("Firebase error detected, switching to local auth");
        setUseLocalAuth(true);
        setError("اتصال Firebase غير متوفر، جاري استخدام التخزين المحلي. حاول مرة أخرى.");
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
    
    if (useLocalAuth || !auth || !db) {
      setError("تسجيل الدخول عبر Google غير متاح في وضع الاتصال المحلي. الرجاء استخدام البريد الإلكتروني وكلمة المرور.");
      console.error("Google login not available in local mode");
      setGoogleLoading(false);
      return;
    }
    
    const provider = new GoogleAuthProvider();
    
    try {
      const res = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      try {
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
      } catch (firestoreError) {
        console.error("Error accessing Firestore:", firestoreError);
        
        // If Firestore fails, use local auth as fallback
        setUseLocalAuth(true);
        
        // We can still use the Google user info to create a local session
        const tempLocalUser = {
          uid: res.user.uid,
          email: res.user.email || '',
          name: res.user.displayName || 'Google User',
          role: "CUSTOMER", // Default role
          createdAt: new Date().toISOString(),
        };
        
        // Store in localStorage for future local auth
        localStorage.setItem('stayx_current_user', JSON.stringify(tempLocalUser));
        
        // Redirect to customer dashboard
        navigate('/customer');
      }
      
      // If we get here, navigation will be handled by auth context
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("جاري العمل على تفعيل الدخول بواسطة Google. الرجاء استخدام البريد الإلكتروني وكلمة المرور بدلاً من ذلك.");
        console.error(`Please add ${window.location.origin} to Firebase authorized domains`);
      } else {
        setError(err.message || "فشل تسجيل الدخول باستخدام Google");
      }
    } finally {
      setGoogleLoading(false);
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
        <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
        <div className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
        <div className="absolute top-[40%] left-[5%] w-24 h-24 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-black/50 p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.3)] border border-[#39FF14]/20 relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#39FF14]/20 rounded-full blur-[80px] opacity-70"></div>
          
          {/* Logo */}
          <div className="text-center mb-8 relative">
            <h1 className="inline-block text-[40px] font-black relative mb-2">
              <span className="text-[#39FF14] animate-neon-pulse" 
                    style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                Stay
              </span>
              <span className="text-white">X</span>
            </h1>
            <p className="text-lg text-gray-300">مرحباً بعودتك 👋</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-md mb-6 text-sm animate-pulse">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="••••••••" 
                  className="w-full p-3 rounded-lg bg-black/60 border border-gray-700 text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]/50 transition-all" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <div className="absolute inset-0 rounded-lg transition-opacity opacity-0 group-focus-within:opacity-100 pointer-events-none" 
                     style={{ boxShadow: "0 0 8px rgba(57, 255, 20, 0.3)" }}></div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="relative group w-full"
              disabled={loading}
            >
              <div className="relative z-10 bg-[#39FF14] text-black font-bold py-3 rounded-lg w-full text-center transform group-hover:scale-[1.01] transition-transform">
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </div>
              <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700/50"></div>
            <span className="px-4 text-sm text-gray-500">أو</span>
            <div className="flex-1 border-t border-gray-700/50"></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="relative flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-lg w-full hover:bg-white/10 transition-colors"
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className="animate-pulse">جاري تسجيل الدخول...</span>
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

          <p className="text-sm mt-6 text-center text-gray-400">
            ليس لديك حساب؟{" "}
            <Link to="/signup" className="text-[#39FF14] hover:text-white transition-colors">
              سجل الآن
            </Link>
          </p>
          
          {useLocalAuth && (
            <div className="mt-8 relative">
              <div className="backdrop-blur-sm bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-lg p-4">
                <div className="absolute -inset-[0.5px] rounded-lg" style={{ background: "linear-gradient(45deg, rgba(57, 255, 20, 0.1), transparent, rgba(57, 255, 20, 0.1), transparent)" }}></div>
                <p className="text-sm text-center font-medium mb-2">
                  <span className="text-[#39FF14]" style={{ textShadow: "0 0 3px rgba(57, 255, 20, 0.5)" }}>
                    وضع التطوير المحلي نشط
                  </span>
                </p>
                <p className="text-xs text-center text-gray-400 mb-3">استخدم أحد الحسابات التالية للتسجيل:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-black/60 p-2 rounded-lg border border-gray-800">
                    <p className="font-bold text-[#39FF14] mb-1">مستخدم:</p>
                    <p className="text-gray-300">user@example.com</p>
                    <p className="text-gray-500">user123</p>
                  </div>
                  <div className="bg-black/60 p-2 rounded-lg border border-gray-800">
                    <p className="font-bold text-[#39FF14] mb-1">مالك العقار:</p>
                    <p className="text-gray-300">host@example.com</p>
                    <p className="text-gray-500">host123</p>
                  </div>
                  <div className="bg-black/60 p-2 rounded-lg border border-gray-800">
                    <p className="font-bold text-[#39FF14] mb-1">مدير:</p>
                    <p className="text-gray-300">admin@example.com</p>
                    <p className="text-gray-500">admin123</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}