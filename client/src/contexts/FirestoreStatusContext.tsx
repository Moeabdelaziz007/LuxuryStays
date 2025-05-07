import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { db } from '@/lib/firebase-client';
import { onSnapshotsInSync, disableNetwork, enableNetwork } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface FirestoreStatusContextType {
  isOnline: boolean;
  isConnected: boolean;
  isOfflineMode: boolean;
  connectionError: Error | null;
  enableOfflineMode: () => Promise<void>;
  retryConnection: () => Promise<void>;
  isRetrying: boolean;
}

const FirestoreStatusContext = createContext<FirestoreStatusContextType>({
  isOnline: true,
  isConnected: true,
  isOfflineMode: false,
  connectionError: null,
  enableOfflineMode: async () => {},
  retryConnection: async () => {},
  isRetrying: false,
});

export const useFirestoreStatus = () => useContext(FirestoreStatusContext);

interface FirestoreStatusProviderProps {
  children: ReactNode;
  showToasts?: boolean;
}

export const FirestoreStatusProvider: React.FC<FirestoreStatusProviderProps> = ({ 
  children,
  showToasts = true,
}) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isConnected, setIsConnected] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  // مراقبة حالة الاتصال بالإنترنت
  useEffect(() => {
    function updateOnlineStatus() {
      const online = window.navigator.onLine;
      setIsOnline(online);
      
      if (online && !isConnected && !isOfflineMode) {
        // إذا عاد الاتصال، حاول إعادة الاتصال بـ Firestore تلقائيًا
        retryConnection();
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isConnected, isOfflineMode]);

  // مراقبة حالة الاتصال بـ Firestore
  useEffect(() => {
    const unsubscribe = onSnapshotsInSync(db, () => {
      // عندما تكون المزامنة مكتملة، فهذا يعني أن الاتصال بـ Firestore ناجح
      if (!isConnected) {
        setIsConnected(true);
        setConnectionError(null);
        
        if (showToasts) {
          toast({
            title: "تم استعادة الاتصال",
            description: "تم استعادة الاتصال بقاعدة البيانات بنجاح.",
            variant: "default",
          });
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected, showToasts, toast]);

  // تمكين وضع عدم الاتصال
  const enableOfflineMode = async () => {
    try {
      await disableNetwork(db);
      setIsOfflineMode(true);
      
      if (showToasts) {
        toast({
          title: "تم تفعيل وضع عدم الاتصال",
          description: "سيتم استخدام البيانات المخزنة محليًا. سيتم المزامنة عند استعادة الاتصال.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("فشل تفعيل وضع عدم الاتصال:", error);
      setConnectionError(error instanceof Error ? error : new Error('فشل تفعيل وضع عدم الاتصال'));
      
      if (showToasts) {
        toast({
          title: "خطأ",
          description: "فشل تفعيل وضع عدم الاتصال. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    }
  };

  // إعادة الاتصال بـ Firestore
  const retryConnection = async () => {
    if (!isOnline) {
      if (showToasts) {
        toast({
          title: "غير متصل بالإنترنت",
          description: "لا يمكن الاتصال بقاعدة البيانات بدون اتصال بالإنترنت.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      setIsRetrying(true);
      
      await enableNetwork(db);
      setIsOfflineMode(false);
      setIsConnected(true);
      setConnectionError(null);
      
      if (showToasts) {
        toast({
          title: "تم استعادة الاتصال",
          description: "تم الاتصال بقاعدة البيانات بنجاح.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("فشل إعادة الاتصال:", error);
      setIsConnected(false);
      setConnectionError(error instanceof Error ? error : new Error('فشل إعادة الاتصال'));
      
      if (showToasts) {
        toast({
          title: "فشل إعادة الاتصال",
          description: "فشل الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى لاحقًا.",
          variant: "destructive",
        });
      }
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <FirestoreStatusContext.Provider
      value={{
        isOnline,
        isConnected,
        isOfflineMode,
        connectionError,
        enableOfflineMode,
        retryConnection,
        isRetrying,
      }}
    >
      {children}
    </FirestoreStatusContext.Provider>
  );
};