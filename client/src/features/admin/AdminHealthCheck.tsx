import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    firebase: 'healthy' | 'unhealthy';
  };
  env: string;
}

export default function AdminHealthCheck() {
  const { 
    data: healthStatus,
    isLoading,
    isError,
    error,
    refetch 
  } = useQuery<HealthStatus>({
    queryKey: ['/api/admin/health'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/health');
      return await res.json();
    },
    retry: 1,
  });

  return (
    <Card className="w-full max-w-md mx-auto border-foreground/10">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="h-5 w-5 text-primary">⚡</div>
          نظام التحقق من سلامة الخادم
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          حالة الاتصال بالخدمات الخلفية
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center p-4 bg-destructive/10 rounded-md border border-destructive/20">
            <p className="text-destructive font-medium">خطأ في الاتصال</p>
            <p className="text-sm text-muted-foreground mt-1">{(error as Error)?.message || 'فشل الاتصال بالخادم'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">حالة الخادم:</span>
              <Badge variant={healthStatus?.status === 'ok' ? 'default' : 'destructive'}>
                {healthStatus?.status === 'ok' ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Firebase:</span>
              <Badge variant={healthStatus?.services.firebase === 'healthy' ? 'default' : 'destructive'}>
                {healthStatus?.services.firebase === 'healthy' ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">البيئة:</span>
              <Badge variant="outline">{healthStatus?.env}</Badge>
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>آخر تحديث:</span>
              <span>{new Date(healthStatus?.timestamp || '').toLocaleTimeString('ar-EG')}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/20 flex justify-center">
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              جاري التحقق...
            </>
          ) : (
            'تحديث حالة الخادم'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}