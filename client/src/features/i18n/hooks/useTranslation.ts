// Simple translation hook until we implement full i18n
export const useTranslation = () => {
  // Create a simple translation function that returns the key for now
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      'auth.login': 'تسجيل الدخول',
      'auth.register': 'إنشاء حساب',
      'auth.logout': 'تسجيل الخروج',
      'auth.forgotPassword': 'نسيت كلمة المرور؟',
      'auth.orContinue': 'أو',
      'auth.noAccount': 'ليس لديك حساب؟',
      'auth.haveAccount': 'لديك حساب بالفعل؟',
      'common.loading': 'جاري التحميل...',
      'nav.dashboard': 'لوحة التحكم',
      'nav.properties': 'العقارات',
      'nav.services': 'الخدمات',
      'nav.comingSoon': 'قريبًا',
      'nav.about': 'عن التطبيق'
    };
    
    return translations[key] || key;
  };
  
  return {
    t,
    language: 'ar',
    setLanguage: (lang: string) => {},
    isRTL: true
  };
};