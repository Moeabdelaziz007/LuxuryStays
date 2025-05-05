// features/home/ServicesSection.tsx
import { collection, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";

interface Service {
  id: string;
  title: string;
  description: string;
  status: "active" | "coming-soon";
}

export default function ServicesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "services"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
    }
  });

  if (isLoading) return <p className="text-center">جاري تحميل الخدمات...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((service) => (
        <div
          key={service.id}
          className={`rounded-xl p-4 shadow-md ${
            service.status === "coming-soon"
              ? "bg-gray-700 text-white opacity-60"
              : "bg-white text-black"
          }`}
        >
          <h3 className="text-xl font-bold mb-2">{service.title}</h3>
          <p className="text-sm">{service.description}</p>
        </div>
      ))}
    </div>
  );
}