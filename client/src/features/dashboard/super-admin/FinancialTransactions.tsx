import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Download, Calendar, Filter, CreditCard, RefreshCw } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Transaction {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyAdminId: string;
  customerId: string;
  totalAmount: number;
  platformFee: number; // 10% المنصة
  propertyOwnerAmount: number; // 90% لمشرف العقار
  timestamp: Timestamp;
  status: string;
  paymentMethod: string;
  stripePaymentIntentId?: string;
  propertyName?: string;
  customerName?: string;
}

interface Stats {
  totalRevenue: number;
  platformRevenue: number;
  propertyOwnersRevenue: number;
  transactionCount: number;
  pendingPayouts: number;
}

export default function FinancialTransactions() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [transactionType, setTransactionType] = useState<'all' | 'platform' | 'payout'>('all');
  
  // استعلام لجلب المعاملات المالية
  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['financial-transactions', period, transactionType],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        let q = query(
          collection(db, 'transactions'),
          orderBy('timestamp', 'desc')
        );
        
        // إضافة فلتر بناءً على الفترة المحددة
        if (period !== 'all') {
          let startDate: Date;
          const now = new Date();
          
          switch (period) {
            case 'today':
              startDate = new Date(now.setHours(0, 0, 0, 0));
              break;
            case 'week':
              startDate = subDays(now, 7);
              break;
            case 'month':
              startDate = subDays(now, 30);
              break;
            default:
              startDate = subDays(now, 7);
          }
          
          q = query(q, where('timestamp', '>=', Timestamp.fromDate(startDate)));
        }
        
        // إضافة فلتر بناءً على نوع المعاملة
        if (transactionType === 'platform') {
          // معاملات خاصة بالمنصة فقط (العمولات)
          // في هذه الحالة نحضر كل المعاملات لأن كل معاملة تتضمن عمولة المنصة
        } else if (transactionType === 'payout') {
          // معاملات خاصة بالمدفوعات للملاك
          // في هذه الحالة نحضر المعاملات المدفوعة للملاك
          q = query(q, where('payoutStatus', '==', 'completed'));
        }
        
        const querySnapshot = await getDocs(q);
        
        const transactionsData: Transaction[] = [];
        querySnapshot.forEach(doc => {
          transactionsData.push({
            id: doc.id,
            ...doc.data()
          } as Transaction);
        });
        
        return transactionsData;
      } catch (error) {
        console.error('Error fetching financial transactions:', error);
        throw error;
      }
    }
  });
  
  // حساب الإحصائيات
  const stats: Stats = transactions.reduce((acc, transaction) => {
    return {
      totalRevenue: acc.totalRevenue + transaction.totalAmount,
      platformRevenue: acc.platformRevenue + transaction.platformFee,
      propertyOwnersRevenue: acc.propertyOwnersRevenue + transaction.propertyOwnerAmount,
      transactionCount: acc.transactionCount + 1,
      pendingPayouts: acc.pendingPayouts + (transaction.status === 'pending' ? 1 : 0)
    };
  }, {
    totalRevenue: 0,
    platformRevenue: 0,
    propertyOwnersRevenue: 0,
    transactionCount: 0,
    pendingPayouts: 0
  });
  
  // استخراج فقط المعاملات الخاصة بالمنصة (عمولات المنصة)
  const platformTransactions = transactions.map(t => ({
    id: t.id,
    bookingId: t.bookingId,
    propertyName: t.propertyName || 'عقار غير معروف',
    customerName: t.customerName || 'عميل غير معروف',
    amount: t.platformFee,
    percentage: '10%',
    date: t.timestamp instanceof Timestamp ? t.timestamp.toDate() : new Date(t.timestamp),
    status: t.status
  }));
  
  // استخراج فقط المعاملات الخاصة بملاك العقارات
  const ownerTransactions = transactions.map(t => ({
    id: t.id,
    bookingId: t.bookingId,
    propertyId: t.propertyId,
    propertyAdminId: t.propertyAdminId,
    propertyName: t.propertyName || 'عقار غير معروف',
    amount: t.propertyOwnerAmount,
    percentage: '90%',
    date: t.timestamp instanceof Timestamp ? t.timestamp.toDate() : new Date(t.timestamp),
    status: t.status
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'dd MMMM yyyy', { locale: ar });
  };
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value as 'today' | 'week' | 'month' | 'all');
  };
  
  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value as 'all' | 'platform' | 'payout');
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const handleExportCSV = () => {
    // تحويل البيانات إلى تنسيق CSV
    const headers = ['رقم المعاملة', 'رقم الحجز', 'العقار', 'العميل', 'المبلغ الإجمالي', 'عمولة المنصة (10%)', 'مبلغ المالك (90%)', 'التاريخ', 'الحالة'];
    
    const csvData = transactions.map(t => [
      t.id,
      t.bookingId,
      t.propertyName || 'عقار غير معروف',
      t.customerName || 'عميل غير معروف',
      t.totalAmount,
      t.platformFee,
      t.propertyOwnerAmount,
      t.timestamp instanceof Timestamp ? formatDate(t.timestamp.toDate()) : formatDate(new Date(t.timestamp)),
      t.status
    ]);
    
    // إنشاء محتوى CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // إنشاء ملف CSV وتنزيله
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `المعاملات_المالية_${formatDate(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">المعاملات المالية</h2>
          <p className="text-gray-400 mt-1">عرض ومراقبة جميع المعاملات المالية في النظام</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 gap-2 text-[#39FF14] border-[#39FF14]/20 hover:border-[#39FF14]/40 hover:bg-[#39FF14]/5" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span>تحديث</span>
          </Button>
          
          <Button className="h-10 gap-2 bg-[#39FF14] text-black hover:bg-[#39FF14]/90" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            <span>تصدير CSV</span>
          </Button>
        </div>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/60 border-[#39FF14]/20 hover:border-[#39FF14]/40 transition-colors text-white shadow-lg hover:shadow-[#39FF14]/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">الإيرادات الإجمالية</p>
                <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-[#39FF14]" />
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              من إجمالي {stats.transactionCount} معاملة
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/60 border-[#39FF14]/20 hover:border-[#39FF14]/40 transition-colors text-white shadow-lg hover:shadow-[#39FF14]/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">إيرادات المنصة (10%)</p>
                <h3 className="text-3xl font-bold text-[#39FF14] mt-1">{formatCurrency(stats.platformRevenue)}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.174l.975-.982-.982-.975-2.232.192L6 3.592l-1.826.14L4.042 0 0 4.043l3.731-.129L5.169 6l-1.193.194.975.982-.982.975 2.232-.192L6 10.408l1.826-.14.132 3.731L12 10.957l-3.731.129-1.438-2.085 1.193-.194z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              بنسبة 10% من الإيرادات الإجمالية
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/60 border-[#39FF14]/20 hover:border-[#39FF14]/40 transition-colors text-white shadow-lg hover:shadow-[#39FF14]/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">إيرادات الملاك (90%)</p>
                <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(stats.propertyOwnersRevenue)}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              بنسبة 90% من الإيرادات الإجمالية
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/60 border-[#39FF14]/20 hover:border-[#39FF14]/40 transition-colors text-white shadow-lg hover:shadow-[#39FF14]/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-400">المدفوعات المعلقة</p>
                <h3 className="text-3xl font-bold text-white mt-1">{stats.pendingPayouts}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-400">
              بانتظار التحويل للملاك
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* فلاتر */}
      <div className="flex flex-wrap gap-4 items-center bg-black/40 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#39FF14]" />
          <span className="text-sm text-gray-400">فلترة حسب:</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select defaultValue={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="h-9 w-[180px] bg-black border-gray-800 text-white focus:ring-[#39FF14]/20">
              <Calendar className="h-4 w-4 text-[#39FF14] mr-2" />
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-800 text-white">
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">آخر 7 أيام</SelectItem>
              <SelectItem value="month">آخر 30 يوم</SelectItem>
              <SelectItem value="all">جميع الفترات</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={transactionType} onValueChange={handleTransactionTypeChange}>
            <SelectTrigger className="h-9 w-[180px] bg-black border-gray-800 text-white focus:ring-[#39FF14]/20">
              <CreditCard className="h-4 w-4 text-[#39FF14] mr-2" />
              <SelectValue placeholder="نوع المعاملة" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-800 text-white">
              <SelectItem value="all">جميع المعاملات</SelectItem>
              <SelectItem value="platform">عمولات المنصة</SelectItem>
              <SelectItem value="payout">مدفوعات الملاك</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* علامات التبويب للمعاملات */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-black/40 border border-gray-800 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] text-gray-400 hover:text-white">
            جميع المعاملات
          </TabsTrigger>
          <TabsTrigger value="platform" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] text-gray-400 hover:text-white">
            عمولات المنصة (10%)
          </TabsTrigger>
          <TabsTrigger value="owners" className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] text-gray-400 hover:text-white">
            مدفوعات الملاك (90%)
          </TabsTrigger>
        </TabsList>
        
        {/* جميع المعاملات */}
        <TabsContent value="all">
          <Card className="bg-black border-[#39FF14]/20 text-white">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle>جميع المعاملات المالية</CardTitle>
              <CardDescription className="text-gray-400">
                عرض تفاصيل جميع المعاملات المالية في النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-[#39FF14]">رقم المعاملة</TableHead>
                      <TableHead className="text-[#39FF14]">العقار</TableHead>
                      <TableHead className="text-[#39FF14]">العميل</TableHead>
                      <TableHead className="text-[#39FF14]">المبلغ الإجمالي</TableHead>
                      <TableHead className="text-[#39FF14]">عمولة المنصة (10%)</TableHead>
                      <TableHead className="text-[#39FF14]">مبلغ المالك (90%)</TableHead>
                      <TableHead className="text-[#39FF14]">التاريخ</TableHead>
                      <TableHead className="text-[#39FF14]">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-[#39FF14]/20 border-t-[#39FF14] animate-spin"></div>
                          </div>
                          <div className="mt-2 text-gray-400">جاري تحميل البيانات...</div>
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="text-gray-400">لا توجد معاملات مالية للعرض</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                          <TableCell className="font-mono text-xs">{transaction.id.substring(0, 8)}...</TableCell>
                          <TableCell>{transaction.propertyName || 'عقار غير معروف'}</TableCell>
                          <TableCell>{transaction.customerName || 'عميل غير معروف'}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(transaction.totalAmount)}</TableCell>
                          <TableCell className="text-[#39FF14]">{formatCurrency(transaction.platformFee)}</TableCell>
                          <TableCell>{formatCurrency(transaction.propertyOwnerAmount)}</TableCell>
                          <TableCell>
                            {transaction.timestamp instanceof Timestamp
                              ? formatDate(transaction.timestamp.toDate())
                              : formatDate(new Date(transaction.timestamp))}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              transaction.status === 'completed' 
                                ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                : transaction.status === 'pending' 
                                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            }>
                              {transaction.status === 'completed' ? 'مكتمل' : 
                               transaction.status === 'pending' ? 'معلق' : 'ملغي'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* عمولات المنصة */}
        <TabsContent value="platform">
          <Card className="bg-black border-[#39FF14]/20 text-white">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle>عمولات المنصة (10%)</CardTitle>
              <CardDescription className="text-gray-400">
                عرض تفاصيل إيرادات المنصة من عمولات الحجوزات
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-[#39FF14]">رقم المعاملة</TableHead>
                      <TableHead className="text-[#39FF14]">العقار</TableHead>
                      <TableHead className="text-[#39FF14]">العميل</TableHead>
                      <TableHead className="text-[#39FF14]">عمولة المنصة</TableHead>
                      <TableHead className="text-[#39FF14]">النسبة</TableHead>
                      <TableHead className="text-[#39FF14]">التاريخ</TableHead>
                      <TableHead className="text-[#39FF14]">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-[#39FF14]/20 border-t-[#39FF14] animate-spin"></div>
                          </div>
                          <div className="mt-2 text-gray-400">جاري تحميل البيانات...</div>
                        </TableCell>
                      </TableRow>
                    ) : platformTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-400">لا توجد معاملات للعرض</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      platformTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                          <TableCell className="font-mono text-xs">{transaction.id.substring(0, 8)}...</TableCell>
                          <TableCell>{transaction.propertyName}</TableCell>
                          <TableCell>{transaction.customerName}</TableCell>
                          <TableCell className="font-bold text-[#39FF14]">{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>{transaction.percentage}</TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>
                            <Badge className={
                              transaction.status === 'completed' 
                                ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                : transaction.status === 'pending' 
                                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            }>
                              {transaction.status === 'completed' ? 'مكتمل' : 
                               transaction.status === 'pending' ? 'معلق' : 'ملغي'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* مدفوعات الملاك */}
        <TabsContent value="owners">
          <Card className="bg-black border-[#39FF14]/20 text-white">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle>مدفوعات ملاك العقارات (90%)</CardTitle>
              <CardDescription className="text-gray-400">
                عرض تفاصيل المدفوعات المستحقة لملاك العقارات
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-900">
                    <TableRow>
                      <TableHead className="text-[#39FF14]">رقم المعاملة</TableHead>
                      <TableHead className="text-[#39FF14]">معرف المالك</TableHead>
                      <TableHead className="text-[#39FF14]">العقار</TableHead>
                      <TableHead className="text-[#39FF14]">المبلغ المستحق</TableHead>
                      <TableHead className="text-[#39FF14]">النسبة</TableHead>
                      <TableHead className="text-[#39FF14]">التاريخ</TableHead>
                      <TableHead className="text-[#39FF14]">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-[#39FF14]/20 border-t-[#39FF14] animate-spin"></div>
                          </div>
                          <div className="mt-2 text-gray-400">جاري تحميل البيانات...</div>
                        </TableCell>
                      </TableRow>
                    ) : ownerTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="text-gray-400">لا توجد معاملات للعرض</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ownerTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                          <TableCell className="font-mono text-xs">{transaction.id.substring(0, 8)}...</TableCell>
                          <TableCell className="font-mono text-xs">{transaction.propertyAdminId.substring(0, 8)}...</TableCell>
                          <TableCell>{transaction.propertyName}</TableCell>
                          <TableCell className="font-bold">{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>{transaction.percentage}</TableCell>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>
                            <Badge className={
                              transaction.status === 'completed' 
                                ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                                : transaction.status === 'pending' 
                                ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
                                : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            }>
                              {transaction.status === 'completed' ? 'مكتمل' : 
                               transaction.status === 'pending' ? 'معلق' : 'ملغي'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}