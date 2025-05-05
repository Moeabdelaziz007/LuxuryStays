import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Sample property data
const properties = [
  {
    name: "الفيلا الزرقاء الفاخرة",
    imageUrl: "https://i.ibb.co/BzvWzbh/villa-hero.jpg",
    description: "موقع فخم على البحر مع مسبح خاص وإطلالة ساحرة"
  },
  {
    name: "شاليه مارينا",
    imageUrl: "https://source.unsplash.com/400x300/?villa,beach,summer&sig=1",
    description: "استمتع بغروب الشمس المذهل من شرفتك الخاصة"
  },
  {
    name: "قصر الساحل",
    imageUrl: "https://source.unsplash.com/400x300/?villa,beach,summer&sig=2",
    description: "تصميم عصري مع حديقة خاصة وجاكوزي"
  }
];

// Sample service data
const services = [
  {
    title: "حجز مطاعم",
    description: "احجز طاولتك في أفضل مطاعم الساحل مجاناً",
    status: "active"
  },
  {
    title: "نوادي ليلية",
    description: "استمتع بالحفلات في أشهر النوادي مقابل 5$ فقط",
    status: "active"
  },
  {
    title: "المساج",
    description: "قريباً جداً... 💆‍♀️",
    status: "coming-soon"
  },
  {
    title: "تأجير قوارب",
    description: "استمتع برحلات بحرية خاصة مع الأصدقاء والعائلة",
    status: "coming-soon"
  }
];

export const seedFirestore = async () => {
  try {
    // Check if properties already exist
    const propertiesQuery = await getDocs(collection(db, "properties"));
    if (propertiesQuery.empty) {
      console.log("Seeding properties...");
      for (const property of properties) {
        await addDoc(collection(db, "properties"), property);
      }
      console.log("Properties seeded successfully!");
    } else {
      console.log("Properties collection already has data, skipping seed");
    }

    // Check if services already exist
    const servicesQuery = await getDocs(collection(db, "services"));
    if (servicesQuery.empty) {
      console.log("Seeding services...");
      for (const service of services) {
        await addDoc(collection(db, "services"), service);
      }
      console.log("Services seeded successfully!");
    } else {
      console.log("Services collection already has data, skipping seed");
    }

    return { success: true };
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return { success: false, error };
  }
};