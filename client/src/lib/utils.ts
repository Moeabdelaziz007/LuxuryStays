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
