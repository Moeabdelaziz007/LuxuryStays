// تكوين OAuth لخدمات المصادقة الخارجية

// تكوين Google OAuth للمصادقة
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