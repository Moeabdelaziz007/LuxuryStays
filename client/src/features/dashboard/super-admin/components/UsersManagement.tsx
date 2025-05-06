import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { UserRole } from '@shared/schema';

interface UsersByRoleData {
  name: string;
  value: number;
  fill: string;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

interface UsersManagementProps {
  usersByRole: UsersByRoleData[];
  recentUsers: RecentUser[];
  roleChange: (userId: string, newRole: UserRole) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ usersByRole, recentUsers, roleChange }) => {
  const [showRoleOptions, setShowRoleOptions] = useState<string | null>(null);

  const toggleRoleOptions = (userId: string) => {
    setShowRoleOptions(showRoleOptions === userId ? null : userId);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    roleChange(userId, newRole);
    setShowRoleOptions(null);
  };

  // تحويل قيم التعداد إلى أسماء عربية للعرض
  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case UserRole.PROPERTY_ADMIN:
        return 'مدير عقارات';
      case UserRole.SUPER_ADMIN:
        return 'مشرف عام';
      case UserRole.CUSTOMER:
      default:
        return 'عميل';
    }
  };

  // الحصول على لون خلفية الدور
  const getRoleStatusColor = (role: string) => {
    switch (role) {
      case UserRole.PROPERTY_ADMIN:
        return 'bg-blue-500/20 text-blue-400';
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-500/20 text-purple-400';
      case UserRole.CUSTOMER:
      default:
        return 'bg-emerald-500/20 text-emerald-400';
    }
  };

  // الحصول على لون نص الدور
  const getRoleClass = (role: string) => {
    switch (role) {
      case UserRole.PROPERTY_ADMIN:
        return 'text-blue-400';
      case UserRole.SUPER_ADMIN:
        return 'text-purple-400';
      case UserRole.CUSTOMER:
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* توزيع المستخدمين حسب الأدوار */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>توزيع المستخدمين حسب الدور</span>
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
                    data={usersByRole}
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
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#111827" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value: any) => [`${value} مستخدم`, '']}
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
            <div className="w-full flex justify-center">
              <Button variant="outline" className="border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10">
                <UserPlus size={14} className="mr-2" />
                إضافة مستخدم جديد
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* آخر المستخدمين المسجلين */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>آخر المستخدمين المسجلين</span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
                <MoreHorizontal size={14} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex justify-between items-center pb-3 border-b border-gray-800">
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">{user.date}</div>
                    
                    <div className="relative">
                      <Badge className={`${getRoleStatusColor(user.role)} cursor-pointer`} onClick={() => toggleRoleOptions(user.id)}>
                        <span className="flex items-center">
                          {getRoleDisplayName(user.role)}
                          <ChevronDown size={14} className="ml-1" />
                        </span>
                      </Badge>

                      {showRoleOptions === user.id && (
                        <div className="absolute z-10 top-full right-0 mt-1 w-36 rounded-md shadow-lg bg-gray-800 border border-gray-700">
                          <div className="rounded-md py-1">
                            <button 
                              onClick={() => handleRoleChange(user.id, UserRole.CUSTOMER)}
                              className={`block w-full text-right px-4 py-2 text-xs ${user.role === UserRole.CUSTOMER ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                            >
                              <span className={user.role === UserRole.CUSTOMER ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                                عميل {user.role === UserRole.CUSTOMER && <CheckCircle size={12} className="inline ml-1" />}
                              </span>
                            </button>
                            <button 
                              onClick={() => handleRoleChange(user.id, UserRole.PROPERTY_ADMIN)}
                              className={`block w-full text-right px-4 py-2 text-xs ${user.role === UserRole.PROPERTY_ADMIN ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                            >
                              <span className={user.role === UserRole.PROPERTY_ADMIN ? 'text-blue-400 font-bold' : 'text-gray-300'}>
                                مدير عقارات {user.role === UserRole.PROPERTY_ADMIN && <CheckCircle size={12} className="inline ml-1" />}
                              </span>
                            </button>
                            <button 
                              onClick={() => handleRoleChange(user.id, UserRole.SUPER_ADMIN)}
                              className={`block w-full text-right px-4 py-2 text-xs ${user.role === UserRole.SUPER_ADMIN ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                            >
                              <span className={user.role === UserRole.SUPER_ADMIN ? 'text-purple-400 font-bold' : 'text-gray-300'}>
                                مشرف عام {user.role === UserRole.SUPER_ADMIN && <CheckCircle size={12} className="inline ml-1" />}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center">
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
                عرض كل المستخدمين
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UsersManagement;