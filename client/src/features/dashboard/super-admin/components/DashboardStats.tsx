import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, Building, Calendar, CircleDollarSign } from 'lucide-react';

interface StatsProps {
  stats: {
    users: number;
    properties: number;
    bookings: number;
    revenue: number;
    usersGrowth: number;
    propertiesGrowth: number;
    bookingsGrowth: number;
    revenueGrowth: number;
  };
  formatCurrency: (amount: number) => string;
}

const DashboardStats: React.FC<StatsProps> = ({ stats, formatCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* عدد المستخدمين */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-[#39FF14]/10 text-[#39FF14]">
              <Users size={20} />
            </div>
            <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.usersGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.usersGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(stats.usersGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{stats.users.toLocaleString('ar-EG')}</div>
          <p className="text-gray-400 text-sm">المستخدمين المسجلين</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-[#39FF14] h-full rounded-full" style={{width: '78%'}}></div>
          </div>
        </CardFooter>
      </Card>
      
      {/* عدد العقارات */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Building size={20} />
            </div>
            <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.propertiesGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.propertiesGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(stats.propertiesGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{stats.properties.toLocaleString('ar-EG')}</div>
          <p className="text-gray-400 text-sm">العقارات المسجلة</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{width: '65%'}}></div>
          </div>
        </CardFooter>
      </Card>
      
      {/* عدد الحجوزات */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Calendar size={20} />
            </div>
            <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.bookingsGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.bookingsGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(stats.bookingsGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{stats.bookings.toLocaleString('ar-EG')}</div>
          <p className="text-gray-400 text-sm">إجمالي الحجوزات</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{width: '82%'}}></div>
          </div>
        </CardFooter>
      </Card>
      
      {/* الإيرادات */}
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CircleDollarSign size={20} />
            </div>
            <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.revenueGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.revenueGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(stats.revenueGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{formatCurrency(stats.revenue)}</div>
          <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{width: '92%'}}></div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardStats;