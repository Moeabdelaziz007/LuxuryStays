import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
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
import { queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PropertyForm from "./PropertyForm";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  imageUrl: string;
  beds: number;
  baths: number;
  size: number;
  featured: boolean;
  adminId: number;
  ownerId: string;
}

export default function PropertyManagement() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);

  // Fetch properties owned by the current user
  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["owner-properties", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        const q = query(collection(db, "properties"), where("ownerId", "==", user?.uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
    },
    enabled: !!user && !!db
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً");
      await deleteDoc(doc(db, "properties", propertyId));
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-properties"] });
      setIsDeleteDialogOpen(false);
    }
  });

  // Handle delete property
  const handleDeleteProperty = (propertyId: string) => {
    setDeletePropertyId(propertyId);
    setIsDeleteDialogOpen(true);
  };

  // Handle edit property
  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsEditDialogOpen(true);
  };

  // Handle add property dialog close
  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedProperty(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center text-[#39FF14]">
          <FaSpinner className="animate-spin h-10 w-10 mb-4" />
          <span>جاري تحميل العقارات...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-900/20 text-red-500 border border-red-500 rounded-lg p-4 my-6">
        <p>حدث خطأ أثناء تحميل العقارات. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#39FF14]">إدارة العقارات</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <FaPlus size={14} />
          إضافة عقار جديد
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#39FF14]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">لا توجد عقارات حتى الآن</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            لم تقم بإضافة أي عقارات حتى الآن. قم بإضافة أول عقار لتبدأ في استقبال الحجوزات.
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium rounded-lg px-6 py-2.5 flex items-center gap-2"
          >
            <FaPlus size={14} />
            إضافة أول عقار
          </Button>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-[#39FF14]/30 transition-colors group">
                <div className="relative h-48 overflow-hidden">
                  {property.imageUrl ? (
                    <img 
                      src={property.imageUrl} 
                      alt={property.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">لا توجد صورة</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-[#39FF14] text-black px-3 py-1 rounded-full text-sm font-bold">
                    ${property.price} / ليلة
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#39FF14] mb-1">{property.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">📍 {property.location}</p>
                  
                  <div className="flex gap-2 text-sm text-gray-400 mb-3">
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {property.beds} أسرة
                    </span>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {property.baths} حمام
                    </span>
                    <span className="inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {property.size} م²
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {property.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div>
                      {property.featured && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full">
                          عقار مميز
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-2 bg-[#39FF14]/10 text-[#39FF14] rounded-lg hover:bg-[#39FF14]/20 transition-colors"
                        title="تعديل العقار"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="حذف العقار"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Property Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#39FF14]">إضافة عقار جديد</DialogTitle>
            <DialogDescription className="text-gray-400">
              أضف تفاصيل العقار الجديد وصوره لعرضه للحجز.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <PropertyForm onSuccess={handleAddDialogClose} onCancel={handleAddDialogClose} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Property Dialog */}
      {selectedProperty && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#39FF14]">تعديل العقار</DialogTitle>
              <DialogDescription className="text-gray-400">
                قم بتحديث تفاصيل وصور العقار.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <PropertyForm 
                property={selectedProperty} 
                onSuccess={handleEditDialogClose} 
                onCancel={handleEditDialogClose} 
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[#39FF14]">تأكيد حذف العقار</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              هل أنت متأكد من أنك تريد حذف هذا العقار؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePropertyId && deleteMutation.mutate(deletePropertyId)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> جاري الحذف...
                </>
              ) : (
                "نعم، احذف العقار"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}