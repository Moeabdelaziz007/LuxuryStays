import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

/**
 * مكون لعرض رسالة ترحيبية مخصصة بناءً على دور المستخدم بعد تسجيل الدخول
 */
export default function WelcomeMessage() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [_, navigate] = useLocation();
  const [showNewUser, setShowNewUser] = useState(false);
  
  // التحقق من وجود علامة تشير إلى أن المستخدم قد سجل دخوله للتو
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    const isNewUser = localStorage.getItem('isNewUser');
    
    if (justLoggedIn === 'true' && user) {
      setShowWelcome(true);
      // إزالة العلامة لمنع ظهور الرسالة في كل مرة يتم فيها تحميل الصفحة
      sessionStorage.removeItem('justLoggedIn');
    }
    
    if (isNewUser === 'true' && user) {
      setShowNewUser(true);
      localStorage.removeItem('isNewUser');
    }
  }, [user]);
  
  const getWelcomeTitle = () => {
    if (showNewUser) {
      return "مرحباً بك في StayX! 🎉";
    }
    
    if (user?.isAnonymous) {
      return "أهلاً بك كضيف في StayX! 👋";
    }
    
    return `مرحباً بعودتك، ${user?.name || 'مستخدم'}! 👋`;
  };
  
  const getWelcomeMessage = () => {
    if (showNewUser) {
      return "شكراً لتسجيلك في منصتنا. نحن سعداء بانضمامك إلى مجتمع StayX!";
    }
    
    if (user?.isAnonymous) {
      return "يمكنك تصفح العقارات والخدمات كضيف. للحصول على تجربة كاملة، ننصح بإنشاء حساب.";
    }
    
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return "تم تسجيل دخولك بصلاحيات المدير العام. يمكنك الوصول إلى جميع أجزاء النظام وإدارة المستخدمين والعقارات.";
      case 'PROPERTY_ADMIN':
        return "تم تسجيل دخولك كمدير عقارات. يمكنك إدارة العقارات الخاصة بك ومراجعة الحجوزات.";
      case 'CUSTOMER':
        return "يمكنك الآن تصفح العقارات المميزة والخدمات والقيام بالحجوزات.";
      default:
        return "يمكنك الآن استخدام كافة ميزات المنصة المتاحة لك.";
    }
  };
  
  const getRoleColor = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return "bg-red-500 hover:bg-red-600";
      case 'PROPERTY_ADMIN':
        return "bg-blue-500 hover:bg-blue-600";
      case 'CUSTOMER':
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  const getRecommendedAction = () => {
    if (user?.isAnonymous) {
      return {
        text: "إنشاء حساب دائم",
        action: () => navigate("/signup"),
      };
    }
    
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return {
          text: "الذهاب إلى لوحة التحكم",
          action: () => navigate("/super-admin"),
        };
      case 'PROPERTY_ADMIN':
        return {
          text: "إدارة العقارات",
          action: () => navigate("/property-admin"),
        };
      case 'CUSTOMER':
        return {
          text: "استعراض العقارات المميزة",
          action: () => navigate("/properties"),
        };
      default:
        return {
          text: "استكشاف المنصة",
          action: () => navigate("/"),
        };
    }
  };
  
  const getRoleBadge = () => {
    if (!user) return null;
    
    let label = "عضو";
    let variant = "secondary";
    
    if (user.isAnonymous) {
      label = "زائر";
      variant = "outline";
    } else if (user.role === 'SUPER_ADMIN') {
      label = "مدير عام";
      variant = "destructive";
    } else if (user.role === 'PROPERTY_ADMIN') {
      label = "مدير عقارات";
      variant = "default";
    } else if (user.role === 'CUSTOMER') {
      label = "عميل";
      variant = "secondary";
    }
    
    return (
      <Badge variant={variant as any} className="mr-2">
        {label}
      </Badge>
    );
  };
  
  const recommendedAction = getRecommendedAction();
  
  return (
    <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-black to-gray-900 text-white border border-[#39FF14]/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center">
            {getWelcomeTitle()}
            <div className="ltr:ml-auto rtl:mr-auto">
              {getRoleBadge()}
            </div>
          </DialogTitle>
          <DialogDescription className="text-gray-300 pt-2">
            {getWelcomeMessage()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          {user?.isAnonymous && (
            <div className="p-3 bg-yellow-900/30 border border-yellow-700/30 rounded-md text-yellow-300 text-sm">
              أنت الآن في وضع التصفح كزائر. لن يتم حفظ تفضيلاتك بعد الخروج من التطبيق.
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setShowWelcome(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              إغلاق
            </Button>
            
            <Button
              onClick={() => {
                recommendedAction.action();
                setShowWelcome(false);
              }}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/80 font-medium"
            >
              {recommendedAction.text}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}