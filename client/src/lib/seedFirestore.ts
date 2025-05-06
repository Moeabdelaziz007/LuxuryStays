import { collection, addDoc, getDocs, query, where, Firestore } from "firebase/firestore";
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

// بيانات واقعية للمطاعم والنوادي الليلية والخدمات المميزة في الساحل الشمالي وراس الحكمة
const services = [
  {
    name: "حجز المطاعم الفاخرة",
    description: "احجز طاولتك بشكل فوري في أفخم وأرقى مطاعم الساحل الشمالي وراس الحكمة مع خصم حصري 15% لعملاء StayX على جميع المأكولات والمشروبات",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    status: "active",
    iconClass: "utensils",
    locations: [
      { name: "مطعم زودياك (Zodiac)", area: "راس الحكمة - ماونتن فيو", cuisine: "مأكولات بحرية ومتوسطية", priceRange: "$$$" },
      { name: "مطعم سمك", area: "بو آيلاند، سيدي عبد الرحمن", cuisine: "مأكولات بحرية طازجة", priceRange: "$$$" },
      { name: "تشيبرياني (Cipriani)", area: "المراسي، الساحل الشمالي", cuisine: "مطبخ إيطالي فاخر", priceRange: "$$$$" },
      { name: "كايرو كيتشين", area: "مارينا، الساحل الشمالي", cuisine: "مأكولات مصرية عصرية", priceRange: "$$" },
      { name: "أندريا مارينا", area: "مارينا، الساحل الشمالي", cuisine: "مطبخ متوسطي", priceRange: "$$$" },
      { name: "زيتونة", area: "هاسيندا باي، الساحل الشمالي", cuisine: "لبناني ومشاوي", priceRange: "$$$" },
      { name: "مطعم إل جونا (El Gouna)", area: "ديبو، راس الحكمة", cuisine: "مأكولات بحرية", priceRange: "$$$" }
    ]
  },
  {
    name: "حجز النوادي الليلية والبيتش كلوب",
    description: "تمتع بقضاء أجمل الأوقات في أشهر النوادي الليلية والشاطئية في الساحل الشمالي وراس الحكمة مع دخول VIP وطاولات محجوزة مسبقًا بدون انتظار",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop",
    status: "active",
    iconClass: "glass-cheers",
    locations: [
      { name: "سيكس ديجريز (6IX Degrees)", area: "ماونتن فيو، راس الحكمة", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات DJ عالمية" },
      { name: "بيتش باد (Beach Bud)", area: "مراقيا، الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات شاطئية نهارية" },
      { name: "سقالة (Scaffold)", area: "المراسي، الساحل الشمالي", type: "نادي ليلي", specialty: "موسيقى الهاوس والإلكترونيك" },
      { name: "مارتنز بيتش كلوب (Martin's)", area: "نورث إيدج، الساحل الشمالي", type: "بيتش كلوب", specialty: "حفلات موسيقية حية" },
      { name: "ساوند بيتش كلوب (Sound)", area: "هاسيندا باي، الساحل الشمالي", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات تيك هاوس" },
      { name: "باليو (Palio)", area: "راس الحكمة", type: "نادي ليلي وبيتش كلوب", specialty: "حفلات مع منظر بانورامي للبحر" },
      { name: "سكرلا بيتش (Secrela)", area: "الساحل الشمالي", type: "بيتش كلوب", specialty: "أجواء استوائية مميزة" }
    ]
  },
  {
    name: "خدمات الشاطئ الخاص",
    description: "استمتع بخدمات الشاطئ الخاص الحصرية مع توفير كراسي استلقاء فاخرة، مظلات، مشروبات باردة ووجبات خفيفة مقدمة مباشرة إلى موقعك على الشاطئ",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    status: "active",
    iconClass: "umbrella-beach",
    locations: [
      { name: "شاطئ ماونتن فيو الخاص", area: "راس الحكمة", specialty: "خدمة كاملة مع مطعم بحري" },
      { name: "هاسيندا بيتش", area: "هاسيندا باي، الساحل الشمالي", specialty: "شواطئ فيروزية هادئة" },
      { name: "لافيستا بيتش", area: "لافيستا باي، الساحل الشمالي", specialty: "مناطق مخصصة للعائلات" },
      { name: "مراسي بيتش", area: "المراسي، الساحل الشمالي", specialty: "خدمة الكابانا الخاصة" }
    ]
  },
  {
    name: "خدمات نقل فاخرة",
    description: "خدمات نقل فاخرة من وإلى مطار برج العرب أو القاهرة بسيارات مرسيدس ومرافقة شخصية. توفر أيضًا خدمة الليموزين للتنقل بين المناطق المختلفة",
    imageUrl: "https://images.unsplash.com/photo-1625066811353-ad8a40306922?q=80&w=2071&auto=format&fit=crop",
    status: "active",
    iconClass: "car-alt",
    locations: [
      { name: "مطار برج العرب", area: "الإسكندرية", specialty: "خدمة استقبال VIP" },
      { name: "مطار القاهرة الدولي", area: "القاهرة", specialty: "خدمة 24 ساعة" },
      { name: "خدمة التنقل الداخلي", area: "الساحل الشمالي", specialty: "سيارات فاخرة مع سائق" },
      { name: "خدمة التنقل الداخلي", area: "راس الحكمة", specialty: "خدمة الليموزين الفاخرة" }
    ]
  },
  {
    name: "مركز الصحة والجمال",
    description: "خدمة مساج وسبا فاخرة داخل الفيلا من معالجين معتمدين. استمتع بتجربة علاجية كاملة من سبا لاديرا وذا ريتريت مع باقات خاصة مصممة للأزواج والعائلات",
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "spa",
    launchDate: new Date("2025-06-15").toISOString(),
    locations: [
      { name: "سبا لاديرا (La'dera Spa)", area: "راس الحكمة", specialty: "معالجات تايلاندية وإندونيسية" },
      { name: "ذا ريتريت (The Retreat)", area: "الساحل الشمالي", specialty: "معالجات الوجه المتقدمة" },
      { name: "إليمنتس سبا (Elements)", area: "ماونتن فيو، راس الحكمة", specialty: "علاجات الأعشاب الطبيعية" },
      { name: "زين سبا (Zen)", area: "هاسيندا باي، الساحل الشمالي", specialty: "جلسات يوغا ومساج" }
    ]
  },
  {
    name: "تأجير اليخوت والقوارب الفاخرة",
    description: "استمتع برحلات بحرية خاصة في مارينا الساحل الشمالي ومارينا راس الحكمة على متن يخوت فاخرة مع طاقم احترافي وتجهيزات كاملة للاسترخاء والترفيه",
    imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "ship",
    launchDate: new Date("2025-07-01").toISOString(),
    locations: [
      { name: "مارينا الساحل الشمالي", area: "الساحل الشمالي", specialty: "يخوت فاخرة حتى 100 قدم" },
      { name: "مارينا راس الحكمة", area: "راس الحكمة", specialty: "رحلات السباحة والغطس" },
      { name: "رحلات صيد VIP", area: "الساحل الشمالي", specialty: "صيد الأسماك مع طاقم محترف" },
      { name: "رحلات غروب الشمس", area: "راس الحكمة", specialty: "جولات غروب الشمس الرومانسية" }
    ]
  },
  {
    name: "الرياضات المائية والأنشطة البحرية",
    description: "استمتع بمجموعة من الأنشطة المائية المثيرة مثل الجيت سكي، ركوب الأمواج، الإبحار بالمظلة، والغطس. تشمل الخدمة التدريب والمعدات الكاملة مع مدربين محترفين",
    imageUrl: "https://images.unsplash.com/photo-1560252406-9f8cbee59304?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "swimming-pool",
    launchDate: new Date("2025-06-15").toISOString(),
    locations: [
      { name: "مركز الرياضات المائية", area: "راس الحكمة", specialty: "جيت سكي ووركوب الأمواج" },
      { name: "نادي الغطس", area: "الساحل الشمالي", specialty: "غطس سكوبا واستكشاف الشعاب" },
      { name: "مركز الإبحار الشراعي", area: "مارينا، الساحل الشمالي", specialty: "دروس الإبحار الشراعي" },
      { name: "نادي الباراسيلينج", area: "سيدي عبد الرحمن", specialty: "رحلات الإبحار بالمظلة" }
    ]
  },
  {
    name: "خدمات المناسبات والحفلات الخاصة",
    description: "نظّم حفلات خاصة، مناسبات، وحفلات زفاف على الشاطئ مع خدمة تخطيط متكاملة تشمل الديكور، الإضاءة، الضيافة، والترفيه. نوفر تجارب لا تُنسى لجميع المناسبات",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop",
    status: "coming-soon",
    iconClass: "glass-cheers",
    launchDate: new Date("2025-07-15").toISOString(),
    locations: [
      { name: "فيلا المنتزه", area: "راس الحكمة", specialty: "حفلات زفاف على الشاطئ" },
      { name: "قاعة سي فيو", area: "هاسيندا باي، الساحل الشمالي", specialty: "حفلات الخطوبة والمناسبات" },
      { name: "شاطئ الأحلام الخاص", area: "نورث إيدج، الساحل الشمالي", specialty: "حفلات الشاطئ الخاصة" },
      { name: "يخت الاحتفالات", area: "مارينا، الساحل الشمالي", specialty: "مناسبات خاصة على اليخت" }
    ]
  }
];

export const seedFirestore = async () => {
  try {
    // Check if Firebase is available
    if (!db) {
      console.error("Firebase Firestore is not available");
      return { success: false, error: "Firebase Firestore is not available" };
    }
    
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

    // Always seed the services regardless if they exist or not
    // This is because the resetAndSeedServices function should handle the deletion
    console.log("Seeding services...");
    for (const service of services) {
      await addDoc(collection(db, "services"), service);
    }
    console.log("Services seeded successfully!");

    return { success: true };
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return { success: false, error };
  }
};