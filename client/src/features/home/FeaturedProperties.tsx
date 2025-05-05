// features/home/FeaturedProperties.tsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";

interface Property {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  location: string;
  pricePerNight: number;
  featured: boolean;
  ownerId: string;
}

export default function FeaturedProperties() {
  const { data, isLoading } = useQuery({ 
    queryKey: ["featured-properties"], 
    queryFn: async () => {
      // Get only featured properties
      const featuredQuery = query(collection(db, "properties"), where("featured", "==", true));
      const snapshot = await getDocs(featuredQuery);
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
            <p className="text-sm text-gray-700 mb-2">{property.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{property.location}</span>
              <span className="text-green-600 font-semibold">${property.pricePerNight}/ليلة</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}