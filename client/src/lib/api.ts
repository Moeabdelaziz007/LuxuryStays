import { apiRequest } from './query-client';
import { Property, Service } from '@shared/schema';
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from './firebase';
import { seedFirestore } from './seedFirestore';

// Function to fetch featured properties
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // Try API first (Express server)
    try {
      const response = await apiRequest('GET', '/api/properties/featured');
      return await response.json();
    } catch (apiError) {
      console.log("API fetch failed, trying direct Firestore instead:", apiError);
    }
    
    // Fallback to direct Firestore if API fails
    if (db) {
      const featuredQuery = query(collection(db, "properties"), where("featured", "==", true));
      const snapshot = await getDocs(featuredQuery);
      
      if (!snapshot.empty) {
        // استخدام التحويل الآمن للأنواع من Firestore
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as unknown as Property;
        });
      }
    }
    console.log("No featured properties found in Firestore, seeding data");
    try {
      // Try to seed the data
      const seedResult = await seedFirestore();
      if (seedResult.success) {
        console.log("Successfully seeded initial data");
        // Try fetching again after seeding
        if (db) {
          const featuredQuery = query(collection(db, "properties"), where("featured", "==", true));
          const snapshot = await getDocs(featuredQuery);
          
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
              } as unknown as Property;
            });
          }
        }
      }
    } catch (seedError) {
      console.error("Error seeding initial data:", seedError);
    }
    
    // Return empty array if all attempts fail
    return [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Function to fetch active services
export async function getActiveServices(): Promise<Service[]> {
  try {
    // Try API first (Express server)
    try {
      const response = await apiRequest('GET', '/api/services/active');
      return await response.json();
    } catch (apiError) {
      console.log("API fetch failed, trying direct Firestore instead:", apiError);
    }
    
    // Fallback to direct Firestore if API fails
    if (db) {
      const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
      const snapshot = await getDocs(activeQuery);
      
      if (!snapshot.empty) {
        // استخدام التحويل الآمن للأنواع من Firestore
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as unknown as Service;
        });
      }
    }
    console.log("No active services found in Firestore, seeding data");
    try {
      // Try to seed the data
      const seedResult = await seedFirestore();
      if (seedResult.success) {
        console.log("Successfully seeded initial data");
        // Try fetching again after seeding
        if (db) {
          const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
          const snapshot = await getDocs(activeQuery);
          
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
              } as unknown as Service;
            });
          }
        }
      }
    } catch (seedError) {
      console.error("Error seeding initial data:", seedError);
    }
    
    // Return empty array if all attempts fail
    return [];
  } catch (error) {
    console.error('Error fetching active services:', error);
    return [];
  }
}

// Function to fetch coming soon services
export async function getComingSoonServices(): Promise<Service[]> {
  try {
    // Try API first (Express server)
    try {
      const response = await apiRequest('GET', '/api/services/coming-soon');
      return await response.json();
    } catch (apiError) {
      console.log("API fetch failed, trying direct Firestore instead:", apiError);
    }
    
    // Fallback to direct Firestore if API fails
    if (db) {
      const comingSoonQuery = query(collection(db, "services"), where("status", "==", "coming-soon"));
      const snapshot = await getDocs(comingSoonQuery);
      
      if (!snapshot.empty) {
        // استخدام التحويل الآمن للأنواع من Firestore
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as unknown as Service;
        });
      }
    }
    console.log("No coming soon services found in Firestore, seeding data");
    try {
      // Try to seed the data
      const seedResult = await seedFirestore();
      if (seedResult.success) {
        console.log("Successfully seeded initial data");
        // Try fetching again after seeding
        if (db) {
          const comingSoonQuery = query(collection(db, "services"), where("status", "==", "coming-soon"));
          const snapshot = await getDocs(comingSoonQuery);
          
          if (!snapshot.empty) {
            return snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
              } as unknown as Service;
            });
          }
        }
      }
    } catch (seedError) {
      console.error("Error seeding initial data:", seedError);
    }
    
    // Return empty array if all attempts fail
    return [];
  } catch (error) {
    console.error('Error fetching coming soon services:', error);
    return [];
  }
}

// Function to reset and seed services data
export async function resetAndSeedServices(): Promise<{ success: boolean; message: string }> {
  try {
    if (!db) {
      return { 
        success: false, 
        message: "قاعدة البيانات غير متوفرة" 
      };
    }

    // Delete existing services
    const servicesQuery = await getDocs(collection(db, "services"));
    console.log(`Deleting ${servicesQuery.size} existing services...`);
    
    const deletePromises = servicesQuery.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    await Promise.all(deletePromises);
    console.log("All services deleted successfully");
    
    // Run the seedFirestore function to add the new data
    const seedResult = await seedFirestore();
    
    if (seedResult.success) {
      return { 
        success: true, 
        message: "تم إعادة تعيين بيانات الخدمات بنجاح مع إضافة بيانات حقيقية للمطاعم والنوادي الليلية في الساحل الشمالي وراس الحكمة!" 
      };
    } else {
      return { 
        success: false, 
        message: "حدث خطأ أثناء إضافة البيانات الجديدة." 
      };
    }
  } catch (error) {
    console.error('Error resetting services data:', error);
    return { 
      success: false, 
      message: `حدث خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
    };
  }
}