import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookingStatus, UserRole } from '@shared/schema';
import { ApiClient } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useFirestoreStatus } from '@/contexts/FirestoreStatusContext';
import { DatabaseErrorBoundary } from '@/components/DatabaseErrorBoundary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  FileEdit,
  Filter,
  Home,
  MessagesSquare,
  Search,
  Trash2,
  User,
  XCircle,
} from 'lucide-react';

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
  guestCount: number;
  userEmail?: string;
  phoneNumber?: string;
}

interface BookingManagerProps {
  userRole: UserRole;
  userId?: string;
  propertyId?: string;
  showFilters?: boolean;
  limit?: number;
  onBookingSelected?: (booking: Booking) => void;
  showCreateButton?: boolean;
}

const statusLabels = {
  [BookingStatus.PENDING]: {
    label: 'قيد الانتظار',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    icon: <Clock className="w-4 h-4 mr-1" />
  },
  [BookingStatus.CONFIRMED]: {
    label: 'مؤكد',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500',
    icon: <CheckCircle className="w-4 h-4 mr-1" />
  },
  [BookingStatus.CANCELLED]: {
    label: 'ملغي',
    color: 'bg-red-500',
    textColor: 'text-red-500',
    borderColor: 'border-red-500',
    icon: <XCircle className="w-4 h-4 mr-1" />
  }
};

export const BookingManager: React.FC<BookingManagerProps> = ({
  userRole,
  userId,
  propertyId,
  showFilters = true,
  limit = 10,
  onBookingSelected,
  showCreateButton = false
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [formData, setFormData] = useState({
    notes: '',
    status: BookingStatus.PENDING,
  });
  
  const { isConnected } = useFirestoreStatus();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch bookings based on user role and filters
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings', userRole, userId, propertyId, activeTab, dateRange],
    queryFn: async () => {
      let url = '/api/bookings';
      
      const filters: Record<string, string> = {};
      
      if (userRole === UserRole.CUSTOMER && userId) {
        filters.userId = userId;
      } else if (userRole === UserRole.PROPERTY_ADMIN && propertyId) {
        filters.propertyId = propertyId;
      }
      
      if (activeTab !== 'all') {
        filters.status = activeTab;
      }
      
      if (dateRange.from) {
        filters.fromDate = dateRange.from.toISOString();
      }
      
      if (dateRange.to) {
        filters.toDate = dateRange.to.toISOString();
      }
      
      if (limit > 0) {
        filters.limit = String(limit);
      }
      
      const queryParams = new URLSearchParams(filters);
      url += `?${queryParams.toString()}`;
      
      return await ApiClient.get<Booking[]>(url);
    },
    enabled: isConnected,
  });
  
  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async (updatedBooking: Partial<Booking> & { id: string }) => {
      return await ApiClient.patch<Booking>(
        `/api/bookings/${updatedBooking.id}`, 
        updatedBooking
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'تم تحديث الحجز بنجاح',
        description: 'تم تحديث معلومات الحجز بنجاح.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ في تحديث الحجز',
        description: 'لم نتمكن من تحديث معلومات الحجز. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    },
  });
  
  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await ApiClient.delete<void>(`/api/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: 'تم حذف الحجز بنجاح',
        description: 'تم حذف الحجز بنجاح من النظام.',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'خطأ في حذف الحجز',
        description: 'لم نتمكن من حذف الحجز. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle editing a booking
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormData({
      notes: booking.notes || '',
      status: booking.status,
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting a booking
  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle submitting the edit form
  const handleSubmitEdit = () => {
    if (!selectedBooking) return;
    
    updateBookingMutation.mutate({
      id: selectedBooking.id,
      notes: formData.notes,
      status: formData.status,
    });
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (!selectedBooking) return;
    deleteBookingMutation.mutate(selectedBooking.id);
  };
  
  // Handle creating a new booking
  const handleCreateBooking = () => {
    setLocation('/booking/create');
  };
  
  // Filter bookings by search term
  const filteredBookings = bookings?.filter(booking => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.propertyName?.toLowerCase().includes(searchLower) ||
      booking.userName?.toLowerCase().includes(searchLower) ||
      booking.userEmail?.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle booking selection
  const handleBookingClick = (booking: Booking) => {
    if (onBookingSelected) {
      onBookingSelected(booking);
    } else {
      // By default, show booking details
      setSelectedBooking(booking);
      setIsEditDialogOpen(true);
    }
  };
  
  return (
    <DatabaseErrorBoundary>
      <Card className="w-full shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-[#39FF14]">
              إدارة الحجوزات
            </CardTitle>
            {showCreateButton && (
              <Button
                size="sm"
                className="bg-[#39FF14] text-black hover:bg-[#32D111]"
                onClick={handleCreateBooking}
              >
                حجز جديد
              </Button>
            )}
          </div>
          <CardDescription>
            عرض وإدارة حجوزات العقارات
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {showFilters && (
            <div className="space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن حجز..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                  >
                    <Filter className="h-4 w-4" />
                    مسح الفلاتر
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value={BookingStatus.PENDING}>قيد الانتظار</TabsTrigger>
                    <TabsTrigger value={BookingStatus.CONFIRMED}>مؤكد</TabsTrigger>
                    <TabsTrigger value={BookingStatus.CANCELLED}>ملغي</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <Label>تاريخ الوصول</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full sm:w-[240px] justify-start text-left font-normal"
                      onClick={() => document.getElementById('date-picker')?.click()}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        <span>{dateRange.from.toLocaleDateString()}</span>
                      ) : (
                        <span>اختر تاريخ...</span>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Label>تاريخ المغادرة</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="w-full sm:w-[240px] justify-start text-left font-normal"
                      onClick={() => document.getElementById('date-picker')?.click()}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        <span>{dateRange.to.toLocaleDateString()}</span>
                      ) : (
                        <span>اختر تاريخ...</span>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="hidden">
                  <Calendar
                    id="date-picker"
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    numberOfMonths={2}
                  />
                </div>
              </div>
            </div>
          )}
          
          {isLoading ? (
            // Skeleton loading state
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="bg-muted/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-4 border rounded-md bg-red-50 dark:bg-red-950/10 text-red-700 dark:text-red-300">
              <p>حدث خطأ أثناء تحميل الحجوزات.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
              >
                إعادة المحاولة
              </Button>
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="hover:bg-muted/10 transition-colors cursor-pointer"
                  onClick={() => handleBookingClick(booking)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                        <h3 className="font-medium">{booking.propertyName}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={`flex items-center ${statusLabels[booking.status].borderColor} ${statusLabels[booking.status].textColor}`}
                      >
                        {statusLabels[booking.status].icon}
                        {statusLabels[booking.status].label}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {booking.userName}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="col-span-full md:col-span-1 text-left md:text-right font-bold text-[#39FF14]">
                        {booking.totalPrice.toLocaleString()} ريال
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">لا توجد حجوزات متطابقة مع البحث.</p>
            </div>
          )}
        </CardContent>
        
        {userRole !== UserRole.CUSTOMER && (
          <CardFooter className="flex justify-between py-2">
            <Button variant="ghost" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}>
              تحديث
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل معلومات الحجز</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات الحجز
              {selectedBooking && ` #${selectedBooking.id}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>العقار</Label>
                  <p className="text-sm">{selectedBooking.propertyName}</p>
                </div>
                <div className="space-y-1">
                  <Label>العميل</Label>
                  <p className="text-sm">{selectedBooking.userName}</p>
                </div>
                <div className="space-y-1">
                  <Label>تاريخ الوصول</Label>
                  <p className="text-sm">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <Label>تاريخ المغادرة</Label>
                  <p className="text-sm">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>المبلغ الإجمالي</Label>
                  <p className="text-lg font-bold text-[#39FF14]">{selectedBooking.totalPrice.toLocaleString()} ريال</p>
                </div>
              </div>
              
              {userRole !== UserRole.CUSTOMER && (
                <div className="space-y-2">
                  <Label htmlFor="status">حالة الحجز</Label>
                  <select
                    id="status"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                  >
                    <option value={BookingStatus.PENDING}>قيد الانتظار</option>
                    <option value={BookingStatus.CONFIRMED}>مؤكد</option>
                    <option value={BookingStatus.CANCELLED}>ملغي</option>
                  </select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="أضف ملاحظات حول الحجز..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            {userRole !== UserRole.CUSTOMER && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  handleDeleteBooking(selectedBooking!);
                }}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                حذف
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitEdit}
                disabled={updateBookingMutation.isPending}
                className="bg-[#39FF14] text-black hover:bg-[#32D111]"
              >
                {updateBookingMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الحجز؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف الحجز بشكل دائم من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteBookingMutation.isPending ? 'جاري الحذف...' : 'نعم، حذف الحجز'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DatabaseErrorBoundary>
  );
};

export default BookingManager;