import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Download, 
  Filter, 
  Search, 
  ArrowUpDown, 
  DollarSign, 
  CreditCard, 
  Phone, 
  Wallet, 
  Calendar 
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// نوع بيانات المعاملة المالية
interface Transaction {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  platformFee: number; // عمولة المنصة (10%)
  ownerAmount: number; // مبلغ المالك (90%)
  paymentMethod: 'stripe' | 'vodafone_cash' | 'cash_on_arrival';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// دالة مساعدة لتنسيق المبالغ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// دالة مساعدة لتحويل حالة الدفع إلى اللغة العربية
const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'مكتمل';
    case 'pending':
      return 'قيد الانتظار';
    case 'failed':
      return 'فشل';
    case 'refunded':
      return 'تم الاسترداد';
    default:
      return status;
  }
};

// دالة مساعدة لتحويل طريقة الدفع إلى اللغة العربية
const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'stripe':
      return 'بطاقة ائتمان';
    case 'vodafone_cash':
      return 'فودافون كاش';
    case 'cash_on_arrival':
      return 'كاش عند الوصول';
    default:
      return method;
  }
};

// دالة مساعدة لاختيار أيقونة لطريقة الدفع
const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'stripe':
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    case 'vodafone_cash':
      return <Phone className="h-4 w-4 text-red-500" />;
    case 'cash_on_arrival':
      return <Wallet className="h-4 w-4 text-green-500" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

// الألوان المستخدمة في الرسوم البيانية
const CHART_COLORS = ['#39FF14', '#FF3968', '#3980FF', '#FFBD39'];

// مكون الرسوم البيانية للإيرادات
const RevenueCharts = ({ transactions }: { transactions: Transaction[] }) => {
  // تحضير بيانات الإيرادات الشهرية
  const monthlyRevenue = transactions.reduce((acc, transaction) => {
    const date = transaction.createdAt.toDate();
    const monthYear = format(date, 'MMM yyyy', { locale: ar });
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        totalRevenue: 0,
        platformFee: 0,
        ownerAmount: 0,
        count: 0
      };
    }
    
    acc[monthYear].totalRevenue += transaction.amount;
    acc[monthYear].platformFee += transaction.platformFee;
    acc[monthYear].ownerAmount += transaction.ownerAmount;
    acc[monthYear].count += 1;
    
    return acc;
  }, {} as Record<string, any>);
  
  const monthlyData = Object.values(monthlyRevenue);
  
  // تحضير بيانات توزيع طرق الدفع
  const paymentMethodStats = transactions.reduce((acc, transaction) => {
    const method = transaction.paymentMethod;
    
    if (!acc[method]) {
      acc[method] = {
        name: getPaymentMethodText(method),
        value: 0,
        count: 0
      };
    }
    
    acc[method].value += transaction.amount;
    acc[method].count += 1;
    
    return acc;
  }, {} as Record<string, any>);
  
  const paymentMethodData = Object.values(paymentMethodStats);
  
  return (
    <div className="space-y-8">
      <Card className="bg-black/60 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">الإيرادات الشهرية</CardTitle>
          <CardDescription className="text-gray-400">تحليل الإيرادات على مدار الأشهر</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#999" tick={{ fill: '#999' }} />
                <YAxis stroke="#999" tick={{ fill: '#999' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} 
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [formatCurrency(value as number), '']}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Bar dataKey="platformFee" name="عمولة المنصة" fill="#39FF14" />
                <Bar dataKey="ownerAmount" name="مبلغ المالك" fill="#3980FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/60 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">توزيع طرق الدفع</CardTitle>
            <CardDescription className="text-gray-400">نسبة استخدام كل طريقة دفع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                    labelLine={false}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} 
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => [formatCurrency(value as number), '']}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/60 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">الإحصائيات المالية</CardTitle>
            <CardDescription className="text-gray-400">ملخص للأرقام المالية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-[#39FF14]/20">
                  <div className="text-gray-400 text-sm mb-1">إجمالي الإيرادات</div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#39FF14]" />
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-[#39FF14]/20">
                  <div className="text-gray-400 text-sm mb-1">عمولة المنصة</div>
                  <div className="text-xl font-bold text-white flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#39FF14]" />
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.platformFee, 0))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <div className="text-gray-400 text-sm mb-1">عدد المعاملات</div>
                  <div className="text-lg font-bold text-white">
                    {transactions.length}
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <div className="text-gray-400 text-sm mb-1">معاملات مكتملة</div>
                  <div className="text-lg font-bold text-[#39FF14]">
                    {transactions.filter(t => t.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-lg border border-gray-800">
                  <div className="text-gray-400 text-sm mb-1">قيد الانتظار</div>
                  <div className="text-lg font-bold text-yellow-500">
                    {transactions.filter(t => t.status === 'pending').length}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// مكون عرض تفاصيل معاملة مالية
const TransactionDetails = ({ transaction }: { transaction: Transaction }) => {
  return (
    <Card className="bg-black/60 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">
          تفاصيل المعاملة #{transaction.id.substring(0, 8)}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {format(transaction.createdAt.toDate(), 'dd MMMM yyyy - h:mm a', { locale: ar })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">معلومات الحجز</h3>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">رقم الحجز:</span>
                  <span className="text-white font-mono">{transaction.bookingId.substring(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">اسم العقار:</span>
                  <span className="text-white">{transaction.propertyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">اسم العميل:</span>
                  <span className="text-white">{transaction.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">البريد الإلكتروني:</span>
                  <span className="text-white">{transaction.userEmail}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-400 mb-1">حالة المعاملة</h3>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">الحالة:</span>
                  <Badge className={
                    transaction.status === 'completed' ? 'bg-green-600' : 
                    transaction.status === 'pending' ? 'bg-yellow-600' : 
                    transaction.status === 'refunded' ? 'bg-blue-600' : 'bg-red-600'
                  }>
                    {getStatusText(transaction.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">طريقة الدفع:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                    <span className="text-white">{getPaymentMethodText(transaction.paymentMethod)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">تاريخ المعاملة:</span>
                  <span className="text-white">
                    {format(transaction.createdAt.toDate(), 'dd MMMM yyyy', { locale: ar })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">التفاصيل المالية</h3>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المبلغ الكلي:</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">عمولة المنصة (10%):</span>
                  <span className="text-white font-semibold text-[#39FF14]">{formatCurrency(transaction.platformFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">مبلغ المالك (90%):</span>
                  <span className="text-white font-semibold">{formatCurrency(transaction.ownerAmount)}</span>
                </div>
                
                <div className="h-1 bg-gray-800 my-2"></div>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button variant="outline" className="border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10 hover:border-[#39FF14]/50">
                    <Download className="h-4 w-4 mr-2" />
                    <span>تصدير الفاتورة</span>
                  </Button>
                  <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>معاملات مشابهة</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-400 mb-1">الملاحظات</h3>
              <div className="bg-black/40 p-4 rounded-lg border border-gray-800 min-h-32">
                <p className="text-gray-400 text-sm">
                  {transaction.status === 'completed' ? (
                    "تمت المعاملة بنجاح وتم توزيع المبالغ حسب النسب المتفق عليها. عمولة المنصة 10% ومبلغ المالك 90%."
                  ) : transaction.status === 'pending' ? (
                    "المعاملة قيد الانتظار للتأكيد. سيتم التحقق من المعلومات ومعالجة الدفع قريبًا."
                  ) : transaction.status === 'refunded' ? (
                    "تم استرداد المبلغ للعميل بالكامل وإلغاء المعاملة."
                  ) : (
                    "فشلت المعاملة. لم يتم اكتمال عملية الدفع بنجاح."
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4">
        <div className="flex justify-end w-full gap-3">
          <Button variant="outline" className="border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900">
            الرجوع للقائمة
          </Button>
          {transaction.status === 'pending' && (
            <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
              تأكيد المعاملة
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// مكون الصفحة الرئيسية للمعاملات المالية
const FinancialTransactions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // استعلام لجلب المعاملات المالية
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!db) return [];
      
      try {
        const transactionsCollection = collection(db, 'transactions');
        const q = query(
          transactionsCollection,
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Transaction[];
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    }
  });
  
  // تصفية المعاملات حسب الحالة
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    let filtered = [...transactions];
    
    // تصفية حسب علامة التبويب النشطة
    if (activeTab !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === activeTab);
    }
    
    // تصفية حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.id.toLowerCase().includes(query) ||
        transaction.bookingId.toLowerCase().includes(query) ||
        transaction.propertyName.toLowerCase().includes(query) ||
        transaction.userName.toLowerCase().includes(query) ||
        transaction.userEmail.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // حساب إجمالي المبالغ
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalPlatformFee = filteredTransactions.reduce((sum, transaction) => sum + transaction.platformFee, 0);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#39FF14]/20 border-t-[#39FF14] animate-spin"></div>
          <h2 className="text-white text-xl font-medium">جاري تحميل بيانات المعاملات المالية...</h2>
        </div>
      </div>
    );
  }
  
  // إذا تم تحديد معاملة، عرض تفاصيلها
  if (selectedTransaction) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="outline" 
          className="mb-6 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900"
          onClick={() => setSelectedTransaction(null)}
        >
          العودة إلى قائمة المعاملات
        </Button>
        
        <TransactionDetails transaction={selectedTransaction} />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">المعاملات المالية</h1>
          <p className="text-gray-400">إدارة ومراقبة جميع المعاملات المالية في النظام</p>
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
            <Download className="h-4 w-4 mr-2" />
            <span>تصدير التقرير</span>
          </Button>
        </div>
      </div>
      
      {transactions && transactions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-black/60 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">إجمالي المعاملات</p>
                    <h3 className="text-white text-2xl font-bold">{transactions.length}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">إجمالي المبالغ</p>
                    <h3 className="text-white text-2xl font-bold">
                      {formatCurrency(totalAmount)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">عمولة المنصة</p>
                    <h3 className="text-white text-2xl font-bold">
                      {formatCurrency(totalPlatformFee)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/60 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#39FF14]/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">الشهر الحالي</p>
                    <h3 className="text-white text-2xl font-bold">
                      {transactions.filter(
                        t => t.createdAt.toDate().getMonth() === new Date().getMonth() &&
                             t.createdAt.toDate().getFullYear() === new Date().getFullYear()
                      ).length} معاملة
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="table" className="mb-8">
            <TabsList className="grid grid-cols-2 w-64 mb-6 bg-black/60 border border-gray-800 rounded-lg">
              <TabsTrigger 
                value="table" 
                className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] text-gray-400"
              >
                جدول المعاملات
              </TabsTrigger>
              <TabsTrigger 
                value="charts" 
                className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] text-gray-400"
              >
                رسوم بيانية
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-2 w-full md:w-96">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="بحث في المعاملات..."
                      className="pl-10 bg-black/60 border-gray-800 text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-40 bg-black/60 border-gray-800 text-white">
                      <SelectValue placeholder="جميع المعاملات" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                      <SelectItem value="all">جميع المعاملات</SelectItem>
                      <SelectItem value="completed">مكتملة</SelectItem>
                      <SelectItem value="pending">قيد الانتظار</SelectItem>
                      <SelectItem value="failed">فاشلة</SelectItem>
                      <SelectItem value="refunded">مستردة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Card className="bg-black/60 border-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-black/70">
                      <TableRow className="hover:bg-gray-900/50 border-gray-800">
                        <TableHead className="text-gray-400 font-medium">رقم المعاملة</TableHead>
                        <TableHead className="text-gray-400 font-medium">العميل</TableHead>
                        <TableHead className="text-gray-400 font-medium">
                          <div className="flex items-center gap-1">
                            <span>المبلغ</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="text-gray-400 font-medium">
                          <div className="flex items-center gap-1">
                            <span>التاريخ</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="text-gray-400 font-medium">طريقة الدفع</TableHead>
                        <TableHead className="text-gray-400 font-medium">الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow 
                            key={transaction.id} 
                            className="hover:bg-[#39FF14]/5 cursor-pointer border-gray-800"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <TableCell className="font-mono text-gray-300">
                              #{transaction.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-white">{transaction.userName}</span>
                                <span className="text-gray-500 text-xs">{transaction.userEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-white">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-gray-400">
                              {format(transaction.createdAt.toDate(), 'dd MMM yyyy', { locale: ar })}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                <span className="text-gray-300">
                                  {getPaymentMethodText(transaction.paymentMethod)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                transaction.status === 'completed' ? 'bg-green-600' : 
                                transaction.status === 'pending' ? 'bg-yellow-600' : 
                                transaction.status === 'refunded' ? 'bg-blue-600' : 'bg-red-600'
                              }>
                                {getStatusText(transaction.status)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                            لا توجد معاملات مطابقة للبحث
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t border-gray-800 p-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    عرض {filteredTransactions.length} من أصل {transactions.length} معاملة
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 w-8 p-0 border-gray-800">
                      <span>&laquo;</span>
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-800 bg-[#39FF14]/10 text-[#39FF14]">1</Button>
                    <Button variant="outline" size="sm" className="border-gray-800 text-gray-400 hover:text-white">2</Button>
                    <Button variant="outline" size="sm" className="border-gray-800 text-gray-400 hover:text-white">3</Button>
                    <Button variant="outline" className="h-8 w-8 p-0 border-gray-800">
                      <span>&raquo;</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="charts">
              <RevenueCharts transactions={transactions} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="bg-black/60 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-20 w-20 bg-[#39FF14]/5 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-10 w-10 text-[#39FF14]/70" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">لا توجد معاملات مالية</h3>
            <p className="text-gray-400 text-center max-w-md mb-6">
              لم يتم تسجيل أي معاملات مالية في النظام بعد. ستظهر المعاملات هنا بمجرد إتمام عمليات الحجز والدفع.
            </p>
            <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
              تحديث الصفحة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialTransactions;