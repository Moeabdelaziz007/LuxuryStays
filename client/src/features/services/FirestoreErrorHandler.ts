/**
 * @file FirestoreErrorHandler.ts
 * Utilidad para manejar errores comunes de Firestore
 * 
 * Este archivo proporciona funciones para manejar y registrar errores relacionados con Firebase Firestore,
 * especialmente los errores "RPC 'Listen' stream transport errored" que son comunes cuando hay problemas
 * de conexión o problemas de inicialización de Firebase.
 */

import { FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

/**
 * Configuración de Firestore con manejo de errores y persistencia offline mejorada
 * @param app Instancia de FirebaseApp
 * @returns Instancia de Firestore configurada
 */
export const configureFirestoreWithErrorHandling = (app: FirebaseApp) => {
  const db = getFirestore(app);
  
  // Habilitar persistencia con manejo de errores
  enableIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
    .catch((error) => {
      console.warn("Error al habilitar persistencia de Firestore:", error);
      
      if (error.code === 'failed-precondition') {
        // Probable error por múltiples pestañas abiertas
        console.info("La persistencia de Firestore falló porque hay múltiples pestañas abiertas. Solo una pestaña puede usar Firestore offline a la vez.");
      } else if (error.code === 'unimplemented') {
        // Navegador no compatible con persistencia
        console.info("Este navegador no soporta todas las características necesarias para la persistencia de Firestore.");
      }
    });
  
  return db;
};

/**
 * Maneja errores comunes de Firestore y proporciona mensajes de retroalimentación
 * @param error Error de Firestore a manejar
 * @returns Mensaje de error legible para el usuario
 */
export const handleFirestoreError = (error: any): string => {
  console.error("Error de Firestore:", error);
  
  // Identificar el tipo de error
  if (error?.code === 'unavailable' || error?.message?.includes('network')) {
    return "No se puede conectar con Firestore debido a problemas de red. Comprueba tu conexión a Internet.";
  } else if (error?.code === 'permission-denied') {
    return "No tienes permisos para acceder a estos datos. Inicia sesión o contacta con el administrador.";
  } else if (error?.code === 'resource-exhausted') {
    return "Se ha superado la cuota de Firestore. Inténtalo de nuevo más tarde.";
  } else if (error?.message?.includes('RPC')) {
    return "Problema de conexión con Firestore. Estamos operando en modo offline o hay problemas de conectividad.";
  }
  
  return "Error desconocido al acceder a la base de datos. Por favor, inténtalo de nuevo.";
};

/**
 * Verifica si el error está relacionado con problemas de conexión a Firestore
 * @param error Error a comprobar
 * @returns true si es un error de conexión, false en caso contrario
 */
export const isFirestoreConnectionError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || '';
  const errorCode = error.code || '';
  
  return (
    errorMessage.includes('RPC') || 
    errorMessage.includes('network') ||
    errorMessage.includes('stream transport') ||
    errorCode === 'unavailable' ||
    errorCode === 'deadline-exceeded'
  );
};

/**
 * Función para implementar reintentos exponenciales para operaciones de Firestore
 * @param operation Función a reintentar
 * @param maxRetries Número máximo de reintentos
 * @param baseDelay Retraso base entre reintentos (ms)
 * @returns Resultado de la operación si tiene éxito
 */
export const retryFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Solo reintentar si es un error de conexión
      if (!isFirestoreConnectionError(error)) {
        throw error;
      }
      
      // Calcular retraso exponencial (1s, 2s, 4s, etc.)
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Reintentando operación de Firestore en ${delay}ms (intento ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Si llegamos aquí, todos los reintentos fallaron
  throw lastError;
};