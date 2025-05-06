import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FaUsers, 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar,
  FaSpinner,
  FaMapMarkerAlt,
  FaBed,
  FaUser,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaClipboardList,
  FaCocktail,
  FaGlassCheers,
  FaHotel,
  FaCog
} from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserRole } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import ServicesControl from "./ServicesControl";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeletePropertyDialogOpen, setIsDeletePropertyDialogOpen] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [promoteUserInput, setPromoteUserInput] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  
  // Fetch all users
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    enabled: !!db
  });
  
  // Fetch all properties
  const { data: properties = [], isLoading: propertiesLoading, refetch: refetchProperties } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        const propertiesSnapshot = await getDocs(collection(db, "properties"));
        return propertiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
    },
    enabled: !!db
  });
  
  // Fetch recent bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        const q = query(
          collection(db, "bookings"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const bookingsSnapshot = await getDocs(q);
        return bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    },
    enabled: !!db
  });
  
  // Function to update user role
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!db) return;
    
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      
      toast({
        title: "تم تحديث صلاحيات المستخدم",
        description: "تم تحديث صلاحيات المستخدم بنجاح.",
        variant: "default",
      });
      
      // Refresh users list
      refetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في تحديث صلاحيات المستخدم.",
        variant: "destructive",
      });
    }
  };
  
  // Function to delete user
  const handleDeleteUser = async (userId: string) => {
    if (!db) return;
    
    try {
      // Delete user document
      await deleteDoc(doc(db, "users", userId));
      
      // You would also delete the user from Firebase Auth in a real implementation
      
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح.",
        variant: "default",
      });
      
      // Refresh users list
      refetchUsers();
      setIsDeleteUserDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حذف المستخدم.",
        variant: "destructive",
      });
    }
  };
  
  // Function to toggle property featured status
  const handleToggleFeatured = async (propertyId: string, isFeatured: boolean) => {
    if (!db) return;
    
    try {
      const propertyRef = doc(db, "properties", propertyId);
      await updateDoc(propertyRef, { featured: !isFeatured });
      
      toast({
        title: isFeatured ? "تم إزالة العقار من المميز" : "تم إضافة العقار للمميز",
        description: "تم تحديث حالة العقار بنجاح.",
        variant: "default",
      });
      
      // Refresh properties list
      refetchProperties();
    } catch (error) {
      console.error("Error updating property featured status:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في تحديث حالة العقار.",
        variant: "destructive",
      });
    }
  };
  
  // Function to delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (!db) return;
    
    try {
      // Delete property document
      await deleteDoc(doc(db, "properties", propertyId));
      
      // In a real application, you might also need to:
      // 1. Delete related bookings
      // 2. Delete related reviews
      // 3. Delete image files from storage
      
      toast({
        title: "تم حذف العقار",
        description: "تم حذف العقار بنجاح.",
        variant: "default",
      });
      
      // Refresh properties list
      refetchProperties();
      setIsDeletePropertyDialogOpen(false);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "حدث خطأ",
        description: "فشل في حذف العقار.",
        variant: "destructive",
      });
    }
  };
  
  // تحويل البيانات من Firestore إلى النموذج المناسب
  // واستخدام التحويل الآمن مع التحقق من وجود الخصائص
  const safeUsers = users.map(u => ({
    ...u,
    role: (u as any).role || UserRole.CUSTOMER
  }));
  
  const safeBookings = bookings.map(b => ({
    ...b,
    status: (b as any).status || "pending",
    totalPrice: (b as any).totalPrice || 0
  }));
  
  const safeProperties = properties.map(p => ({
    ...p,
    featured: (p as any).featured || false
  }));
  
  // Calculate statistics
  const statistics = {
    totalUsers: users.length,
    totalProperties: properties.length,
    totalBookings: bookings.length,
    customerCount: safeUsers.filter(u => u.role === UserRole.CUSTOMER).length,
    propertyAdminCount: safeUsers.filter(u => u.role === UserRole.PROPERTY_ADMIN).length,
    superAdminCount: safeUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length,
    activeBookings: safeBookings.filter(b => b.status === "confirmed").length,
    pendingBookings: safeBookings.filter(b => b.status === "pending").length,
    cancelledBookings: safeBookings.filter(b => b.status === "cancelled").length,
    featuredProperties: safeProperties.filter(p => p.featured).length,
    totalRevenue: safeBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Neon Effect */}
        <h1 className="text-4xl font-bold text-[#39FF14] mb-6 relative inline-block">
          لوحة تحكم المدير العام
          <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0 h-auto">
            <TabsTrigger 
              value="dashboard" 
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              المستخدمين
            </TabsTrigger>
            <TabsTrigger 
              value="properties"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              العقارات
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الحجوزات
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الخدمات
            </TabsTrigger>
            <TabsTrigger 
              value="revenue"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الإيرادات
            </TabsTrigger>
            <TabsTrigger 
              value="issues"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              المشكلات
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الإعدادات
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Users Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">المستخدمين</CardTitle>
                  <FaUsers className="h-4 w-4 text-[#39FF14]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{statistics.totalUsers}</div>
                  <div className="text-xs text-gray-400 mt-1">إجمالي المستخدمين</div>
                </CardContent>
              </Card>
              
              {/* Properties Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">العقارات</CardTitle>
                  <FaBuilding className="h-4 w-4 text-[#39FF14]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{statistics.totalProperties}</div>
                  <div className="text-xs text-gray-400 mt-1">إجمالي العقارات</div>
                </CardContent>
              </Card>
              
              {/* Bookings Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">الحجوزات</CardTitle>
                  <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{statistics.totalBookings}</div>
                  <div className="text-xs text-gray-400 mt-1">إجمالي الحجوزات</div>
                </CardContent>
              </Card>
              
              {/* Revenue Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">الإيرادات</CardTitle>
                  <FaChartBar className="h-4 w-4 text-[#39FF14]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">${statistics.totalRevenue}</div>
                  <div className="text-xs text-gray-400 mt-1">إجمالي الإيرادات</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Users by Role */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-[#39FF14] mb-4">المستخدمين حسب الصلاحيات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>العملاء</span>
                    </div>
                    <span className="font-semibold">{statistics.customerCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>مدراء العقارات</span>
                    </div>
                    <span className="font-semibold">{statistics.propertyAdminCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>المدراء العامين</span>
                    </div>
                    <span className="font-semibold">{statistics.superAdminCount}</span>
                  </div>
                </div>
              </div>
              
              {/* Bookings by Status */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-xl font-bold text-[#39FF14] mb-4">الحجوزات حسب الحالة</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>المؤكدة</span>
                    </div>
                    <span className="font-semibold">{statistics.activeBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>قيد الانتظار</span>
                    </div>
                    <span className="font-semibold">{statistics.pendingBookings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>الملغاة</span>
                    </div>
                    <span className="font-semibold">{statistics.cancelledBookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#39FF14]">إدارة المستخدمين</h2>
                
                <div className="flex gap-2">
                  <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
                    إضافة مستخدم جديد
                  </Button>
                </div>
              </div>
              
              {usersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                    <span className="text-gray-400">جاري تحميل المستخدمين...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <FaUsers className="h-10 w-10 text-[#39FF14]/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا يوجد مستخدمين</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">لا يوجد مستخدمين في النظام حتى الآن.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">المستخدم</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الصلاحية</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">تاريخ التسجيل</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden mr-3 flex items-center justify-center">
                                {user.profileImage ? (
                                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <FaUser className="text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.id.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={
                              user.role === UserRole.SUPER_ADMIN ? "bg-purple-500" :
                              user.role === UserRole.PROPERTY_ADMIN ? "bg-blue-500" :
                              "bg-green-500"
                            }>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "غير معروف"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-[#39FF14] hover:text-[#50FF30] hover:bg-transparent">
                                    <FaEdit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-[#39FF14]">تغيير صلاحيات المستخدم</DialogTitle>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <div className="mb-4">
                                      <p className="text-gray-400 mb-2">المستخدم: {user.name}</p>
                                      <p className="text-gray-400 mb-2">البريد الإلكتروني: {user.email}</p>
                                    </div>
                                    <div className="space-y-3">
                                      <Button
                                        className={`w-full ${user.role === UserRole.CUSTOMER ? 'bg-green-600' : 'bg-gray-700'} hover:bg-green-700`}
                                        onClick={() => handleRoleChange(user.id, UserRole.CUSTOMER)}
                                      >
                                        عميل
                                      </Button>
                                      <Button
                                        className={`w-full ${user.role === UserRole.PROPERTY_ADMIN ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                                        onClick={() => handleRoleChange(user.id, UserRole.PROPERTY_ADMIN)}
                                      >
                                        مدير عقارات
                                      </Button>
                                      <Button
                                        className={`w-full ${user.role === UserRole.SUPER_ADMIN ? 'bg-purple-600' : 'bg-gray-700'} hover:bg-purple-700`}
                                        onClick={() => handleRoleChange(user.id, UserRole.SUPER_ADMIN)}
                                      >
                                        مدير عام
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600 hover:bg-transparent"
                                onClick={() => {
                                  setDeleteUserId(user.id);
                                  setIsDeleteUserDialogOpen(true);
                                }}
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Properties Tab */}
          <TabsContent value="properties" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#39FF14]">إدارة العقارات</h2>
                
                <div className="flex gap-2">
                  <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
                    إضافة عقار جديد
                  </Button>
                </div>
              </div>
              
              {propertiesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                    <span className="text-gray-400">جاري تحميل العقارات...</span>
                  </div>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <FaBuilding className="h-10 w-10 text-[#39FF14]/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد عقارات</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">لا توجد عقارات في النظام حتى الآن.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">العقار</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الموقع</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">السعر / ليلة</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">المالك</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property: any) => (
                        <tr key={property.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md bg-gray-700 overflow-hidden mr-3">
                                {property.imageUrl ? (
                                  <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FaBuilding className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="font-medium">{property.name}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="text-[#39FF14] mr-1 h-3 w-3" />
                              <span>{property.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">${property.price}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden mr-2 flex items-center justify-center">
                                <FaUser className="text-gray-500 h-3 w-3" />
                              </div>
                              <span>{property.ownerName || "غير معروف"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {property.featured ? (
                              <Badge className="bg-yellow-500">مميز</Badge>
                            ) : (
                              <Badge className="bg-gray-500">عادي</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={property.featured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-300"}
                                onClick={() => handleToggleFeatured(property.id, property.featured)}
                                title={property.featured ? "إزالة من المميز" : "إضافة للمميز"}
                              >
                                {property.featured ? <FaArrowDown className="h-4 w-4" /> : <FaArrowUp className="h-4 w-4" />}
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#39FF14] hover:text-[#50FF30] hover:bg-transparent"
                                title="تعديل العقار"
                              >
                                <FaEdit className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600 hover:bg-transparent"
                                onClick={() => {
                                  setDeletePropertyId(property.id);
                                  setIsDeletePropertyDialogOpen(true);
                                }}
                                title="حذف العقار"
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#39FF14]">إدارة الحجوزات</h2>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    تصدير البيانات
                  </Button>
                </div>
              </div>
              
              {bookingsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                    <span className="text-gray-400">جاري تحميل الحجوزات...</span>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <FaCalendarAlt className="h-10 w-10 text-[#39FF14]/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد حجوزات</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">لا توجد حجوزات في النظام حتى الآن.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">رقم الحجز</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">العقار</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">العميل</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">تاريخ الوصول</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">المبلغ</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4 font-mono text-sm">
                            {booking.id?.substring(0, 8) || "غير معروف"}
                          </td>
                          <td className="py-3 px-4">
                            {booking.propertyName || "عقار غير معروف"}
                          </td>
                          <td className="py-3 px-4">
                            {booking.customerName || "عميل غير معروف"}
                          </td>
                          <td className="py-3 px-4">
                            {booking.checkInDate?.toDate ? 
                              new Date(booking.checkInDate.toDate()).toLocaleDateString() : 
                              "غير معروف"}
                          </td>
                          <td className="py-3 px-4">${booking.totalPrice || 0}</td>
                          <td className="py-3 px-4">
                            {booking.status === "confirmed" ? (
                              <Badge className="bg-green-500">مؤكد</Badge>
                            ) : booking.status === "pending" ? (
                              <Badge className="bg-yellow-500">قيد الانتظار</Badge>
                            ) : (
                              <Badge className="bg-red-500">ملغي</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#39FF14] hover:text-[#50FF30] hover:bg-transparent"
                                title="تفاصيل الحجز"
                              >
                                <FaClipboardList className="h-4 w-4" />
                              </Button>
                              
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-500 hover:text-green-600 hover:bg-transparent"
                                    title="تأكيد الحجز"
                                  >
                                    <FaCheck className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-transparent"
                                    title="إلغاء الحجز"
                                  >
                                    <FaTimes className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Services Tab */}
          <TabsContent value="services" className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center mb-4">
                <FaGlassCheers className="text-[#39FF14] mr-2" />
                <h2 className="text-xl font-bold text-white">خدمات المطاعم والنوادي الليلية</h2>
              </div>
              
              {/* تحقق من وجود قاعدة البيانات قبل تحميل مكون التحكم في الخدمات */}
              {db ? (
                <ServicesControl />
              ) : (
                <Card className="w-full bg-gray-950 border-gray-800 p-6">
                  <div className="text-center py-8">
                    <div className="flex justify-center mb-3">
                      <FaSpinner className="h-8 w-8 text-[#39FF14] animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">جاري الاتصال بقاعدة البيانات</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      يرجى الانتظار حتى يتم الاتصال بـ Firebase Firestore...
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue" className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center mb-4">
                <FaChartBar className="text-[#39FF14] mr-2" />
                <h2 className="text-xl font-bold text-white">تقارير الإيرادات</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Revenue Card */}
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">الإيرادات الشهرية</CardTitle>
                    <FaChartBar className="h-4 w-4 text-[#39FF14]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#39FF14]">${statistics.totalRevenue}</div>
                    <div className="text-xs text-gray-400 mt-1">صيف 2025</div>
                    <div className="flex items-center mt-4 text-green-500">
                      <FaArrowUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">نسبة النمو 12% مقارنة بالسنة الماضية</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Booking Revenue Card */}
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">إيرادات الحجوزات</CardTitle>
                    <FaHotel className="h-4 w-4 text-[#39FF14]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#39FF14]">${statistics.totalRevenue * 0.7}</div>
                    <div className="text-xs text-gray-400 mt-1">70% من إجمالي الإيرادات</div>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-[#39FF14] h-full" style={{ width: '70%' }}></div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Services Revenue Card */}
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">إيرادات الخدمات</CardTitle>
                    <FaCocktail className="h-4 w-4 text-[#39FF14]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#39FF14]">${statistics.totalRevenue * 0.3}</div>
                    <div className="text-xs text-gray-400 mt-1">30% من إجمالي الإيرادات</div>
                    <div className="w-full bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-[#39FF14] h-full" style={{ width: '30%' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Revenue Chart */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">تفاصيل الإيرادات الشهرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center border border-gray-800 rounded-lg">
                    <div className="text-center">
                      <FaChartBar className="h-16 w-16 text-[#39FF14] opacity-30 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400">رسم بياني تفاعلي للإيرادات</h3>
                      <p className="text-gray-500 max-w-md mt-2">
                        سيتم عرض الرسم البياني هنا عند توفر بيانات كافية. يمكنك تتبع نمو الإيرادات عبر الزمن.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Earning Properties */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">أكثر العقارات تحقيقًا للإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  {properties.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="flex justify-center mb-3">
                        <FaHotel className="h-10 w-10 text-gray-700" />
                      </div>
                      <p className="text-gray-500">لا توجد بيانات عقارات متاحة حاليًا</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.slice(0, 5).map((property: any, index: number) => (
                        <div key={property.id} className="flex items-center justify-between border-b border-gray-800 pb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-[#39FF14]/10 text-[#39FF14] font-bold rounded-full mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{property.name}</h4>
                              <p className="text-sm text-gray-500">{property.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${(property.pricePerNight || 0) * 30}</div>
                            <div className="text-xs text-green-500">معدل الإشغال 85%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Issues Tab */}
          <TabsContent value="issues" className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center mb-4">
                <FaClipboardList className="text-[#39FF14] mr-2" />
                <h2 className="text-xl font-bold text-white">متابعة المشكلات والبلاغات</h2>
              </div>
              
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">المشكلات الحالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FaClipboardList className="h-16 w-16 text-[#39FF14] opacity-30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400">لا توجد مشكلات مبلغ عنها حاليًا</h3>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                      سيتم عرض المشكلات المبلغ عنها هنا عندما يقوم المستخدمون بإرسال بلاغات.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 flex items-center mb-2">
                <FaCog className="text-[#39FF14] mr-2" />
                <h2 className="text-xl font-bold text-white">إعدادات النظام</h2>
              </div>
              
              {/* Theme Settings */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">إعدادات السمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">لون السمة الرئيسي</h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14] border-2 border-white cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
                        <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">الوضع</h3>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                          <input type="radio" id="dark-mode" name="theme-mode" className="w-4 h-4" checked />
                          <label htmlFor="dark-mode">داكن</label>
                        </div>
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                          <input type="radio" id="light-mode" name="theme-mode" className="w-4 h-4" />
                          <label htmlFor="light-mode">فاتح</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">الشعار</h3>
                      <Button variant="outline" size="sm">تغيير الشعار</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* User Permissions */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">إعدادات الصلاحيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">ترقية العميل إلى مدير عقارات</h3>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <input
                          type="text"
                          placeholder="معرف المستخدم أو البريد الإلكتروني"
                          className="px-3 py-1.5 flex-1 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14]"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10"
                        >
                          ترقية
                        </Button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">صلاحيات المشرفين</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="approve-properties">الموافقة على العقارات الجديدة</label>
                          <input type="checkbox" id="approve-properties" className="w-4 h-4" checked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="manage-users">إدارة المستخدمين</label>
                          <input type="checkbox" id="manage-users" className="w-4 h-4" checked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="view-revenue">عرض تقارير الإيرادات</label>
                          <input type="checkbox" id="view-revenue" className="w-4 h-4" checked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* System Settings */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">إعدادات النظام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">اللغة الافتراضية</h3>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                        <option value="ar">العربية</option>
                        <option value="en">الإنجليزية</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">العملة</h3>
                      <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white">
                        <option value="usd">دولار أمريكي ($)</option>
                        <option value="eur">يورو (€)</option>
                        <option value="egp">جنيه مصري (ج.م)</option>
                      </select>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">الإشعارات</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="notification-bookings">إشعارات الحجوزات الجديدة</label>
                          <input type="checkbox" id="notification-bookings" className="w-4 h-4" checked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="notification-issues">إشعارات المشكلات</label>
                          <input type="checkbox" id="notification-issues" className="w-4 h-4" checked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#39FF14]">تأكيد حذف المستخدم</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              نعم، احذف المستخدم
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Property Confirmation Dialog */}
      <AlertDialog open={isDeletePropertyDialogOpen} onOpenChange={setIsDeletePropertyDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#39FF14]">تأكيد حذف العقار</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              هل أنت متأكد من أنك تريد حذف هذا العقار؟ سيتم حذف جميع الحجوزات المرتبطة به. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePropertyId && handleDeleteProperty(deletePropertyId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              نعم، احذف العقار
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}