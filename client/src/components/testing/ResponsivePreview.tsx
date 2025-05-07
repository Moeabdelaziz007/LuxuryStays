import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * أحجام الشاشات القياسية للاختبار
 */
const SCREEN_SIZES = {
  mobile: {
    width: 360,
    height: 640,
    label: 'جوال (360×640)',
  },
  mobileHorizontal: {
    width: 640,
    height: 360,
    label: 'جوال أفقي (640×360)',
  },
  tablet: {
    width: 768,
    height: 1024,
    label: 'تابلت (768×1024)',
  },
  tabletHorizontal: {
    width: 1024,
    height: 768,
    label: 'تابلت أفقي (1024×768)',
  },
  laptop: {
    width: 1366,
    height: 768,
    label: 'لابتوب (1366×768)',
  },
  desktop: {
    width: 1920,
    height: 1080,
    label: 'شاشة كبيرة (1920×1080)',
  },
};

interface ResponsivePreviewProps {
  initialPath?: string;
}

/**
 * مكون معاينة استجابة واجهة المستخدم
 * يتيح اختبار التطبيق في أحجام شاشات مختلفة
 */
const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ initialPath = '/' }) => {
  const [path, setPath] = useState(initialPath);
  const [currentSize, setCurrentSize] = useState<keyof typeof SCREEN_SIZES>('mobile');
  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);
  const [showCustom, setShowCustom] = useState(false);
  
  // التعامل مع سحب الإطار لتغيير الحجم
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  
  // الحصول على URL الكامل للتطبيق
  const getFullUrl = () => {
    const baseUrl = window.location.origin;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  };
  
  // الحصول على عرض وارتفاع الإطار الحالي
  const getFrameSize = () => {
    if (showCustom) {
      return {
        width: customWidth || 375,
        height: customHeight || 667,
      };
    }
    return SCREEN_SIZES[currentSize];
  };
  
  const frameSize = getFrameSize();
  
  // بدء عملية تغيير الحجم
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setStartWidth(frameSize.width);
    setStartHeight(frameSize.height);
    
    // إضافة مستمعي الأحداث لتتبع الحركة وإنهاء التغيير
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };
  
  // تحديث الحجم أثناء السحب
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    
    setCustomWidth(Math.max(320, newWidth));
    setCustomHeight(Math.max(400, newHeight));
    setShowCustom(true);
  };
  
  // إنهاء عملية تغيير الحجم
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };
  
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>معاينة استجابة واجهة المستخدم</CardTitle>
        <CardDescription>
          اختبر كيف تبدو واجهة التطبيق على مختلف أحجام الشاشات
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="preview">المعاينة</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="mt-4">
          <CardContent className="flex flex-col items-center">
            <div className="flex gap-2 flex-wrap justify-center mb-4">
              {Object.entries(SCREEN_SIZES).map(([key, size]) => (
                <Button
                  key={key}
                  variant={currentSize === key && !showCustom ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCurrentSize(key as keyof typeof SCREEN_SIZES);
                    setShowCustom(false);
                  }}
                  className={currentSize === key && !showCustom 
                    ? "bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border-[#39FF14]/50" 
                    : ""}
                >
                  {size.label}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between items-center w-full mb-2">
              <p className="text-gray-400 text-sm">
                {showCustom 
                  ? `حجم مخصص: ${customWidth}×${customHeight}` 
                  : `حجم الشاشة: ${frameSize.width}×${frameSize.height}`}
              </p>
              
              <div className="flex items-center">
                <Label htmlFor="path" className="sr-only">المسار</Label>
                <Input
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-48 h-8 mr-2"
                  placeholder="المسار (مثال: /about)"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setPath(initialPath)}
                >
                  إعادة ضبط
                </Button>
              </div>
            </div>
            
            <div 
              className="relative mt-4 border-2 border-[#39FF14]/30 rounded-md overflow-hidden resize-contaier transition-all duration-300 bg-gray-900"
              style={{ 
                width: `${frameSize.width}px`, 
                height: `${frameSize.height}px`,
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
            >
              <iframe
                src={getFullUrl()}
                title="معاينة استجابة الواجهة"
                className="w-full h-full border-0"
                style={{ 
                  transform: 'scale(1)',
                  transformOrigin: '0 0',
                }}
              />
              
              {/* زر تغيير الحجم */}
              <div 
                className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize bg-[#39FF14]/20 hover:bg-[#39FF14]/40 transition-colors flex items-center justify-center"
                onMouseDown={handleResizeStart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 22 16 22 10" />
                  <polyline points="8 8 2 8 2 14" />
                  <line x1="22" y1="16" x2="16" y2="22" />
                  <line x1="8" y1="2" x2="2" y2="8" />
                </svg>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="screen-size">حجم الشاشة</Label>
                  <Select
                    value={showCustom ? 'custom' : currentSize}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setShowCustom(true);
                        if (customWidth === 0 || customHeight === 0) {
                          setCustomWidth(375);
                          setCustomHeight(667);
                        }
                      } else {
                        setShowCustom(false);
                        setCurrentSize(value as keyof typeof SCREEN_SIZES);
                      }
                    }}
                  >
                    <SelectTrigger id="screen-size">
                      <SelectValue placeholder="اختر حجم الشاشة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SCREEN_SIZES).map(([key, size]) => (
                        <SelectItem key={key} value={key}>
                          {size.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">حجم مخصص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="path-input">المسار</Label>
                  <Input
                    id="path-input"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="أدخل المسار (مثال: /about)"
                  />
                </div>
              </div>
              
              {showCustom && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="custom-width">العرض المخصص (بكسل)</Label>
                    <Input
                      id="custom-width"
                      type="number"
                      min="320"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-height">الارتفاع المخصص (بكسل)</Label>
                    <Input
                      id="custom-height"
                      type="number"
                      min="400"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm text-gray-400">اختبار سريع للصفحات الشائعة</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/')}
                  >
                    الرئيسية
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/login')}
                  >
                    تسجيل الدخول
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/properties')}
                  >
                    العقارات
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/customer')}
                  >
                    لوحة المستخدم
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/property-admin')}
                  >
                    لوحة مدير العقارات
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPath('/super-admin')}
                  >
                    لوحة المشرف
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-gray-400">
          {showCustom 
            ? `الحجم الحالي: ${customWidth}×${customHeight}` 
            : `الحجم الحالي: ${frameSize.width}×${frameSize.height}`}
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(getFullUrl(), '_blank')}
          >
            فتح في نافذة جديدة
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setPath(initialPath);
              setCurrentSize('mobile');
              setShowCustom(false);
            }}
          >
            إعادة ضبط
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResponsivePreview;