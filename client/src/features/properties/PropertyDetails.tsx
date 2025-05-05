import React from "react";
import { useLocation } from "wouter";

export default function PropertyDetails() {
  const [, setLocation] = useLocation();
  const property = {
    id: "p1",
    name: "فيلا فاخرة في هاسيندا",
    imageUrl: "https://i.ibb.co/BzvWzbh/villa-hero.jpg",
    description: "إقامة ساحرة بإطلالة بحرية ومسبح خاص، مع خدمة تنظيف يومية وموقع مميز داخل هاسيندا باي.",
    pricePerNight: 250,
    location: "هاسيندا باي، الساحل الشمالي"
  };

  const handleBooking = () => {
    setLocation("/booking?propertyId=" + property.id);
  };

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Property Image with Neon Border */}
          <div className="relative">
            <img
              src={property.imageUrl}
              alt="Property"
              className="w-full h-[400px] object-cover rounded-2xl border-2 border-[#39FF14]/20"
            />
            <div className="absolute bottom-4 right-4 bg-[#39FF14] text-black px-4 py-2 rounded-lg font-bold shadow-[0_0_10px_rgba(57,255,20,0.5)]">
              {property.location}
            </div>
          </div>
          
          {/* Property Details */}
          <div>
            <h1 className="text-4xl font-bold text-[#39FF14] mb-4">{property.name}</h1>
            <p className="text-lg text-gray-300 mb-4">{property.description}</p>
            
            {/* Features List */}
            <div className="bg-gray-800/50 p-4 rounded-xl mb-6 border border-[#39FF14]/10">
              <h3 className="text-xl font-semibold text-white mb-2">المميزات</h3>
              <ul className="grid grid-cols-2 gap-2">
                <li className="flex items-center text-gray-300">
                  <span className="text-[#39FF14] mr-2">✓</span> مسبح خاص
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-[#39FF14] mr-2">✓</span> إطلالة بحرية
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-[#39FF14] mr-2">✓</span> خدمة تنظيف
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-[#39FF14] mr-2">✓</span> مطبخ مجهز
                </li>
              </ul>
            </div>
            
            {/* Price & Booking */}
            <div className="text-xl font-semibold text-white mb-6 flex items-baseline">
              <span className="text-2xl text-[#39FF14] font-bold">${property.pricePerNight}</span>
              <span className="text-gray-400 ml-2">/ ليلة</span>
            </div>
            
            <button
              onClick={handleBooking}
              className="bg-[#39FF14] text-black font-bold py-3 px-8 rounded-xl text-lg hover:scale-105 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            >
              احجز الآن
            </button>
            
            {/* Additional Info */}
            <div className="mt-6 text-sm text-gray-400">
              * يرجى العلم أن الحجز يتطلب دفع تأمين قابل للاسترداد بقيمة $100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}