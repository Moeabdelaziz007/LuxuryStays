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
  if (!date) return '';
  
  // Handle Firestore timestamp
  if (date && typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString(locale, options);
  }
  
  // Handle Date object or ISO string
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, options);
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
