import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FaClock, FaUsers, FaLock } from 'react-icons/fa';

interface BookingCountdownProps {
  expiryTime: Date; // وقت انتهاء الحجز
  initialTotalSeconds?: number; // إجمالي الوقت بالثواني
  onExpire?: () => void; // دالة يتم استدعاؤها عند انتهاء الوقت
  onReserve?: () => void; // دالة يتم استدعاؤها عند الضغط على زر الحجز
  activeVisitors?: number; // عدد الزوار النشطين الذين يشاهدون هذا العقار
  propertyName?: string; // اسم العقار
  className?: string; // فئات CSS إضافية
}

/**
 * مكون العد التنازلي لتوافر الحجز في الوقت الفعلي
 * يعرض الوقت المتبقي قبل انتهاء توافر الحجز مع مؤشرات بصرية
 */
export default function BookingCountdown({
  expiryTime,
  initialTotalSeconds = 15 * 60, // 15 دقيقة افتراضياً
  onExpire,
  onReserve,
  activeVisitors = 0,
  propertyName = "العقار",
  className = "",
}: BookingCountdownProps) {
  // حالات مختلفة للعد التنازلي
  const [timeLeft, setTimeLeft] = useState<number>(initialTotalSeconds);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // حساب الوقت المتبقي بالدقائق والثواني
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // تأثير لبدء العد التنازلي
  useEffect(() => {
    // التحقق من أن الوقت لم ينته بالفعل
    const now = new Date();
    const expiry = new Date(expiryTime);
    
    if (expiry <= now) {
      // الوقت انتهى بالفعل
      setIsExpired(true);
      setTimeLeft(0);
      setProgressValue(0);
      if (onExpire) onExpire();
      return;
    }
    
    // حساب الوقت المتبقي بناءً على تاريخ الانتهاء
    const remainingMs = expiry.getTime() - now.getTime();
    const remainingSeconds = Math.floor(remainingMs / 1000);
    setTimeLeft(remainingSeconds);
    
    // تعيين قيمة شريط التقدم
    const percentage = Math.min(
      100,
      Math.max(0, (remainingSeconds / initialTotalSeconds) * 100)
    );
    setProgressValue(percentage);

    // إنشاء دالة تحديث العداد كل ثانية
    const updateTimer = () => {
      setTimeLeft(prevTime => {
        // عندما يصل العداد إلى الصفر
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsExpired(true);
          setProgressValue(0);
          if (onExpire) onExpire();
          return 0;
        }
        
        // تحديث قيمة شريط التقدم
        const newTime = prevTime - 1;
        const newPercentage = Math.min(
          100,
          Math.max(0, (newTime / initialTotalSeconds) * 100)
        );
        setProgressValue(newPercentage);
        
        return newTime;
      });
    };

    // بدء العداد
    timerRef.current = setInterval(updateTimer, 1000);

    // تنظيف العداد عند تفكيك المكون
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [expiryTime, initialTotalSeconds, onExpire]);

  // تحديد لون شريط التقدم بناءً على الوقت المتبقي
  const getProgressColor = () => {
    if (progressValue > 66) return 'bg-[#39FF14]';
    if (progressValue > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // تحديد رسالة الحالة بناءً على الوقت المتبقي
  const getStatusMessage = () => {
    if (isExpired) return 'انتهى وقت الحجز';
    if (progressValue > 66) return 'متاح للحجز';
    if (progressValue > 33) return 'الوقت ينفد!';
    return 'أسرع! الوقت على وشك الانتهاء!';
  };

  // تنسيق الوقت بتنسيق MM:SS
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Card className={`bg-black/70 backdrop-blur-md border border-[#39FF14]/20 overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* عنوان العقار ومعلومات الزوار */}
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium flex items-center gap-2">
              <FaClock className="text-[#39FF14]" />
              <span>توافر {propertyName}</span>
            </h3>
            <Badge 
              variant="outline" 
              className="bg-black/50 text-[#39FF14] border-[#39FF14]/20"
            >
              <FaUsers className="mr-1 h-3 w-3" />
              {activeVisitors} مشاهد الآن
            </Badge>
          </div>

          {/* شريط التقدم والوقت المتبقي */}
          <div className="relative pt-2">
            <Progress 
              value={progressValue} 
              className="h-2 bg-gray-800"
              style={{
                ['--progress-background' as any]: getProgressColor()
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${isExpired ? 'text-red-500' : 'text-[#39FF14]'}`}>
                {isExpired ? (
                  <span className="flex items-center gap-1">
                    <FaLock className="h-3 w-3" /> انتهى الوقت
                  </span>
                ) : (
                  `الوقت المتبقي: ${formattedTime}`
                )}
              </span>
              <span className="text-xs text-gray-400">
                {getStatusMessage()}
              </span>
            </div>
          </div>

          {/* زر الحجز */}
          <Button 
            onClick={onReserve} 
            disabled={isExpired}
            className={`w-full mt-2 ${
              isExpired 
                ? 'bg-gray-700 text-gray-300 cursor-not-allowed' 
                : 'bg-[#39FF14] text-black hover:bg-[#50FF30]'
            }`}
          >
            {isExpired ? 'انتهى وقت الحجز' : 'احجز الآن'}
          </Button>

          {/* رسالة تحذيرية عند اقتراب انتهاء الوقت */}
          {!isExpired && progressValue <= 33 && (
            <div className="text-xs text-red-400 text-center mt-2 animate-pulse">
              أسرع! هذا العقار محط اهتمام العديد من الزوار. قد تفقد فرصة الحجز!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}