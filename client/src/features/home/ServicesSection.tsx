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
    <div className="space-y-8">
      {/* Active Services */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-green-400">الخدمات المتاحة الآن</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeServices?.map((service) => (
            <div
              key={service.id}
              className="bg-white text-black rounded-xl p-4 shadow-md"
            >
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
              <button className="mt-4 bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg text-sm">
                احجز الآن
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Services */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-green-400">خدمات قادمة قريباً</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {comingSoonServices?.map((service) => (
            <div
              key={service.id}
              className="bg-gray-700 text-white rounded-xl p-4 shadow-md opacity-80"
            >
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
              <span className="mt-4 inline-block text-xs bg-green-400 text-black px-3 py-1 rounded-full">
                قريباً - صيف 2025
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}