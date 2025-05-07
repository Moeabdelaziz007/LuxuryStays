/**
 * Sistema de caché para la autenticación de Firebase
 * Mejora el rendimiento al reducir las solicitudes repetidas
 */

// Tipos para los datos almacenados en caché
interface CachedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  timestamp: number;
}

interface CachedToken {
  token: string;
  expires: number;
}

// Configuración de la caché
const CACHE_DURATION = {
  USER: 5 * 60 * 1000, // 5 minutos para datos de usuario
  TOKEN: 30 * 60 * 1000, // 30 minutos para tokens
};

// Almacenamiento de caché
const cache = {
  user: new Map<string, CachedUser>(),
  token: new Map<string, CachedToken>(),
};

/**
 * Almacena un usuario en la caché
 * @param uid ID del usuario
 * @param userData Datos del usuario a almacenar
 */
export function cacheUser(uid: string, userData: Omit<CachedUser, 'timestamp'>) {
  cache.user.set(uid, {
    ...userData,
    timestamp: Date.now(),
  });
}

/**
 * Obtiene un usuario de la caché
 * @param uid ID del usuario
 * @returns Datos del usuario si están en caché y no expirados, o null
 */
export function getCachedUser(uid: string): Omit<CachedUser, 'timestamp'> | null {
  const cachedUser = cache.user.get(uid);
  
  if (!cachedUser) {
    return null;
  }
  
  // Verificar si los datos han expirado
  if (Date.now() - cachedUser.timestamp > CACHE_DURATION.USER) {
    cache.user.delete(uid);
    return null;
  }
  
  // Retornar sin el timestamp
  const { timestamp, ...userData } = cachedUser;
  return userData;
}

/**
 * Almacena un token en la caché
 * @param uid ID del usuario
 * @param token Token a almacenar
 * @param expiresIn Tiempo de expiración en segundos (por defecto 60 minutos)
 */
export function cacheToken(uid: string, token: string, expiresIn: number = 3600) {
  cache.token.set(uid, {
    token,
    expires: Date.now() + (expiresIn * 1000),
  });
}

/**
 * Obtiene un token de la caché
 * @param uid ID del usuario
 * @returns Token si está en caché y no expirado, o null
 */
export function getCachedToken(uid: string): string | null {
  const cachedToken = cache.token.get(uid);
  
  if (!cachedToken) {
    return null;
  }
  
  // Verificar si el token ha expirado
  if (Date.now() >= cachedToken.expires) {
    cache.token.delete(uid);
    return null;
  }
  
  return cachedToken.token;
}

/**
 * Limpia la caché de un usuario específico o toda la caché
 * @param uid ID del usuario (opcional, si no se proporciona se limpia toda la caché)
 */
export function clearCache(uid?: string) {
  if (uid) {
    cache.user.delete(uid);
    cache.token.delete(uid);
  } else {
    cache.user.clear();
    cache.token.clear();
  }
}

/**
 * Actualiza la caché de un usuario con nueva información
 * @param uid ID del usuario
 * @param updates Actualizaciones a aplicar
 */
export function updateCachedUser(uid: string, updates: Partial<Omit<CachedUser, 'timestamp'>>) {
  const cachedUser = cache.user.get(uid);
  
  if (cachedUser) {
    cache.user.set(uid, {
      ...cachedUser,
      ...updates,
      timestamp: Date.now(), // Renovar el timestamp
    });
    return true;
  }
  
  return false;
}