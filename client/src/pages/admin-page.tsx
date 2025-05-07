import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminHealthCheck from '@/features/admin/AdminHealthCheck';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@shared/schema';
import { useLocation, useRoute } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const [, navigate] = useLocation();
  
  // Redirect if user is not authenticated or not an admin
  if (!user || (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.PROPERTY_ADMIN)) {
    navigate('/');
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">لوحة تحكم المشرف</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>مرحباً {user.name}</CardTitle>
                <CardDescription>أنت مسجل الدخول كـ {user.role === UserRole.SUPER_ADMIN ? 'مشرف عام' : 'مدير عقار'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">استخدم لوحة التحكم هذه لإدارة المستخدمين والعقارات والحجوزات.</p>
              </CardContent>
            </Card>
            
            <AdminHealthCheck />
          </div>
          
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>إحصائيات النظام</CardTitle>
                <CardDescription>نظرة عامة على أداء النظام والبيانات</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-12 text-muted-foreground">
                  سيتم عرض الإحصائيات هنا قريباً...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}