import { 
  signInWithRedirect, 
  signInWithPopup,
  GoogleAuthProvider, 
  getRedirectResult,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  getIdToken,
  User
} from "firebase/auth";

// Use the already initialized Firebase app and auth from firebase.ts
import { auth } from "./firebase";

// Importar funciones de caché
import { 
  cacheUser,
  getCachedUser,
  cacheToken,
  getCachedToken,
  updateCachedUser
} from "./auth-cache";

// Create a fresh provider for each login attempt to avoid stale state issues
const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  
  // Add scopes for Google OAuth
  provider.addScope('email');
  provider.addScope('profile');
  
  // Set custom parameters for better compatibility
  provider.setCustomParameters({
    prompt: 'select_account',
    // Disable login hints to show a clean login screen each time
    login_hint: ''
  });
  
  return provider;
};

// Ensure local persistence for smoother session maintenance
const ensurePersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.warn("Failed to set persistence:", error);
    // Continue anyway, as this is just an enhancement
  }
};

// Enhanced login with advanced error handling and smoother flow
export async function login() {
  // Set persistence for better user experience
  await ensurePersistence();
  
  const provider = createGoogleProvider();
  
  try {
    // Always try popup first as it provides the best user experience
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.log("Popup login failed with error:", error.code);
    
    // Only use redirect as fallback for specific error cases
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.log("Using redirect as fallback due to popup issues");
      return signInWithRedirect(auth, provider);
    }
    
    // For unauthorized domain, we don't try redirect as it will also fail
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("domain_unauthorized");
    }
    
    // For other errors, propagate them
    throw error;
  }
}

// Login with Google using popup (optimized version)
export async function loginWithPopup() {
  await ensurePersistence();
  const provider = createGoogleProvider();
  return signInWithPopup(auth, provider);
}

// Login anonymously with improved reliability
export async function loginAsGuest() {
  await ensurePersistence();
  try {
    return await signInAnonymously(auth);
  } catch (error) {
    console.error("Anonymous login failed:", error);
    throw error;
  }
}

// Enhanced redirect handler with better error reporting
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // The signed-in user info.
      const user = result.user;
      
      // Success - return user
      return { success: true, user, token };
    }
    return { success: false, message: "No redirect result" };
  } catch (error: any) {
    console.error("Error handling redirect:", error);
    // Provide a more user-friendly error response
    return { 
      success: false, 
      errorCode: error.code,
      errorMessage: error.message,
      friendlyMessage: getFriendlyErrorMessage(error.code),
      email: error.customData?.email,
      credential: GoogleAuthProvider.credentialFromError(error)
    };
  }
}

// Helper function to provide user-friendly error messages
function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return "هذا الموقع غير مصرح له للمصادقة. يرجى تجربة خيار الدخول كضيف.";
    case 'auth/popup-blocked':
      return "تم حظر نافذة تسجيل الدخول. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.";
    case 'auth/popup-closed-by-user':
      return "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
    case 'auth/cancelled-popup-request':
      return "تم إلغاء طلب المصادقة. يرجى المحاولة مرة أخرى.";
    case 'auth/account-exists-with-different-credential':
      return "هناك حساب موجود بالفعل لهذا البريد الإلكتروني باستخدام طريقة تسجيل دخول مختلفة.";
    case 'auth/network-request-failed':
      return "فشل الاتصال بالشبكة. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.";
    default:
      return "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
  }
}

/**
 * Obtiene el token ID del usuario actual con soporte de caché
 * @param forceRefresh Forzar la obtención de un token nuevo
 * @returns Token ID o null
 */
export async function getUserIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return null;
  }
  
  // Si no se fuerza el refresco, intentar obtener de la caché
  if (!forceRefresh) {
    const cachedToken = getCachedToken(currentUser.uid);
    if (cachedToken) {
      return cachedToken;
    }
  }
  
  try {
    // Obtener un token fresco
    const token = await getIdToken(currentUser, forceRefresh);
    
    // Calcular el tiempo de expiración (aproximadamente 1 hora)
    cacheToken(currentUser.uid, token);
    
    return token;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
}

/**
 * Guarda los datos del usuario en la caché
 * @param user Usuario de Firebase
 */
export function cacheCurrentUser(user: User) {
  if (!user) return;
  
  cacheUser(user.uid, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
}

/**
 * Obtiene datos del usuario más eficientemente con soporte de caché
 * @param user Usuario de Firebase
 * @returns Objeto con datos de usuario
 */
export function getUserData(user: User) {
  if (!user) return null;
  
  // Intentar obtener de la caché primero
  const cachedData = getCachedUser(user.uid);
  
  if (cachedData) {
    return cachedData;
  }
  
  // Si no está en caché, almacenar y devolver
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  
  cacheUser(user.uid, userData);
  
  return userData;
}

export { auth };