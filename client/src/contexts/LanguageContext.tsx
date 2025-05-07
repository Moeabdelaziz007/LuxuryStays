import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

// Create initial context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Localization dictionary
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // العامة
    'app.name': 'ستاي إكس',
    'app.slogan': 'تجربة حجز فريدة في عالم الفضاء',
    'app.description': 'منصة حجز العقارات الفاخرة بتصميم مستوحى من الفضاء والتكنولوجيا',
    
    // القائمة الرئيسية
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.about': 'عن المنصة',
    'nav.contact': 'اتصل بنا',
    'nav.services': 'الخدمات',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.bookings': 'الحجوزات',
    'nav.settings': 'الإعدادات',
    'nav.language': 'اللغة',
    
    // الصفحة الرئيسية
    'home.hero.title': 'رحلتك نحو تجربة إقامة لا تُنسى',
    'home.hero.subtitle': 'استكشف عقارات فاخرة ومميزة بتصميم فضائي رائع',
    'home.hero.cta': 'استكشف العقارات',
    'home.features.title': 'مميزات الخدمة',
    'home.lastminute.title': 'عروض اللحظة الأخيرة',
    'home.featured.title': 'عقارات مميزة',
    'home.testimonials.title': 'آراء العملاء',
    'home.newsletter.title': 'النشرة البريدية',
    'home.newsletter.subtitle': 'اشترك للحصول على أحدث العروض والأخبار',
    'home.newsletter.button': 'اشترك الآن',
    
    // العقارات
    'properties.title': 'استكشف العقارات',
    'properties.search.placeholder': 'ابحث عن عقار...',
    'properties.filter.title': 'تصفية النتائج',
    'properties.filter.price': 'السعر',
    'properties.filter.area': 'المساحة',
    'properties.filter.bedrooms': 'غرف النوم',
    'properties.filter.amenities': 'المرافق',
    'properties.filter.apply': 'تطبيق',
    'properties.filter.reset': 'إعادة ضبط',
    'properties.sort.newest': 'الأحدث',
    'properties.sort.priceAsc': 'السعر: الأقل أولاً',
    'properties.sort.priceDesc': 'السعر: الأعلى أولاً',
    'properties.card.bed': 'غرفة نوم',
    'properties.card.bath': 'حمام',
    'properties.card.area': 'م²',
    'properties.card.book': 'احجز الآن',
    'properties.card.view': 'عرض التفاصيل',
    'properties.pagination.prev': 'السابق',
    'properties.pagination.next': 'التالي',
    
    // تفاصيل العقار
    'property.gallery': 'معرض الصور',
    'property.features': 'المميزات',
    'property.amenities': 'المرافق',
    'property.location': 'الموقع',
    'property.reviews': 'التقييمات',
    'property.similar': 'عقارات مشابهة',
    'property.host': 'المضيف',
    'property.price': 'السعر',
    'property.night': 'الليلة',
    'property.book': 'احجز الآن',
    'property.dates': 'تواريخ الإقامة',
    'property.guests': 'عدد الضيوف',
    'property.availability': 'التوفر',
    'property.check': 'تحقق من التوفر',
    
    // الحجز
    'booking.title': 'تأكيد الحجز',
    'booking.dates': 'تواريخ الإقامة',
    'booking.guests': 'عدد الضيوف',
    'booking.price': 'تفاصيل السعر',
    'booking.nights': 'عدد الليالي',
    'booking.subtotal': 'المجموع الفرعي',
    'booking.tax': 'الضريبة',
    'booking.total': 'المجموع الكلي',
    'booking.payment': 'الدفع',
    'booking.card': 'بطاقة الائتمان',
    'booking.confirm': 'تأكيد الحجز',
    'booking.success': 'تم الحجز بنجاح',
    'booking.error': 'حدث خطأ أثناء الحجز',
    
    // الملف الشخصي
    'profile.title': 'الملف الشخصي',
    'profile.edit': 'تعديل الملف',
    'profile.name': 'الاسم',
    'profile.email': 'البريد الإلكتروني',
    'profile.phone': 'رقم الهاتف',
    'profile.address': 'العنوان',
    'profile.save': 'حفظ التغييرات',
    'profile.password': 'تغيير كلمة المرور',
    'profile.currentPassword': 'كلمة المرور الحالية',
    'profile.newPassword': 'كلمة المرور الجديدة',
    'profile.confirmPassword': 'تأكيد كلمة المرور',
    
    // المصادقة
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.remember': 'تذكرني',
    'auth.forgot': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.name': 'الاسم',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.terms': 'أوافق على الشروط والأحكام',
    'auth.google': 'تسجيل الدخول باستخدام جوجل',
    'auth.facebook': 'تسجيل الدخول باستخدام فيسبوك',
    'auth.logout': 'تسجيل الخروج',
    
    // لوحة التحكم
    'dashboard.welcome': 'مرحباً بك في لوحة التحكم',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.bookings': 'الحجوزات',
    'dashboard.properties': 'العقارات',
    'dashboard.users': 'المستخدمين',
    'dashboard.analytics': 'التحليلات',
    'dashboard.revenue': 'الإيرادات',
    'dashboard.messages': 'الرسائل',
    'dashboard.settings': 'الإعدادات',

    // الشاتبوت
    'chatbot.welcome': 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    'chatbot.property': 'البحث عن عقار',
    'chatbot.support': 'الدعم والمساعدة',
    'chatbot.booking': 'استفسار عن حجز',
    'chatbot.recommendations': 'توصيات شخصية',
    'chatbot.thinking': 'جاري التفكير...',
    'chatbot.placeholder': 'اكتب رسالتك هنا...',
    'chatbot.retry': 'حاول مرة أخرى',
    'chatbot.error': 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    
    // أدوار المستخدمين
    'role.customer': 'عميل',
    'role.propertyAdmin': 'مدير عقارات',
    'role.superAdmin': 'مدير النظام',
    
    // رسائل النظام
    'system.loading': 'جاري التحميل...',
    'system.error': 'حدث خطأ ما',
    'system.success': 'تمت العملية بنجاح',
    'system.offline': 'أنت غير متصل بالإنترنت',
    'system.online': 'أنت متصل بالإنترنت الآن',
    'system.sessionExpired': 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
    'system.comingSoon': 'قريباً',
    'system.notFound': 'الصفحة غير موجودة',
    'system.backToHome': 'العودة للصفحة الرئيسية',
  },
  en: {
    // General
    'app.name': 'StayX',
    'app.slogan': 'A Unique Booking Experience in Space',
    'app.description': 'Luxury property booking platform with space and tech-inspired design',
    
    // Navigation
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.services': 'Services',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.bookings': 'Bookings',
    'nav.settings': 'Settings',
    'nav.language': 'Language',
    
    // Home Page
    'home.hero.title': 'Your Journey to an Unforgettable Stay',
    'home.hero.subtitle': 'Explore luxury properties with stunning space-themed design',
    'home.hero.cta': 'Explore Properties',
    'home.features.title': 'Our Features',
    'home.lastminute.title': 'Last Minute Deals',
    'home.featured.title': 'Featured Properties',
    'home.testimonials.title': 'Testimonials',
    'home.newsletter.title': 'Newsletter',
    'home.newsletter.subtitle': 'Subscribe to receive the latest offers and news',
    'home.newsletter.button': 'Subscribe Now',
    
    // Properties
    'properties.title': 'Explore Properties',
    'properties.search.placeholder': 'Search for a property...',
    'properties.filter.title': 'Filter Results',
    'properties.filter.price': 'Price',
    'properties.filter.area': 'Area',
    'properties.filter.bedrooms': 'Bedrooms',
    'properties.filter.amenities': 'Amenities',
    'properties.filter.apply': 'Apply',
    'properties.filter.reset': 'Reset',
    'properties.sort.newest': 'Newest',
    'properties.sort.priceAsc': 'Price: Low to High',
    'properties.sort.priceDesc': 'Price: High to Low',
    'properties.card.bed': 'Bedroom',
    'properties.card.bath': 'Bathroom',
    'properties.card.area': 'sqm',
    'properties.card.book': 'Book Now',
    'properties.card.view': 'View Details',
    'properties.pagination.prev': 'Previous',
    'properties.pagination.next': 'Next',
    
    // Property Details
    'property.gallery': 'Gallery',
    'property.features': 'Features',
    'property.amenities': 'Amenities',
    'property.location': 'Location',
    'property.reviews': 'Reviews',
    'property.similar': 'Similar Properties',
    'property.host': 'Host',
    'property.price': 'Price',
    'property.night': 'night',
    'property.book': 'Book Now',
    'property.dates': 'Dates',
    'property.guests': 'Guests',
    'property.availability': 'Availability',
    'property.check': 'Check Availability',
    
    // Booking
    'booking.title': 'Confirm Booking',
    'booking.dates': 'Stay Dates',
    'booking.guests': 'Number of Guests',
    'booking.price': 'Price Details',
    'booking.nights': 'Number of Nights',
    'booking.subtotal': 'Subtotal',
    'booking.tax': 'Tax',
    'booking.total': 'Total',
    'booking.payment': 'Payment',
    'booking.card': 'Credit Card',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking Successful',
    'booking.error': 'Error During Booking',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.address': 'Address',
    'profile.save': 'Save Changes',
    'profile.password': 'Change Password',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.confirmPassword': 'Confirm Password',
    
    // Authentication
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.remember': 'Remember Me',
    'auth.forgot': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.terms': 'I agree to the Terms and Conditions',
    'auth.google': 'Sign in with Google',
    'auth.facebook': 'Sign in with Facebook',
    'auth.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.bookings': 'Bookings',
    'dashboard.properties': 'Properties',
    'dashboard.users': 'Users',
    'dashboard.analytics': 'Analytics',
    'dashboard.revenue': 'Revenue',
    'dashboard.messages': 'Messages',
    'dashboard.settings': 'Settings',

    // Chatbot
    'chatbot.welcome': 'Hello! How can I help you today?',
    'chatbot.property': 'Find a Property',
    'chatbot.support': 'Support & Help',
    'chatbot.booking': 'Booking Inquiry',
    'chatbot.recommendations': 'Personal Recommendations',
    'chatbot.thinking': 'Thinking...',
    'chatbot.placeholder': 'Type your message here...',
    'chatbot.retry': 'Try Again',
    'chatbot.error': 'Sorry, an error occurred. Please try again.',
    
    // User Roles
    'role.customer': 'Customer',
    'role.propertyAdmin': 'Property Admin',
    'role.superAdmin': 'Super Admin',
    
    // System Messages
    'system.loading': 'Loading...',
    'system.error': 'An error occurred',
    'system.success': 'Operation successful',
    'system.offline': 'You are offline',
    'system.online': 'You are now online',
    'system.sessionExpired': 'Session expired, please login again',
    'system.comingSoon': 'Coming Soon',
    'system.notFound': 'Page Not Found',
    'system.backToHome': 'Back to Homepage',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to Arabic
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'ar') 
      ? savedLanguage 
      : 'ar'; // Arabic as default language
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const isRTL = language === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  // Translate function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set language and update localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  // Set document direction on initial load
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};