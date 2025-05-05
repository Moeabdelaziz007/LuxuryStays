// features/home/FeaturedProperties.tsx
import { collection, getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";

interface Property {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export default function FeaturedProperties() {
  const { data, isLoading } = useQuery({ 
    queryKey: ["featured-properties"], 
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "properties"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Property[];
    }
  });

  if (isLoading) return <p className="text-center">جاري التحميل...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((property) => (
        <div key={property.id} className="bg-white text-black rounded-xl shadow-lg overflow-hidden">
          <img src={property.imageUrl} alt="property" className="w-full h-52 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{property.name}</h3>
            <p className="text-sm text-gray-700">{property.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}