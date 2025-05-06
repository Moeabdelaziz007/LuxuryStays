import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { resetAndSeedServices } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Utensils, Clock, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// تعريف نوع المواقع الخاص بالخدمات
interface ServiceLocation {
  name: string;
  area: string;
  cuisine?: string;
  priceRange?: string;
  type?: string;
  specialty?: string;
}

// تعريف نوع موسع للخدمات مع دعم الحقول الإضافية التي أضفناها
interface ExtendedService {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  iconClass?: string;
  launchDate?: string | Date;
  createdAt?: string | Date;
  locations?: ServiceLocation[];
  [key: string]: any;
}

export default function ServicesControl() {
  const { toast } = useToast();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all services
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["all-services"],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        const servicesSnapshot = await getDocs(collection(db, "services"));
        return servicesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as ExtendedService[];
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    },
    enabled: !!db
  });

  // Reset and seed services mutation
  const { mutate: resetServices, isPending: isResetting } = useMutation({
    mutationFn: resetAndSeedServices,
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "تم إعادة تعيين الخدمات",
          description: data.message,
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["all-services"] });
        setResetConfirmOpen(false);
      } else {
        toast({
          title: "خطأ",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: `فشل إعادة تعيين الخدمات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    }
  });

  const activeServices = services.filter(service => service.status === "active");
  const comingSoonServices = services.filter(service => service.status === "coming-soon");

  // Group services by category for better visualization
  const getServiceIcon = (service: ExtendedService) => {
    const iconClass = service.iconClass || "";
    
    if (iconClass.includes('utensils')) {
      return <Utensils className="h-5 w-5 text-green-400" />;
    } else if (iconClass.includes('glass') || iconClass.includes('wine')) {
      return <span className="h-5 w-5 text-purple-400">🍹</span>;
    } else if (iconClass.includes('spa')) {
      return <span className="h-5 w-5 text-blue-400">💆</span>;
    } else if (iconClass.includes('ship')) {
      return <span className="h-5 w-5 text-cyan-400">⛵</span>;
    } else {
      return <span className="h-5 w-5 text-gray-400">⭐</span>;
    }
  };

  const renderServicesList = (servicesList: ExtendedService[]) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4 rtl:space-x-reverse">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (servicesList.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="flex justify-center mb-3">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground">لا توجد خدمات في هذه الفئة</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {servicesList.map((service) => (
          <div key={service.id} className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center mb-2">
              {getServiceIcon(service)}
              <h3 className="text-lg font-semibold mr-2">{service.name}</h3>
              {service.status === "coming-soon" && (
                <Badge variant="outline" className="mr-2 border-orange-500 text-orange-500">
                  <Clock className="h-3 w-3 mr-1" /> قريبًا
                </Badge>
              )}
            </div>
            <p className="text-gray-400 mb-3">{service.description}</p>
            
            {service.locations && service.locations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">المواقع:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.locations.map((location: ServiceLocation, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-gray-800">
                      {location.name} - {location.area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full bg-gray-950 border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-white">خدمات StayX</CardTitle>
            <CardDescription>
              إدارة خدمات الحجز للمطاعم والنوادي الليلية والخدمات الأخرى
            </CardDescription>
          </div>
          
          {resetConfirmOpen ? (
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => resetServices()}
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    جاري إعادة التعيين...
                  </>
                ) : (
                  <>تأكيد إعادة التعيين</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setResetConfirmOpen(false)}
                disabled={isResetting}
              >
                إلغاء
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10"
              onClick={() => setResetConfirmOpen(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              إعادة تعيين بيانات الخدمات
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="active" className="data-[state=active]:bg-[#39FF14]/20 data-[state=active]:text-[#39FF14]">
              <CheckCircle className="mr-2 h-4 w-4" />
              الخدمات النشطة ({activeServices.length})
            </TabsTrigger>
            <TabsTrigger value="coming-soon" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              <Clock className="mr-2 h-4 w-4" />
              الخدمات القادمة ({comingSoonServices.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {renderServicesList(activeServices)}
          </TabsContent>
          
          <TabsContent value="coming-soon" className="mt-0">
            {renderServicesList(comingSoonServices)}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 pt-4 text-sm text-gray-400">
        <p>
          إجمالي الخدمات: {services.length} | 
          النشطة: {activeServices.length} | 
          القادمة: {comingSoonServices.length}
        </p>
      </CardFooter>
    </Card>
  );
}