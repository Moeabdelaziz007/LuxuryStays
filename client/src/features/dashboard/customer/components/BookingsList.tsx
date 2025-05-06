import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

// Define types
interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  checkInDate: any;
  checkOutDate: any;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
  [key: string]: any; // Allow additional properties
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  error: Error | null;
}

export default function BookingsList({ bookings, isLoading, error }: BookingsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-700 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-4">
        <p className="text-red-400">حدث خطأ أثناء تحميل الحجوزات: {error.message}</p>
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 mb-4">
          <FaCalendarAlt className="h-6 w-6 text-[#39FF14]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">لا توجد حجوزات حالية</h3>
        <p className="text-gray-400 mb-4">
          ابدأ باستكشاف العقارات المميزة واحجز إقامتك المثالية الآن
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
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all overflow-hidden group">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/3 h-40 md:h-auto relative overflow-hidden">
              <img
                src={booking.propertyImage || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170"}
                alt={booking.propertyName}
                className="w-full h-full object-cover transform transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-3 w-full">
                <Badge className={
                  booking.status === 'confirmed' ? "bg-green-500" :
                  booking.status === 'pending' ? "bg-yellow-500" : "bg-red-500"
                }>
                  {booking.status === 'confirmed' ? 'مؤكد' :
                   booking.status === 'pending' ? 'معلق' : 'ملغي'}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/3 p-4 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{booking.propertyName}</h3>
                <span className="text-[#39FF14] font-bold">${booking.totalPrice}</span>
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-2">
                <FaMapMarkerAlt className="mr-1 text-[#39FF14]" />
                <span>{booking.location || "موقع غير متوفر"}</span>
              </div>

              <div className="mt-auto space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-[#39FF14]" />
                    <span className="text-gray-300">تاريخ الوصول:</span>
                  </div>
                  <span className="text-white">
                    {formatDate(booking.checkInDate, 'ar-EG', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-[#39FF14]" />
                    <span className="text-gray-300">تاريخ المغادرة:</span>
                  </div>
                  <span className="text-white">
                    {formatDate(booking.checkOutDate, 'ar-EG', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-700 flex justify-end">
                  <Button
                    variant="outline"
                    className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black"
                    asChild
                  >
                    <a href={`/booking/${booking.id}`}>عرض التفاصيل</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}