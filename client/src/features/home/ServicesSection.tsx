// features/home/ServicesSection.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";

interface Service {
  id: string;
  title: string;
  description: string;
  status: "active" | "coming-soon";
}

export default function ServicesSection() {
  const { data: activeServices, isLoading: activeLoading } = useQuery({
    queryKey: ["services", "active"],
    queryFn: async () => {
      const activeQuery = query(collection(db, "services"), where("status", "==", "active"));
      const snapshot = await getDocs(activeQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
    }
  });

  const { data: comingSoonServices, isLoading: comingSoonLoading } = useQuery({
    queryKey: ["services", "coming-soon"],
    queryFn: async () => {
      const comingSoonQuery = query(collection(db, "services"), where("status", "==", "coming-soon"));
      const snapshot = await getDocs(comingSoonQuery);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
    }
  });

  if (activeLoading || comingSoonLoading) 
    return <p className="text-center">جاري تحميل الخدمات...</p>;

  return (
    <div className="space-y-12">
      {/* Active Services */}
      <div>
        <h3 className="text-2xl font-bold mb-8 text-green-400 text-center">الخدمات المتاحة الآن</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeServices?.map((service) => (
            <div
              key={service.id}
              className="bg-white text-black rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {service.title.includes("مطاعم") ? (
                    <span className="text-3xl p-2 bg-green-100 text-green-600 rounded-full mr-3">🍽️</span>
                  ) : (
                    <span className="text-3xl p-2 bg-purple-100 text-purple-600 rounded-full mr-3">💃</span>
                  )}
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                
                <p className="text-md mb-6">{service.description}</p>
                
                <div className="flex justify-between items-center mt-8">
                  <span className="text-green-500 font-bold">
                    {service.title.includes("مطاعم") ? "مجاناً" : "5$ فقط"}
                  </span>
                  <button className="bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg text-md transition-colors">
                    احجز الآن
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Services */}
      <div>
        <h3 className="text-2xl font-bold mb-8 text-green-400 text-center">خدمات قادمة قريباً</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comingSoonServices?.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800 text-white rounded-xl p-6 shadow-md border border-gray-700"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-2xl mr-2">
                  {service.title.includes("مساج") ? "💆‍♀️" : "⛵"}
                </span>
                {service.title}
              </h3>
              <p className="text-md text-gray-300 mb-6">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="mt-4 inline-block text-xs bg-green-400 text-black px-3 py-1 rounded-full">
                  قريباً - صيف 2025
                </span>
                <button className="text-green-400 border border-green-400 hover:bg-green-400 hover:text-black font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                  أعلمني عند الإطلاق
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}