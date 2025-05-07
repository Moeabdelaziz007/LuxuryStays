// تكوين OAuth لخدمات المصادقة الخارجية

/**
 * تكوين Google OAuth للمصادقة
 * ملاحظة مهمة: يجب إضافة عناوين URI التالية في وحدة تحكم Google Cloud:
 * 
 * أصول JavaScript المصرح بها (Authorised JavaScript origins):
 * - https://staychill-3ed08.web.app
 * - https://staychill-3ed08.firebaseapp.com
 * - https://luxury-stays-mohamedabdela18.replit.app
 * - http://localhost:3000
 * 
 * عناوين URI لإعادة التوجيه المصرح بها (Authorised redirect URIs):
 * - https://staychill-3ed08.web.app/auth/google/callback
 * - https://staychill-3ed08.firebaseapp.com/auth/google/callback
 * - https://luxury-stays-mohamedabdela18.replit.app/auth/google/callback
 * - http://localhost:3000/auth/google/callback
 */
export const googleOAuthConfig = {
  clientId: "299280633489-3q6odgc86hhc1j0cev92bf28q7cep5hj.apps.googleusercontent.com",
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : '',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
};