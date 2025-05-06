import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaHeart, FaMapMarkerAlt, FaBed } from "react-icons/fa";

// Define types
interface FavoriteProperty {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  price: number;
  location: string;
  bedrooms?: number;
  [key: string]: any; // Allow additional properties
}

interface FavoritesListProps {
  favorites: FavoriteProperty[];
  isLoading: boolean;
  error: Error | null;
  onRemoveFavorite?: (id: string) => void;
}

export default function FavoritesList({ favorites, isLoading, error, onRemoveFavorite }: FavoritesListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="animate-pulse">
              <div className="h-40 bg-gray-700"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-700 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
        <p className="text-red-400">حدث خطأ أثناء تحميل المفضلة: {error.message}</p>
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 mb-4">
          <FaHeart className="h-6 w-6 text-[#39FF14]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">لا توجد عقارات في المفضلة</h3>
        <p className="text-gray-400 mb-4">
          ابدأ بإضافة العقارات المفضلة لديك لتتمكن من الوصول إليها بسهولة فيما بعد
        </p>
        <Button
          variant="default"
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
          asChild
        >
          <a href="/properties">استكشف العقارات</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {favorites.map((favorite) => (
        <Card 
          key={favorite.id} 
          className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all overflow-hidden group"
        >
          <div className="relative">
            <div className="relative h-40 overflow-hidden">
              <img
                src={favorite.propertyImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170"}
                alt={favorite.propertyName}
                className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            {/* Price badge - top right */}
            <div className="absolute top-0 right-0 m-3">
              <div className="bg-[#39FF14] text-black px-2 py-1 rounded-md font-bold">
                ${favorite.price} / ليلة
              </div>
            </div>
            
            {/* Remove button - top left */}
            {onRemoveFavorite && (
              <button
                onClick={() => onRemoveFavorite(favorite.id)}
                className="absolute top-0 left-0 m-3 bg-black/50 hover:bg-red-600 transition-colors p-2 rounded-full"
                aria-label="إزالة من المفضلة"
              >
                <FaHeart className="text-white h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-white font-bold mb-2 group-hover:text-[#39FF14] transition-colors">
              {favorite.propertyName}
            </h3>
            
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <FaMapMarkerAlt className="mr-1 text-[#39FF14]" />
              <span>{favorite.location || "موقع غير متوفر"}</span>
            </div>
            
            {favorite.bedrooms && (
              <div className="flex items-center text-sm text-gray-400 mb-3">
                <FaBed className="mr-1 text-[#39FF14]" />
                <span>{favorite.bedrooms} غرفة نوم</span>
              </div>
            )}
            
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black"
                asChild
              >
                <a href={`/properties/${favorite.propertyId}`}>عرض التفاصيل</a>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}