import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Check, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  Server,
  Database,
  Shield,
  Globe
} from 'lucide-react';

interface SystemStatusProps {
  systemHealth: {
    server: 'healthy' | 'warning' | 'critical';
    database: 'healthy' | 'warning' | 'critical';
    security: 'healthy' | 'warning' | 'critical';
    api: 'healthy' | 'warning' | 'critical';
    lastUpdated: string;
  }
}

const SystemStatus: React.FC<SystemStatusProps> = ({ systemHealth }) => {
  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <Check size={16} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'critical':
        return <X size={16} className="text-red-400" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500/20 text-green-400">جيد</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400">تحذير</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-400">خطأ</Badge>;
    }
  };

  const getStatusBackground = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'critical':
        return 'bg-red-500/10';
    }
  };

  return (
    <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>حالة النظام</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2 border-gray-700">
              <RefreshCw size={14} className="mr-1" />
              تحديث
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
              <MoreHorizontal size={14} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-lg ${getStatusBackground(systemHealth.server)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-gray-300" />
                <span className="text-sm font-medium">الخادم</span>
              </div>
              {getStatusBadge(systemHealth.server)}
            </div>
            <div className="text-xs text-gray-400">
              {systemHealth.server === 'healthy' && 'الخادم يعمل بكفاءة عالية'}
              {systemHealth.server === 'warning' && 'استخدام الذاكرة مرتفع'}
              {systemHealth.server === 'critical' && 'الخادم غير متاح'}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${getStatusBackground(systemHealth.database)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-gray-300" />
                <span className="text-sm font-medium">قواعد البيانات</span>
              </div>
              {getStatusBadge(systemHealth.database)}
            </div>
            <div className="text-xs text-gray-400">
              {systemHealth.database === 'healthy' && 'قاعدة البيانات تستجيب بشكل طبيعي'}
              {systemHealth.database === 'warning' && 'تأخر في زمن الاستجابة'}
              {systemHealth.database === 'critical' && 'قاعدة البيانات غير متاحة'}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${getStatusBackground(systemHealth.security)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-gray-300" />
                <span className="text-sm font-medium">الأمان</span>
              </div>
              {getStatusBadge(systemHealth.security)}
            </div>
            <div className="text-xs text-gray-400">
              {systemHealth.security === 'healthy' && 'نظام الحماية يعمل بشكل صحيح'}
              {systemHealth.security === 'warning' && 'محاولات دخول مشبوهة'}
              {systemHealth.security === 'critical' && 'ثغرة أمنية محتملة'}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${getStatusBackground(systemHealth.api)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-300" />
                <span className="text-sm font-medium">واجهات API</span>
              </div>
              {getStatusBadge(systemHealth.api)}
            </div>
            <div className="text-xs text-gray-400">
              {systemHealth.api === 'healthy' && 'جميع الواجهات تعمل بكفاءة'}
              {systemHealth.api === 'warning' && 'بعض الطلبات تواجه تأخيرًا'}
              {systemHealth.api === 'critical' && 'فشل في استدعاء الواجهات'}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-400">
        <div className="w-full flex justify-between items-center">
          <span>آخر تحديث: {systemHealth.lastUpdated}</span>
          <Button variant="link" size="sm" className="h-8 px-0 text-xs text-[#39FF14] hover:text-[#39FF14]/80">
            عرض تفاصيل أكثر
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SystemStatus;