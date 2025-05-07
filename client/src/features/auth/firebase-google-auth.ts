import { 
  signInWithPopup, 
  signInWithRedirect, 
  GoogleAuthProvider, 
  updateProfile,
  signInAnonymously
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * تسجيل الدخول باستخدام Google مع معالجة حالات الخطأ المختلفة
 * @param redirectPath مسار إعادة التوجيه بعد تسجيل الدخول بنجاح (اختياري)
 * @returns وعد بنتيجة عملية تسجيل الدخول
 */
export async function loginWithGoogle(redirectPath?: string) {
  console.log("بدء عملية تسجيل الدخول باستخدام Google...");
  
  if (!auth) {
    throw new Error("خدمات Firebase غير متوفرة");
  }
  
  // حفظ مسار إعادة التوجيه إذا كان موجودًا
  if (redirectPath) {
    localStorage.setItem('googleAuthRedirectPath', redirectPath);
    console.log("تم حفظ مسار إعادة التوجيه:", redirectPath);
  }
  
  try {
    // إنشاء مزود المصادقة لـ Google مع نطاقات الوصول المطلوبة
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    // تسجيل نطاق الموقع الحالي للتصحيح
    console.log("محاولة تسجيل الدخول باستخدام نافذة منبثقة من النطاق:", window.location.hostname);
    const result = await signInWithPopup(auth, provider);
    
    // الحصول على بيانات المستخدم من Google
    const user = result.user;
    console.log("تم تسجيل الدخول بنجاح باستخدام Google:", user.displayName);
    
    // في حالة نجاح تسجيل الدخول، إضافة أو تحديث معلومات المستخدم في Firestore
    if (db) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        
        if (!userSnapshot.exists()) {
          // المستخدم جديد، إنشاء وثيقة مستخدم في Firestore
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'مستخدم Google',
            role: "CUSTOMER", // الدور الافتراضي للمستخدمين الجدد
            createdAt: new Date().toISOString(),
            photoURL: user.photoURL,
            isGoogleAccount: true
          };
          
          await setDoc(userRef, userData);
          console.log("تم حفظ معلومات المستخدم في Firestore بنجاح");
        } else {
          // المستخدم موجود بالفعل، تحديث البيانات
          await setDoc(userRef, {
            email: user.email,
            name: user.displayName || userSnapshot.data().name,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
          }, { merge: true });
          console.log("تم تحديث معلومات المستخدم في Firestore");
        }
      } catch (firestoreError) {
        console.warn("تعذر حفظ معلومات المستخدم في Firestore:", firestoreError);
        // استمر حتى لو فشل Firestore
      }
    }
    
    return result;
  } catch (popupError: any) {
    // معالجة الخطأ حسب نوعه
    console.error("خطأ في نافذة تسجيل الدخول:", popupError.code);
    
    // إذا تم حظر النافذة المنبثقة أو إغلاقها، جرّب طريقة إعادة التوجيه
    if (popupError.code === 'auth/popup-blocked' || 
        popupError.code === 'auth/popup-closed-by-user' || 
        popupError.code === 'auth/cancelled-popup-request') {
      
      console.log("النافذة المنبثقة غير متاحة، محاولة تسجيل الدخول باستخدام إعادة التوجيه...");
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      await signInWithRedirect(auth, provider);
      // لن يتم تنفيذ أي كود بعد هذا لأن الصفحة ستتم إعادة تحميلها
      return null;
    } else if (popupError.code === 'auth/unauthorized-domain') {
      // النطاق غير مصرح به في إعدادات Firebase
      console.error(`النطاق الحالي (${window.location.hostname}) غير مصرح به في إعدادات Firebase.`);
      console.error('يجب إضافة هذا النطاق إلى قائمة المجالات المصرح بها في إعدادات Firebase.');
      
      // إرجاع الخطأ بدلاً من تسجيل الدخول كضيف
      throw new Error(`النطاق ${window.location.hostname} غير مصرح به في إعدادات Firebase. يرجى التحقق من إعدادات المصادقة.`);
    } else {
      // خطأ آخر، إعادة رمي الخطأ 
      throw popupError;
    }
  }
}

/**
 * تسجيل الدخول كضيف باستخدام المصادقة المجهولة
 * @returns وعد بنتيجة عملية تسجيل الدخول
 */
export async function loginAsGuest() {
  console.log("محاولة تسجيل الدخول كضيف...");
  
  if (!auth) {
    throw new Error("خدمة المصادقة غير متوفرة");
  }
  
  // استخدام المصادقة المجهولة
  const guestCred = await signInAnonymously(auth);
  console.log("تم إنشاء حساب مجهول بنجاح");
  
  // تحديث معلومات الملف الشخصي للضيف
  await updateProfile(guestCred.user, {
    displayName: "ضيف StayX",
    photoURL: "https://ui-avatars.com/api/?name=StayX&background=39FF14&color=000000"
  });
  
  // حفظ معلومات الضيف في Firestore
  if (db) {
    const guestData = {
      uid: guestCred.user.uid,
      email: null, // المستخدمون المجهولون ليس لديهم بريد إلكتروني
      name: "ضيف StayX",
      role: "CUSTOMER",
      createdAt: new Date().toISOString(),
      isGuestAccount: true
    };
    
    await setDoc(doc(db, "users", guestCred.user.uid), guestData);
    console.log("تم حفظ معلومات المستخدم الضيف في Firestore");
  }
  
  console.log("تم تسجيل الدخول كضيف بنجاح!");
  return guestCred;
}