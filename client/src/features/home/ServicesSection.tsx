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

  if (activeLoading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-700 h-10 w-10"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-gray-400 mb-8">
          استمتع بخدماتنا الحصرية التي تجعل إقامتك تجربة لا تُنسى. نتعاون مع أفضل الشركاء في الساحل الشمالي لتوفير تجارب استثنائية لضيوفنا.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {activeServices?.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-105 border border-gray-700 group"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {service.title.includes("مطاعم") ? (
                    <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full mr-4">
                      <span className="text-3xl">🍽️</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mr-4">
                      <span className="text-3xl">💃</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${service.title.includes("مطاعم") ? "bg-green-400 text-black" : "bg-purple-400 text-black"}`}>
                    {service.title.includes("مطاعم") ? "مجاناً" : "5$ فقط"}
                  </span>
                </div>
              </div>
              
              <p className="text-md mb-8">{service.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">أماكن متاحة اليوم</span>
                  <div className="flex items-center">
                    <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${service.title.includes("مطاعم") ? "bg-green-400 w-3/4" : "bg-purple-400 w-1/2"}`}></div>
                    </div>
                    <span className="text-sm text-gray-300 ml-2">
                      {service.title.includes("مطاعم") ? "75%" : "50%"}
                    </span>
                  </div>
                </div>
                
                <button className={`${service.title.includes("مطاعم") ? "bg-green-400 hover:bg-green-500" : "bg-purple-400 hover:bg-purple-500"} text-black font-bold py-3 px-6 rounded-lg transition-colors group-hover:scale-105`}>
                  احجز الآن
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <a href="/services" className="inline-flex items-center justify-center gap-2 text-green-400 hover:text-green-300 font-bold text-lg">
          عرض جميع الخدمات
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
}