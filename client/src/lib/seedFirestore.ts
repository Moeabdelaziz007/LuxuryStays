import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Sample property data based on the new model - using real North Coast locations
const properties = [
  {
    name: "فيلا فاخرة في هاسيندا باي",
    imageUrl: "https://i.ibb.co/BzvWzbh/villa-hero.jpg",
    description: "إقامة فاخرة بإطلالة مباشرة على البحر مع مسبح خاص وخدمة تنظيف يومية. تتميز بتصميم معماري فريد.",
    location: "هاسيندا باي، الكيلو 200 الساحل الشمالي",
    pricePerNight: 350,
    featured: true,
    ownerId: "admin123"
  },
  {
    name: "شاليه ديلوكس في ماونتن فيو راس الحكمة",
    imageUrl: "https://source.unsplash.com/400x300/?luxury,beach,villa&sig=1",
    description: "شاليه فاخر في أرقى مناطق راس الحكمة مع إطلالة بانورامية على البحر وشاطئ خاص",
    location: "ماونتن فيو، راس الحكمة",
    pricePerNight: 280,
    featured: true,
    ownerId: "admin123"
  },
  {
    name: "فيلا بو آيلاند الساحل",
    imageUrl: "https://source.unsplash.com/400x300/?beach,mansion,summer&sig=2",
    description: "فيلا مستقلة مع حديقة خاصة وجاكوزي وإطلالة ساحرة على البحر، بالقرب من جميع الخدمات",
    location: "بو آيلاند، سيدي عبد الرحمن",
    pricePerNight: 420,
    featured: true,
    ownerId: "admin123"
  },
  {
    name: "شاليه لافيستا باي الساحل",
    imageUrl: "https://source.unsplash.com/400x300/?villa,pool,summer&sig=3",
    description: "شاليه فاخر في أول صف بحر بمساحات واسعة وشرفة خاصة تطل على البحر مباشرة",
    location: "لافيستا باي، كيلو 130 الساحل الشمالي",
    pricePerNight: 300,
    featured: true,
    ownerId: "admin123"
  }
];

// Sample service data with real restaurants and nightclubs in Ras El Hekma and North Coast
const services = [
  {
    title: "حجز المطاعم الفاخرة",
    description: "احجز طاولتك مجاناً في أشهر مطاعم الساحل وراس الحكمة: لا فيستا، تشيبرياني، كايرو كيتشين بمارينا، سمك في بو آيلاند، زيتونة بهاسيندا",
    status: "active",
    locations: [
      { name: "لا فيستا (La Vista)", area: "راس الحكمة" },
      { name: "سمك", area: "بو آيلاند، سيدي عبد الرحمن" },
      { name: "تشيبرياني (Cipriani)", area: "المراسي، الساحل الشمالي" },
      { name: "كايرو كيتشين", area: "مارينا، الساحل الشمالي" },
      { name: "زيتونة", area: "هاسيندا باي، الساحل الشمالي" }
    ]
  },
  {
    title: "حجز النوادي الليلية",
    description: "استمتع بالحفلات في أشهر النوادي الليلية مقابل 5$ فقط: 6IX Degrees في ماونتن فيو، بيتش باد، سقالة في مراسي، ساوند في هاسيندا باي",
    status: "active",
    locations: [
      { name: "6IX Degrees", area: "ماونتن فيو، راس الحكمة" },
      { name: "Beach Bud", area: "مراقيا، الساحل الشمالي" },
      { name: "سقالة (Scaffold)", area: "المراسي، الساحل الشمالي" },
      { name: "Martin's Beach Club", area: "نورث إيدج، الساحل الشمالي" },
      { name: "ساوند (Sound)", area: "هاسيندا باي، الساحل الشمالي" }
    ]
  },
  {
    title: "المساج الفاخر",
    description: "خدمة مساج داخل الفيلا من محترفين معتمدين، سبا كامل ومعالجات تجميلية من سبا لاديرا وذا ريتريت",
    status: "coming-soon"
  },
  {
    title: "تأجير اليخوت والقوارب",
    description: "استمتع برحلات بحرية خاصة في مارينا الساحل الشمالي ومارينا راس الحكمة مع أفضل مقدمي خدمات اليخوت",
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