import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a localized string
 * @param date Date object or Firestore timestamp or ISO string
 * @param locale Locale for formatting (default: 'ar-EG')
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: any, locale = 'ar-EG', options: Intl.DateTimeFormatOptions = { 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}) {
  if (!date) return ''; // تعامل مع القيم الفارغة
  
  try {
    // Handle Firestore timestamp
    if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString(locale, options);
    }
    
    // Handle Date object
    if (date instanceof Date) {
      return date.toLocaleDateString(locale, options);
    }
    
    // Handle ISO string or timestamp
    if (typeof date === 'string' || typeof date === 'number') {
      const d = new Date(date);
      if (!isNaN(d.getTime())) { // التحقق من أن التاريخ صالح
        return d.toLocaleDateString(locale, options);
      }
    }
    
    // عالج بقية الحالات غير المتوقعة كأوبجكت
    if (typeof date === 'object') {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString(locale, options);
      }
    }
    
    // If all else fails, return a placeholder
    return '';
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error, date);
    return '';
  }
}

/**
 * Format a number as currency
 * @param amount Number to format
 * @param locale Locale for formatting (default: 'ar-EG')
 * @param currency Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale = 'ar-EG', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * تنفيذ عملية مع إعادة المحاولة في حالة الفشل
 * @param operation الدالة المراد تنفيذها
 * @param onError دالة لمعالجة الأخطاء (اختيارية)
 * @param maxRetries العدد الأقصى للمحاولات (الافتراضي: 3)
 * @param delayMs تأخير بين المحاولات بالميلي ثانية (الافتراضي: 1000)
 * @returns نتيجة العملية عند النجاح
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  onError?: ((error: any, attempt: number) => void) | null,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // استدعاء دالة معالجة الخطأ إذا تم توفيرها
      if (onError) {
        onError(error, attempt);
      } else {
        console.error(`فشل في المحاولة ${attempt}/${maxRetries}:`, error);
      }
      
      // إذا كانت هذه هي المحاولة الأخيرة، قم بإعادة رمي الخطأ
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // انتظار قبل المحاولة التالية
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // لن يصل التنفيذ إلى هنا بسبب إعادة رمي الخطأ في المحاولة الأخيرة
  // لكن TypeScript يحتاج إلى هذا
  throw lastError;
}
