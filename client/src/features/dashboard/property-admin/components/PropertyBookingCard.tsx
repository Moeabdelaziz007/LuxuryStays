import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, MapPin, DollarSign, Check, X, Clock } from "lucide-react";
import { formatDate } from '@/lib/utils';

interface PropertyBookingCardProps {
  booking: {
    id: string;
    customerName: string;
    propertyName: string;
    checkInDate: any;
    checkOutDate: any;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: any;
    location?: string;
    imageUrl?: string;
  };
  onViewDetails: (id: string) => void;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  delay?: number;
  animate?: boolean;
}

export const PropertyBookingCard: React.FC<PropertyBookingCardProps> = ({
  booking,
  onViewDetails,
  onConfirm,
  onCancel,
  delay = 0,
  animate = true
}) => {
  // Status color and label
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { 
          color: 'text-green-500', 
          bgColor: 'bg-green-500/10', 
          borderColor: 'border-green-500/30',
          icon: <Check className="h-3.5 w-3.5" />,
          label: 'مؤكد' 
        };
      case 'pending':
        return { 
          color: 'text-amber-500', 
          bgColor: 'bg-amber-500/10', 
          borderColor: 'border-amber-500/30',
          icon: <Clock className="h-3.5 w-3.5" />,
          label: 'قيد الانتظار' 
        };
      case 'cancelled':
        return { 
          color: 'text-red-500', 
          bgColor: 'bg-red-500/10', 
          borderColor: 'border-red-500/30',
          icon: <X className="h-3.5 w-3.5" />,
          label: 'ملغي' 
        };
      default:
        return { 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-500/10', 
          borderColor: 'border-gray-500/30',
          icon: <X className="h-3.5 w-3.5" />,
          label: 'غير معروف' 
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);
  
  // Animation classes
  const fadeInClass = animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const delayStyle = { transitionDelay: `${delay}ms` };

  return (
    <Card 
      className={`overflow-hidden border border-gray-800 transition-all duration-500 
        hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10
        ${fadeInClass} bg-gradient-to-br from-gray-900 to-gray-950`}
      style={delayStyle}
    >
      <div className="flex flex-col md:flex-row">
        {/* Property Image */}
        <div className="w-full md:w-48 h-32 md:h-auto relative">
          {booking.imageUrl ? (
            <img 
              src={booking.imageUrl} 
              alt={booking.propertyName} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-800 flex items-center justify-center">
              <div className="text-gray-600 flex flex-col items-center gap-1">
                <img 
                  src="/assets/property-placeholder.svg" 
                  alt="Property" 
                  className="w-12 h-12 opacity-30"
                />
              </div>
            </div>
          )}
          
          {/* Status badge overlaid on image */}
          <Badge 
            className={`absolute top-2 right-2 ${statusInfo.bgColor} ${statusInfo.color} 
              border ${statusInfo.borderColor} flex items-center gap-1 px-2 py-1`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
        
        {/* Booking Details */}
        <CardContent className="flex-1 p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{booking.propertyName}</h3>
              {booking.location && (
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                  <span>{booking.location}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center bg-gray-800/60 rounded-md px-3 py-1.5 text-sm">
              <User className="h-3.5 w-3.5 mr-2 text-indigo-400" />
              <span className="text-white">{booking.customerName}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-800/60 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">تاريخ الوصول</div>
              <div className="flex items-center text-white text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                {formatDate(booking.checkInDate)}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">تاريخ المغادرة</div>
              <div className="flex items-center text-white text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                {formatDate(booking.checkOutDate)}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">رقم الحجز</div>
              <div className="text-white text-sm font-mono">
                #{booking.id.substring(0, 8)}
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-md p-2">
              <div className="text-xs text-gray-400 mb-1">السعر</div>
              <div className="flex items-center text-indigo-400 text-sm font-semibold">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                {booking.totalPrice}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="default" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onViewDetails(booking.id)}
            >
              عرض التفاصيل
            </Button>
            
            {booking.status === 'pending' && onConfirm && (
              <Button 
                size="sm" 
                variant="outline"

                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                onClick={() => onConfirm(booking.id)}
              >
                تأكيد الحجز
              </Button>
            )}
            
            {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => onCancel(booking.id)}
              >
                إلغاء الحجز
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PropertyBookingCard;