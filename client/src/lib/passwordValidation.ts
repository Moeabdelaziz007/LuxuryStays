/**
 * Password validation utility that implements Firebase password policy
 * 
 * Rules:
 * - Minimum length: 8 characters
 * - Maximum length: 4096 characters
 * - Require uppercase character
 * - Require lowercase character
 * - Require numeric character
 * - Require special character
 */

import { z } from 'zod';

// Custom error messages in both English and Arabic
export const passwordErrorMessages = {
  tooShort: {
    en: "Password must be at least 8 characters",
    ar: "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
  },
  tooLong: {
    en: "Password must be less than 4096 characters",
    ar: "يجب أن تكون كلمة المرور أقل من 4096 حرفًا"
  },
  noUppercase: {
    en: "Password must contain at least one uppercase letter",
    ar: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل"
  },
  noLowercase: {
    en: "Password must contain at least one lowercase letter",
    ar: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل"
  },
  noNumber: {
    en: "Password must contain at least one number",
    ar: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل"
  },
  noSpecialChar: {
    en: "Password must contain at least one special character",
    ar: "يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل"
  }
};

// Regular expressions for validation
const hasUpperCase = (password: string) => /[A-Z]/.test(password);
const hasLowerCase = (password: string) => /[a-z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSpecialChar = (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

// Zod schema for password validation
export const passwordSchema = z
  .string()
  .min(8, { message: passwordErrorMessages.tooShort.ar })
  .max(4096, { message: passwordErrorMessages.tooLong.ar })
  .refine(hasUpperCase, { message: passwordErrorMessages.noUppercase.ar })
  .refine(hasLowerCase, { message: passwordErrorMessages.noLowercase.ar })
  .refine(hasNumber, { message: passwordErrorMessages.noNumber.ar })
  .refine(hasSpecialChar, { message: passwordErrorMessages.noSpecialChar.ar });

// Function to validate password and return all validation errors
export function validatePassword(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push(passwordErrorMessages.tooShort.ar);
  }
  
  if (password.length > 4096) {
    errors.push(passwordErrorMessages.tooLong.ar);
  }
  
  if (!hasUpperCase(password)) {
    errors.push(passwordErrorMessages.noUppercase.ar);
  }
  
  if (!hasLowerCase(password)) {
    errors.push(passwordErrorMessages.noLowercase.ar);
  }
  
  if (!hasNumber(password)) {
    errors.push(passwordErrorMessages.noNumber.ar);
  }
  
  if (!hasSpecialChar(password)) {
    errors.push(passwordErrorMessages.noSpecialChar.ar);
  }
  
  return errors;
}

// Custom input validator component type for use with forms
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong';

// Calculate password strength based on criteria met
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'weak';
  
  let strength = 0;
  
  // Add points for length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Add points for character types
  if (hasUpperCase(password)) strength += 1;
  if (hasLowerCase(password)) strength += 1;
  if (hasNumber(password)) strength += 1;
  if (hasSpecialChar(password)) strength += 1;
  
  // Determine strength category
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  if (strength <= 5) return 'strong';
  return 'very-strong';
}