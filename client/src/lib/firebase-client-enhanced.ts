/**
 * @file firebase-client-enhanced.ts
 * Cliente de Firebase mejorado con manejo de errores y soporte para modo offline
 * 
 * Este archivo configura Firebase con características adicionales para:
 * 1. Manejar errores comunes como "RPC 'Listen' stream transport errored"
 * 2. Proporcionar soporte para modo offline con reintentos automáticos
 * 3. Mejorar la experiencia del usuario cuando hay problemas de conexión
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { getFirestore, collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { 
  configureFirestoreWithErrorHandling, 
  retryFirestoreOperation,
  isFirestoreConnectionError
} from "@/features/services/FirestoreErrorHandler";

// Comprobación de variables de entorno necesarias
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error("API key de Firebase no disponible. Configure VITE_FIREBASE_API_KEY en las variables de entorno.");
}

// Configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configurar Firestore con manejo de errores mejorado
export const db = configureFirestoreWithErrorHandling(app);

// Proveedor de autenticación para Google
const googleProvider = new GoogleAuthProvider();

/**
 * Inicia sesión con Google usando popup (más confiable que redirect en Replit)
 * @returns Promesa que resuelve a la información del usuario
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error al iniciar sesión con Google:", error);
    
    // Manejar error específico para dominios no autorizados
    if (error.code === 'auth/unauthorized-domain') {
      console.warn("Dominio no autorizado. Intenta usar el método anónimo.");
      throw new Error("Este dominio no está autorizado para autenticación con Google. Configura el dominio en la consola de Firebase o usa login anónimo.");
    }
    
    throw error;
  }
};

/**
 * Inicia sesión anónimamente (útil como respaldo cuando otros métodos fallan)
 * @returns Promesa que resuelve a la información del usuario
 */
export const signInAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Error al iniciar sesión anónimamente:", error);
    throw error;
  }
};

/**
 * Cierra la sesión actual
 */
export const signOut = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

/**
 * Obtiene datos de Firestore con reintentos automáticos para errores de conexión
 * @param collectionName Nombre de la colección
 * @returns Promesa que resuelve a un QuerySnapshot con los documentos
 */
export const getCollectionDataWithRetry = async (
  collectionName: string
): Promise<QuerySnapshot<DocumentData>> => {
  try {
    return await retryFirestoreOperation(
      () => getDocs(collection(db, collectionName)),
      3,  // Máximo 3 reintentos
      1000 // 1 segundo entre reintentos
    );
  } catch (error) {
    console.error(`Error al obtener datos de ${collectionName}:`, error);
    
    // Para errores de conexión, damos un mensaje más útil
    if (isFirestoreConnectionError(error)) {
      console.log(`No se pudieron obtener datos de ${collectionName} debido a problemas de conexión. Usando datos en caché si están disponibles.`);
    }
    
    throw error;
  }
};

/**
 * Establece un observador para cambios en el estado de autenticación
 * @param callback Función a llamar cuando cambia el estado de autenticación
 * @returns Función para cancelar la suscripción
 */
export const onAuthChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

export default { app, auth, db, signInWithGoogle, signInAnonymously, signOut, getCollectionDataWithRetry, onAuthChange };