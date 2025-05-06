import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from 'lucide-react';

interface BookingStatusData {
  name: string;
  value: number;
  fill: string;
}

interface RecentBooking {
  id: string;
  property: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

interface BookingsManagementProps {
  bookingStatus: BookingStatusData[];
  recentBookings: RecentBooking[];
  formatCurrency: (amount: number) => string;
}

const BookingsManagement: React.FC<BookingsManagementProps> = ({ 
  bookingStatus, 
  recentBookings,
  formatCurrency
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'مؤكد':
        return 'bg-green-500/20 text-green-400';
      case 'بانتظار الدفع':
      case 'معلق':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ملغي':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* حالة الحجوزات */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>حالة الحجوزات</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
              <MoreHorizontal size={14} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#fff" 
                        textAnchor="middle" 
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {bookingStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#111827" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value: any) => [`${value} حجز`, '']}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingRight: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-3 w-full gap-3 text-center">
            <div className="bg-gray-800/50 rounded-md p-2">
              <p className="text-sm font-bold text-green-400">مؤكدة</p>
              <p className="text-lg font-semibold">72%</p>
            </div>
            <div className="bg-gray-800/50 rounded-md p-2">
              <p className="text-sm font-bold text-yellow-400">معلقة</p>
              <p className="text-lg font-semibold">18%</p>
            </div>
            <div className="bg-gray-800/50 rounded-md p-2">
              <p className="text-sm font-bold text-red-400">ملغاة</p>
              <p className="text-lg font-semibold">10%</p>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* آخر الحجوزات */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>آخر الحجوزات</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
              <MoreHorizontal size={14} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div>
                  <div className="text-sm font-medium">{booking.property}</div>
                  <div className="text-xs text-gray-400">{booking.customer}</div>
                </div>
                <div className="text-sm font-semibold">{formatCurrency(booking.amount)}</div>
                <div className="text-right">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  <div className="text-xs text-gray-400 mt-1">{booking.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-center">
            <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
              عرض كل الحجوزات
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingsManagement;