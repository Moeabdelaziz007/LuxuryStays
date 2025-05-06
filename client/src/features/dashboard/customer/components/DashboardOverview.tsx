import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt, FaHeart, FaWallet, FaHome } from "react-icons/fa";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  totalFavorites: number;
  totalSpent: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  userName: string;
  isLoading: boolean;
}

export default function DashboardOverview({ stats, userName, isLoading }: DashboardOverviewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse bg-gray-800 rounded-lg p-6">
          <div className="h-8 bg-gray-700 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded-md w-2/3"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-6">
              <div className="h-10 w-10 rounded-full bg-gray-700 mb-4"></div>
              <div className="h-7 bg-gray-700 rounded-md w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded-md w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            مرحباً، {userName || 'عميلنا العزيز'} 👋
          </h2>
          <p className="text-gray-400">
            مرحباً بك في لوحة تحكم StayX. هنا يمكنك إدارة حجوزاتك وتصفح المفضلة وأكثر.
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Bookings Card */}
        <Card className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">الحجوزات النشطة</p>
                <h3 className="text-2xl font-bold text-white">{stats.activeBookings}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center group-hover:bg-[#39FF14]/20 transition-colors">
                <FaCalendarAlt className="text-[#39FF14]" />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="link" className="p-0 h-auto text-[#39FF14]" asChild>
                <Link to="/customer/bookings">عرض الحجوزات</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings Card */}
        <Card className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">إجمالي الحجوزات</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalBookings}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center group-hover:bg-[#39FF14]/20 transition-colors">
                <FaHome className="text-[#39FF14]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                {stats.totalBookings > 0 
                  ? "استمتع بتجارب عقارية مميزة" 
                  : "ابدأ رحلة العقارات الآن"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Card */}
        <Card className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">المفضلة</p>
                <h3 className="text-2xl font-bold text-white">{stats.totalFavorites}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center group-hover:bg-[#39FF14]/20 transition-colors">
                <FaHeart className="text-[#39FF14]" />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="link" className="p-0 h-auto text-[#39FF14]" asChild>
                <Link to="/customer/favorites">عرض المفضلة</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Total Spent Card */}
        <Card className="bg-gray-800 border-gray-700 hover:border-[#39FF14]/30 transition-all group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">إجمالي المصروفات</p>
                <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center group-hover:bg-[#39FF14]/20 transition-colors">
                <FaWallet className="text-[#39FF14]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                {stats.totalSpent > 0 
                  ? "شكراً لثقتك بنا" 
                  : "وفر معنا بأفضل الأسعار"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">روابط سريعة</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="border-gray-700 hover:border-[#39FF14]/30 text-white hover:text-[#39FF14]" asChild>
              <Link to="/properties">تصفح العقارات</Link>
            </Button>
            <Button variant="outline" className="border-gray-700 hover:border-[#39FF14]/30 text-white hover:text-[#39FF14]" asChild>
              <Link to="/services">الخدمات المتاحة</Link>
            </Button>
            <Button variant="outline" className="border-gray-700 hover:border-[#39FF14]/30 text-white hover:text-[#39FF14]" asChild>
              <Link to="/customer/profile">إعدادات الحساب</Link>
            </Button>
            <Button variant="outline" className="border-gray-700 hover:border-[#39FF14]/30 text-white hover:text-[#39FF14]" asChild>
              <Link to="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}