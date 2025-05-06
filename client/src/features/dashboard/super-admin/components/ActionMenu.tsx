import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  CircleDollarSign, 
  Calendar, 
  Bell, 
  Settings,
  UserPlus,
  FileText,
  Upload,
  ShieldCheck,
  PieChart,
  RefreshCcw,
  Download
} from 'lucide-react';

const ActionMenu: React.FC = () => {
  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm col-span-1 lg:col-span-3">
      <CardContent className="p-4">
        <Tabs defaultValue="quick-actions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-800/80">
            <TabsTrigger value="quick-actions">إجراءات سريعة</TabsTrigger>
            <TabsTrigger value="management">الإدارة</TabsTrigger>
            <TabsTrigger value="reports">التقارير</TabsTrigger>
          </TabsList>
          
          {/* إجراءات سريعة */}
          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <ActionButton 
                to="/super-admin/users/add"
                icon={<UserPlus size={18} />}
                label="إضافة مستخدم"
                color="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20"
              />
              <ActionButton 
                to="/super-admin/properties/add"
                icon={<Building size={18} />}
                label="إضافة عقار"
                color="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              />
              <ActionButton 
                to="/super-admin/bookings/manage"
                icon={<Calendar size={18} />}
                label="إدارة الحجوزات"
                color="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              />
              <ActionButton 
                to="/super-admin/settings"
                icon={<Settings size={18} />}
                label="إعدادات النظام"
                color="bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
              />
              <ActionButton 
                to="/super-admin/notifications"
                icon={<Bell size={18} />}
                label="إشعارات النظام"
                color="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              />
            </div>
          </TabsContent>
          
          {/* الإدارة */}
          <TabsContent value="management" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <ActionButton 
                to="/super-admin/users"
                icon={<Users size={18} />}
                label="المستخدمين"
                color="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20"
              />
              <ActionButton 
                to="/super-admin/properties"
                icon={<Building size={18} />}
                label="العقارات"
                color="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              />
              <ActionButton 
                to="/super-admin/bookings"
                icon={<Calendar size={18} />}
                label="الحجوزات"
                color="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              />
              <ActionButton 
                to="/super-admin/revenue"
                icon={<CircleDollarSign size={18} />}
                label="الإيرادات"
                color="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              />
              <ActionButton 
                to="/super-admin/security"
                icon={<ShieldCheck size={18} />}
                label="الأمان والصلاحيات"
                color="bg-red-500/10 text-red-400 hover:bg-red-500/20"
              />
            </div>
          </TabsContent>
          
          {/* التقارير */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <ActionButton 
                to="/super-admin/reports/sales"
                icon={<CircleDollarSign size={18} />}
                label="تقارير المبيعات"
                color="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20"
              />
              <ActionButton 
                to="/super-admin/reports/users"
                icon={<Users size={18} />}
                label="تقارير المستخدمين"
                color="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              />
              <ActionButton 
                to="/super-admin/reports/bookings"
                icon={<FileText size={18} />}
                label="تقارير الحجوزات"
                color="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
              />
              <ActionButton 
                to="/super-admin/reports/export"
                icon={<Download size={18} />}
                label="تصدير التقارير"
                color="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              />
              <ActionButton 
                to="/super-admin/reports/analytics"
                icon={<PieChart size={18} />}
                label="تحليلات النظام"
                color="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ActionButtonProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ to, icon, label, color }) => {
  return (
    <Link to={to} className="block w-full">
      <Button 
        variant="ghost" 
        className={`w-full h-auto flex flex-col items-center justify-center py-4 space-y-2 rounded-xl ${color}`}
      >
        <span>{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </Button>
    </Link>
  );
};

export default ActionMenu;