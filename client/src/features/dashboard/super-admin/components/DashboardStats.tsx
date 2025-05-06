import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Users, Building, Calendar, CircleDollarSign, Activity } from 'lucide-react';

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
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  // تأثير متوهج للأيقونات
  const glowStyle = (color: string) => ({
    filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color}40)`,
  });

  // تأثير تموج للتقدم
  const waveAnimation = (delay: number) => ({
    animation: `pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite ${delay}s`,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* عدد المستخدمين */}
      <Card className={`border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg relative overflow-hidden hover:shadow-[0_0_25px_rgba(57,255,20,0.2)] transition-all duration-500 hover:scale-[1.02] hover:border-[#39FF14]/30 ${animate ? 'animate-fade-in' : 'opacity-0'}`}
           style={{ animationDelay: '0.1s' }}>
        {/* خلفية مزخرفة */}
        <div className="absolute -top-14 -right-14 w-28 h-28 bg-[#39FF14]/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#39FF14]/5 text-[#39FF14] transform hover:rotate-12 transition-transform duration-300"
                 style={glowStyle('#39FF14')}>
              <Users size={24} className="animate-pulse-subtle" />
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center backdrop-blur-sm border ${stats.usersGrowth > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {stats.usersGrowth > 0 ? <ArrowUpRight size={14} className="mr-1.5" /> : <ArrowDownRight size={14} className="mr-1.5" />}
              {Math.abs(stats.usersGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold mb-2 font-mono tracking-tight flex items-baseline gap-1">
            <span className="text-white animate-count-up">{stats.users.toLocaleString('ar-EG')}</span>
            <span className="text-[#39FF14] text-xl">+</span>
          </div>
          <p className="text-gray-400 text-sm">المستخدمين المسجلين</p>
        </CardContent>
        <CardFooter className="pt-0 relative z-10">
          <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-[#39FF14]/80 to-[#39FF14] h-full rounded-full relative overflow-hidden" 
                 style={{width: '78%', ...waveAnimation(0)}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-5 bg-white/10 rounded-full transform rotate-5 skew-x-5 translate-y-2"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Activity size={12} />
              <span>نشط</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* عدد العقارات */}
      <Card className={`border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg relative overflow-hidden hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/30 ${animate ? 'animate-fade-in' : 'opacity-0'}`}
           style={{ animationDelay: '0.2s' }}>
        {/* خلفية مزخرفة */}
        <div className="absolute -top-14 -right-14 w-28 h-28 bg-cyan-500/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-400 transform hover:rotate-12 transition-transform duration-300"
                 style={glowStyle('rgb(34, 211, 238)')}>
              <Building size={24} className="animate-pulse-subtle" />
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center backdrop-blur-sm border ${stats.propertiesGrowth > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {stats.propertiesGrowth > 0 ? <ArrowUpRight size={14} className="mr-1.5" /> : <ArrowDownRight size={14} className="mr-1.5" />}
              {Math.abs(stats.propertiesGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold mb-2 font-mono tracking-tight flex items-baseline gap-1">
            <span className="text-white animate-count-up">{stats.properties.toLocaleString('ar-EG')}</span>
            <span className="text-cyan-400 text-xl">+</span>
          </div>
          <p className="text-gray-400 text-sm">العقارات المسجلة</p>
        </CardContent>
        <CardFooter className="pt-0 relative z-10">
          <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-cyan-500/80 to-cyan-400 h-full rounded-full relative overflow-hidden" 
                 style={{width: '65%', ...waveAnimation(0.3)}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-5 bg-white/10 rounded-full transform rotate-5 skew-x-5 translate-y-2"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Activity size={12} />
              <span>نشط</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* عدد الحجوزات */}
      <Card className={`border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg relative overflow-hidden hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/30 ${animate ? 'animate-fade-in' : 'opacity-0'}`}
           style={{ animationDelay: '0.3s' }}>
        {/* خلفية مزخرفة */}
        <div className="absolute -top-14 -right-14 w-28 h-28 bg-purple-500/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400 transform hover:rotate-12 transition-transform duration-300"
                 style={glowStyle('rgb(168, 85, 247)')}>
              <Calendar size={24} className="animate-pulse-subtle" />
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center backdrop-blur-sm border ${stats.bookingsGrowth > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {stats.bookingsGrowth > 0 ? <ArrowUpRight size={14} className="mr-1.5" /> : <ArrowDownRight size={14} className="mr-1.5" />}
              {Math.abs(stats.bookingsGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold mb-2 font-mono tracking-tight flex items-baseline gap-1">
            <span className="text-white animate-count-up">{stats.bookings.toLocaleString('ar-EG')}</span>
            <span className="text-purple-400 text-xl">+</span>
          </div>
          <p className="text-gray-400 text-sm">إجمالي الحجوزات</p>
        </CardContent>
        <CardFooter className="pt-0 relative z-10">
          <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-500/80 to-purple-400 h-full rounded-full relative overflow-hidden" 
                 style={{width: '82%', ...waveAnimation(0.6)}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-5 bg-white/10 rounded-full transform rotate-5 skew-x-5 translate-y-2"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Activity size={12} />
              <span>نشط</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* الإيرادات */}
      <Card className={`border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 shadow-lg relative overflow-hidden hover:shadow-[0_0_25px_rgba(251,191,36,0.2)] transition-all duration-500 hover:scale-[1.02] hover:border-amber-500/30 ${animate ? 'animate-fade-in' : 'opacity-0'}`}
           style={{ animationDelay: '0.4s' }}>
        {/* خلفية مزخرفة */}
        <div className="absolute -top-14 -right-14 w-28 h-28 bg-amber-500/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400 transform hover:rotate-12 transition-transform duration-300"
                 style={glowStyle('rgb(251, 191, 36)')}>
              <CircleDollarSign size={24} className="animate-pulse-subtle" />
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center backdrop-blur-sm border ${stats.revenueGrowth > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {stats.revenueGrowth > 0 ? <ArrowUpRight size={14} className="mr-1.5" /> : <ArrowDownRight size={14} className="mr-1.5" />}
              {Math.abs(stats.revenueGrowth)}%
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-bold mb-2 font-mono tracking-tight flex items-baseline gap-1">
            <span className="text-white animate-count-up">{formatCurrency(stats.revenue)}</span>
            <span className="text-amber-400 text-xl">+</span>
          </div>
          <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
        </CardContent>
        <CardFooter className="pt-0 relative z-10">
          <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-amber-500/80 to-amber-400 h-full rounded-full relative overflow-hidden" 
                 style={{width: '92%', ...waveAnimation(0.9)}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-5 bg-white/10 rounded-full transform rotate-5 skew-x-5 translate-y-2"></div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Activity size={12} />
              <span>نشط</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardStats;