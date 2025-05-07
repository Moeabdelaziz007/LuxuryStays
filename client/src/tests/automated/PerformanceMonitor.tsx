import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { usePerformanceMode, PerformanceMode } from '@/hooks/use-performance-mode';

// مؤشرات الأداء الرئيسية للتطبيق
interface PerformanceMetrics {
  fps: number[];
  memory: number[];
  domElements: number[];
  jsHeapSize: number[];
  loadTime: number;
  paintTime: number;
  firstContentfulPaint?: number;
  networkRequests: NetworkRequestInfo[];
  timestamp: number[];
  resourceCounts: ResourceCount[];
}

interface NetworkRequestInfo {
  url: string;
  duration: number;
  size: number;
  type: string;
}

interface ResourceCount {
  type: string;
  count: number;
  totalSize: number;
}

interface HealthStatus {
  fps: 'good' | 'warning' | 'critical';
  memory: 'good' | 'warning' | 'critical';
  domSize: 'good' | 'warning' | 'critical';
  loadTime: 'good' | 'warning' | 'critical';
  overall: 'good' | 'warning' | 'critical';
}

/**
 * مكون مراقبة الأداء على جانب العميل
 * يوفر معلومات حول أداء التطبيق في الوقت الفعلي
 */
const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: [],
    memory: [],
    domElements: [],
    jsHeapSize: [],
    loadTime: 0,
    paintTime: 0,
    networkRequests: [],
    timestamp: [],
    resourceCounts: []
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    fps: 'good',
    memory: 'good',
    domSize: 'good',
    loadTime: 'good',
    overall: 'good'
  });
  
  const [performanceSettings, setPerformanceMode] = usePerformanceMode();
  
  const fpsCounterRef = useRef({
    frames: 0,
    lastTime: performance.now(),
    rafId: 0
  });
  
  const monitoringTimerRef = useRef<NodeJS.Timer | null>(null);
  
  // معدلات عينات القياس
  const SAMPLING_RATE = 1000; // قياس كل ثانية
  const MAX_SAMPLES = 60; // أقصى عدد من العينات للاحتفاظ بها
  
  // حدود الصحة
  const HEALTH_THRESHOLDS = {
    fps: { warning: 40, critical: 30 },
    memory: { warning: 50, critical: 75 }, // النسبة المئوية من الحد الأقصى
    domElements: { warning: 1000, critical: 2000 },
    loadTime: { warning: 2000, critical: 3000 } // بالمللي ثانية
  };
  
  // بدء رصد الأداء
  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    resetMetrics();
    
    // قياس FPS
    const measureFPS = () => {
      fpsCounterRef.current.frames++;
      const now = performance.now();
      const elapsed = now - fpsCounterRef.current.lastTime;
      
      if (elapsed >= SAMPLING_RATE) {
        const fps = Math.round((fpsCounterRef.current.frames * 1000) / elapsed);
        
        setMetrics(prev => {
          const newFps = [...prev.fps, fps];
          if (newFps.length > MAX_SAMPLES) newFps.shift();
          
          // تحديث الطوابع الزمنية
          const newTimestamps = [...prev.timestamp, Date.now()];
          if (newTimestamps.length > MAX_SAMPLES) newTimestamps.shift();
          
          return {
            ...prev,
            fps: newFps,
            timestamp: newTimestamps
          };
        });
        
        // تحديث حالة صحة FPS
        updateHealthStatus('fps', fps);
        
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }
      
      fpsCounterRef.current.rafId = requestAnimationFrame(measureFPS);
    };
    
    fpsCounterRef.current.rafId = requestAnimationFrame(measureFPS);
    
    // جمع البيانات على فترات منتظمة
    monitoringTimerRef.current = setInterval(collectPerformanceData, SAMPLING_RATE);
    
    // جمع البيانات الأولية
    collectPerformanceData();
    loadTimeMetrics();
    collectResourceMetrics();
  };
  
  // إيقاف رصد الأداء
  const stopMonitoring = () => {
    setIsMonitoring(false);
    
    if (fpsCounterRef.current.rafId) {
      cancelAnimationFrame(fpsCounterRef.current.rafId);
      fpsCounterRef.current.rafId = 0;
    }
    
    if (monitoringTimerRef.current) {
      clearInterval(monitoringTimerRef.current);
      monitoringTimerRef.current = null;
    }
  };
  
  // إعادة ضبط مقاييس الأداء
  const resetMetrics = () => {
    setMetrics({
      fps: [],
      memory: [],
      domElements: [],
      jsHeapSize: [],
      loadTime: 0,
      paintTime: 0,
      networkRequests: [],
      timestamp: [],
      resourceCounts: []
    });
    
    setHealthStatus({
      fps: 'good',
      memory: 'good',
      domSize: 'good',
      loadTime: 'good',
      overall: 'good'
    });
  };
  
  // جمع بيانات الأداء
  const collectPerformanceData = () => {
    // عدد عناصر DOM
    const domCount = document.querySelectorAll('*').length;
    
    // معلومات الذاكرة (إذا كان متاحًا)
    let memoryInfo = null;
    let heapSize = 0;
    
    if (performance && (performance as any).memory) {
      memoryInfo = (performance as any).memory;
      heapSize = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit * 100; // النسبة المئوية
    }
    
    setMetrics(prev => {
      const newDomElements = [...prev.domElements, domCount];
      if (newDomElements.length > MAX_SAMPLES) newDomElements.shift();
      
      let newMemory = [...prev.memory];
      let newJsHeapSize = [...prev.jsHeapSize];
      
      if (memoryInfo) {
        newMemory.push(heapSize);
        newJsHeapSize.push(memoryInfo.usedJSHeapSize / (1024 * 1024)); // بالميجابايت
        
        if (newMemory.length > MAX_SAMPLES) newMemory.shift();
        if (newJsHeapSize.length > MAX_SAMPLES) newJsHeapSize.shift();
        
        // تحديث حالة صحة الذاكرة
        updateHealthStatus('memory', heapSize);
      }
      
      // تحديث حالة صحة DOM
      updateHealthStatus('domSize', domCount);
      
      return {
        ...prev,
        domElements: newDomElements,
        memory: newMemory,
        jsHeapSize: newJsHeapSize
      };
    });
  };
  
  // جمع مقاييس أوقات التحميل
  const loadTimeMetrics = () => {
    if (performance && performance.timing) {
      try {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navEntry) {
          const loadTime = navEntry.loadEventEnd - navEntry.startTime;
          const paintTime = navEntry.domContentLoadedEventEnd - navEntry.startTime;
          
          setMetrics(prev => ({
            ...prev,
            loadTime,
            paintTime
          }));
          
          // تحديث حالة صحة وقت التحميل
          updateHealthStatus('loadTime', loadTime);
        }
        
        // قياس First Contentful Paint إذا كان متاحًا
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          setMetrics(prev => ({
            ...prev,
            firstContentfulPaint: fcpEntry.startTime
          }));
        }
      } catch (error) {
        console.error('خطأ في قياس أوقات التحميل:', error);
      }
    }
  };
  
  // جمع معلومات حول الموارد
  const collectResourceMetrics = () => {
    try {
      const resourceEntries = performance.getEntriesByType('resource');
      
      // معلومات الطلبات
      const networkRequests = resourceEntries.map(entry => {
        let type = 'other';
        const url = entry.name;
        
        if (url.endsWith('.js')) type = 'javascript';
        else if (url.endsWith('.css')) type = 'css';
        else if (url.endsWith('.html')) type = 'html';
        else if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) type = 'image';
        else if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) type = 'font';
        
        return {
          url,
          duration: entry.duration,
          size: entry.transferSize || 0,
          type
        };
      });
      
      // إجمالي حسب النوع
      const resourceTypes = ['javascript', 'css', 'html', 'image', 'font', 'other'];
      const resourceCounts = resourceTypes.map(type => {
        const filtered = networkRequests.filter(req => req.type === type);
        const count = filtered.length;
        const totalSize = filtered.reduce((sum, req) => sum + req.size, 0) / 1024; // بالكيلوبايت
        
        return { type, count, totalSize };
      });
      
      setMetrics(prev => ({
        ...prev,
        networkRequests,
        resourceCounts
      }));
    } catch (error) {
      console.error('خطأ في جمع معلومات الموارد:', error);
    }
  };
  
  // تحديث حالة صحة مقياس معين
  const updateHealthStatus = (metric: keyof Omit<HealthStatus, 'overall'>, value: number) => {
    setHealthStatus(prev => {
      const thresholds = HEALTH_THRESHOLDS[metric as keyof typeof HEALTH_THRESHOLDS];
      
      let newStatus: 'good' | 'warning' | 'critical' = 'good';
      
      if (metric === 'fps') {
        if (value < thresholds.critical) newStatus = 'critical';
        else if (value < thresholds.warning) newStatus = 'warning';
      } else {
        if (value > thresholds.critical) newStatus = 'critical';
        else if (value > thresholds.warning) newStatus = 'warning';
      }
      
      // تحديث حالة الصحة العامة
      const metrics = [prev.fps, prev.memory, prev.domSize, prev.loadTime, newStatus];
      let overall: 'good' | 'warning' | 'critical' = 'good';
      
      if (metrics.includes('critical')) overall = 'critical';
      else if (metrics.includes('warning')) overall = 'warning';
      
      return {
        ...prev,
        [metric]: newStatus,
        overall
      };
    });
  };
  
  // تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring]);
  
  // عرض نتيجة الحالة الصحية بالألوان المناسبة
  const renderHealthStatus = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };
  
  // تنسيق البيانات للرسم البياني
  const getChartData = () => {
    return metrics.timestamp.map((time, index) => ({
      time: new Date(time).toLocaleTimeString(),
      fps: metrics.fps[index] || 0,
      memory: metrics.memory[index] || 0,
      domElements: metrics.domElements[index] || 0,
      jsHeapSize: metrics.jsHeapSize[index] || 0
    }));
  };
  
  // الحصول على متوسط FPS
  const getAverageFPS = () => {
    if (metrics.fps.length === 0) return 0;
    return Math.round(metrics.fps.reduce((sum, fps) => sum + fps, 0) / metrics.fps.length);
  };
  
  // تغيير وضع الأداء بناءً على نتائج المراقبة
  const optimizePerformance = () => {
    let recommendedMode: PerformanceMode;
    
    const avgFps = getAverageFPS();
    
    if (avgFps < 30) {
      recommendedMode = PerformanceMode.LOW;
    } else if (avgFps < 45) {
      recommendedMode = PerformanceMode.MEDIUM;
    } else {
      // الأداء جيد، يمكن استخدام الإعدادات العالية
      recommendedMode = PerformanceMode.HIGH;
    }
    
    // تطبيق الإعدادات الموصى بها
    setPerformanceMode(recommendedMode);
    
    alert(`تم تحسين الأداء تلقائيًا! تم تعيين وضع الأداء إلى: ${
      recommendedMode === PerformanceMode.HIGH ? 'عالٍ' :
      recommendedMode === PerformanceMode.MEDIUM ? 'متوسط' : 'منخفض'
    }`);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl">مراقبة الأداء</CardTitle>
            <CardDescription>مراقبة أداء التطبيق في الوقت الفعلي</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
            >
              {isMonitoring ? "إيقاف المراقبة" : "بدء المراقبة"}
            </Button>
            {metrics.fps.length > 0 && (
              <Button variant="outline" onClick={optimizePerformance}>
                تحسين الأداء تلقائيًا
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ملخص صحة التطبيق */}
        <Alert className={
          healthStatus.overall === 'good' ? "bg-green-500/10 border-green-500" :
          healthStatus.overall === 'warning' ? "bg-yellow-500/10 border-yellow-500" :
          "bg-red-500/10 border-red-500"
        }>
          <div className="flex items-start">
            <div className="mr-2 mt-1">
              {renderHealthStatus(healthStatus.overall)}
            </div>
            <div>
              <AlertTitle className="text-lg mb-1">
                صحة التطبيق: {
                  healthStatus.overall === 'good' ? 'جيدة' :
                  healthStatus.overall === 'warning' ? 'متوسطة' : 'منخفضة'
                }
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {renderHealthStatus(healthStatus.fps)}
                    <span>FPS: {getAverageFPS()} إطار/ثانية</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderHealthStatus(healthStatus.memory)}
                    <span>الذاكرة: {metrics.memory.length > 0 ? Math.round(metrics.memory[metrics.memory.length - 1]) : 0}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderHealthStatus(healthStatus.domSize)}
                    <span>DOM: {metrics.domElements.length > 0 ? metrics.domElements[metrics.domElements.length - 1] : 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderHealthStatus(healthStatus.loadTime)}
                    <span>التحميل: {metrics.loadTime ? Math.round(metrics.loadTime) : 0}ms</span>
                  </div>
                </div>
              </AlertDescription>
            </div>
          </div>
        </Alert>
        
        <Tabs defaultValue="realtime-metrics">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="realtime-metrics">مقاييس الوقت الفعلي</TabsTrigger>
            <TabsTrigger value="load-metrics">مقاييس التحميل</TabsTrigger>
            <TabsTrigger value="resources">الموارد</TabsTrigger>
          </TabsList>
          
          <TabsContent value="realtime-metrics">
            <div className="space-y-6">
              {/* مقاييس FPS والذاكرة */}
              {metrics.fps.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(value) => value.split(':')[1] + ':' + value.split(':')[2]}
                      />
                      <YAxis stroke="#888" tick={{fill: '#888'}} />
                      <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="fps" 
                        name="FPS" 
                        stroke="#39FF14" 
                        dot={false} 
                        activeDot={{ r: 8 }}
                      />
                      {metrics.memory.length > 0 && (
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          name="الذاكرة (%)" 
                          stroke="#8884d8" 
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-800/50 rounded-md">
                  <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-gray-500 mb-2 mx-auto animate-spin" />
                    <p className="text-gray-400">
                      {isMonitoring ? 'جاري جمع البيانات...' : 'انقر على زر "بدء المراقبة" لبدء جمع مقاييس الأداء'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* مقاييس DOM وحجم الكومة JS */}
              {metrics.domElements.length > 0 && (
                <div className="h-64 w-full mt-6">
                  <ResponsiveContainer>
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#888" 
                        tick={{fill: '#888'}}
                        tickFormatter={(value) => value.split(':')[1] + ':' + value.split(':')[2]}
                      />
                      <YAxis stroke="#888" tick={{fill: '#888'}} />
                      <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="domElements" 
                        name="عناصر DOM" 
                        stroke="#ffc658" 
                        dot={false}
                      />
                      {metrics.jsHeapSize.length > 0 && (
                        <Line 
                          type="monotone" 
                          dataKey="jsHeapSize" 
                          name="حجم كومة JS (MB)" 
                          stroke="#ff8042" 
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="load-metrics">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* مقياس وقت التحميل */}
                <div className="p-4 rounded-md bg-black/20">
                  <h3 className="text-sm text-gray-400 mb-1">وقت التحميل</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-medium">{metrics.loadTime ? Math.round(metrics.loadTime) : 0}ms</p>
                    {metrics.loadTime > 0 && renderHealthStatus(healthStatus.loadTime)}
                  </div>
                  <Progress 
                    value={metrics.loadTime / 30} 
                    className="h-1 mt-2"
                    style={{
                      backgroundColor: '#444',
                      color: metrics.loadTime > 3000 
                        ? '#ef4444' 
                        : metrics.loadTime > 2000 
                          ? '#f59e0b' 
                          : '#10b981'
                    }}
                  />
                </div>
                
                {/* مقياس وقت العرض */}
                <div className="p-4 rounded-md bg-black/20">
                  <h3 className="text-sm text-gray-400 mb-1">DOM Content Loaded</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-medium">{metrics.paintTime ? Math.round(metrics.paintTime) : 0}ms</p>
                    <Badge 
                      className={
                        !metrics.paintTime ? 'bg-gray-500' :
                        metrics.paintTime > 2000 ? 'bg-red-500' : 
                        metrics.paintTime > 1000 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }
                    >
                      {!metrics.paintTime ? 'غير متاح' :
                       metrics.paintTime > 2000 ? 'بطيء' : 
                       metrics.paintTime > 1000 ? 'متوسط' : 
                       'سريع'}
                    </Badge>
                  </div>
                  <Progress 
                    value={metrics.paintTime / 20} 
                    className="h-1 mt-2"
                    style={{
                      backgroundColor: '#444',
                      color: metrics.paintTime > 2000 
                        ? '#ef4444' 
                        : metrics.paintTime > 1000 
                          ? '#f59e0b' 
                          : '#10b981'
                    }}
                  />
                </div>
                
                {/* مقياس First Contentful Paint */}
                <div className="p-4 rounded-md bg-black/20">
                  <h3 className="text-sm text-gray-400 mb-1">First Contentful Paint</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-medium">
                      {metrics.firstContentfulPaint ? Math.round(metrics.firstContentfulPaint) : 'N/A'}
                      {metrics.firstContentfulPaint ? 'ms' : ''}
                    </p>
                    {metrics.firstContentfulPaint && (
                      <Badge 
                        className={
                          metrics.firstContentfulPaint > 1500 ? 'bg-red-500' : 
                          metrics.firstContentfulPaint > 1000 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }
                      >
                        {metrics.firstContentfulPaint > 1500 ? 'بطيء' : 
                         metrics.firstContentfulPaint > 1000 ? 'متوسط' : 
                         'سريع'}
                      </Badge>
                    )}
                  </div>
                  {metrics.firstContentfulPaint && (
                    <Progress 
                      value={metrics.firstContentfulPaint / 15} 
                      className="h-1 mt-2"
                      style={{
                        backgroundColor: '#444',
                        color: metrics.firstContentfulPaint > 1500 
                          ? '#ef4444' 
                          : metrics.firstContentfulPaint > 1000 
                            ? '#f59e0b' 
                            : '#10b981'
                      }}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">تحليل زمن التحميل</h3>
                <p className="text-sm text-gray-400 mb-4">
                  مقاييس أداء التطبيق مقارنة بالمعايير المثالية:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">وقت التحميل الإجمالي</span>
                      <span className="text-sm">
                        {metrics.loadTime ? Math.round(metrics.loadTime) : 0}ms / {metrics.loadTime > 3000 ? '(بطيء)' : '3000ms'}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.loadTime / 3000) * 100} 
                      className="h-2"
                      style={{
                        backgroundColor: '#444',
                        color: metrics.loadTime > 3000 
                          ? '#ef4444' 
                          : metrics.loadTime > 2000 
                            ? '#f59e0b' 
                            : '#10b981'
                      }}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">DOM Content Loaded</span>
                      <span className="text-sm">
                        {metrics.paintTime ? Math.round(metrics.paintTime) : 0}ms / {metrics.paintTime > 2000 ? '(بطيء)' : '2000ms'}
                      </span>
                    </div>
                    <Progress 
                      value={(metrics.paintTime / 2000) * 100} 
                      className="h-2"
                      style={{
                        backgroundColor: '#444',
                        color: metrics.paintTime > 2000 
                          ? '#ef4444' 
                          : metrics.paintTime > 1000 
                            ? '#f59e0b' 
                            : '#10b981'
                      }}
                    />
                  </div>
                  
                  {metrics.firstContentfulPaint && (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">First Contentful Paint</span>
                        <span className="text-sm">
                          {Math.round(metrics.firstContentfulPaint)}ms / {metrics.firstContentfulPaint > 1500 ? '(بطيء)' : '1500ms'}
                        </span>
                      </div>
                      <Progress 
                        value={(metrics.firstContentfulPaint / 1500) * 100} 
                        className="h-2"
                        style={{
                          backgroundColor: '#444',
                          color: metrics.firstContentfulPaint > 1500 
                            ? '#ef4444' 
                            : metrics.firstContentfulPaint > 1000 
                              ? '#f59e0b' 
                              : '#10b981'
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">عدد عناصر DOM</span>
                      <span className="text-sm">
                        {metrics.domElements.length > 0 ? metrics.domElements[metrics.domElements.length - 1] : 0} / {HEALTH_THRESHOLDS.domElements.warning}
                      </span>
                    </div>
                    <Progress 
                      value={metrics.domElements.length > 0 
                        ? (metrics.domElements[metrics.domElements.length - 1] / HEALTH_THRESHOLDS.domElements.warning) * 100 
                        : 0
                      } 
                      className="h-2"
                      style={{
                        backgroundColor: '#444',
                        color: metrics.domElements.length > 0 && metrics.domElements[metrics.domElements.length - 1] > HEALTH_THRESHOLDS.domElements.critical
                          ? '#ef4444' 
                          : metrics.domElements.length > 0 && metrics.domElements[metrics.domElements.length - 1] > HEALTH_THRESHOLDS.domElements.warning
                            ? '#f59e0b' 
                            : '#10b981'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-4">
              {metrics.resourceCounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* حجم الموارد حسب النوع */}
                  <div>
                    <h3 className="font-medium text-lg mb-3">حجم الموارد (كيلوبايت)</h3>
                    <div className="h-72">
                      <ResponsiveContainer>
                        <BarChart data={metrics.resourceCounts}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                          <XAxis dataKey="type" stroke="#888" tick={{fill: '#888'}} />
                          <YAxis stroke="#888" tick={{fill: '#888'}} />
                          <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
                          <Legend />
                          <Bar 
                            dataKey="totalSize" 
                            name="الحجم (كيلوبايت)" 
                            fill="#39FF14" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* عدد الموارد حسب النوع */}
                  <div>
                    <h3 className="font-medium text-lg mb-3">عدد الملفات</h3>
                    <div className="h-72">
                      <ResponsiveContainer>
                        <BarChart data={metrics.resourceCounts}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                          <XAxis dataKey="type" stroke="#888" tick={{fill: '#888'}} />
                          <YAxis stroke="#888" tick={{fill: '#888'}} />
                          <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#666' }} />
                          <Legend />
                          <Bar 
                            dataKey="count" 
                            name="عدد الملفات" 
                            fill="#8884d8" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* جدول الموارد الأكبر حجماً */}
                  <div className="mt-4 md:col-span-2">
                    <h3 className="font-medium text-lg mb-3">أكبر الموارد حجماً</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-800">
                            <th className="p-2 text-right border border-gray-700">URL</th>
                            <th className="p-2 text-center border border-gray-700">النوع</th>
                            <th className="p-2 text-center border border-gray-700">الحجم (كيلوبايت)</th>
                            <th className="p-2 text-center border border-gray-700">المدة (مللي ثانية)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {metrics.networkRequests
                            .sort((a, b) => b.size - a.size)
                            .slice(0, 10)
                            .map((request, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-950'}>
                                <td className="p-2 border border-gray-700 text-xs">
                                  {request.url.length > 60 
                                    ? request.url.slice(0, 30) + '...' + request.url.slice(-30)
                                    : request.url
                                  }
                                </td>
                                <td className="p-2 border border-gray-700 text-center">{request.type}</td>
                                <td className="p-2 border border-gray-700 text-center">{(request.size / 1024).toFixed(2)}</td>
                                <td className="p-2 border border-gray-700 text-center">{Math.round(request.duration)}</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-800/50 rounded-md">
                  <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-gray-500 mb-2 mx-auto animate-spin" />
                    <p className="text-gray-400">
                      {isMonitoring ? 'جاري جمع بيانات الموارد...' : 'انقر على زر "بدء المراقبة" لبدء جمع معلومات الموارد'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-400">
          {isMonitoring ? 'جاري مراقبة الأداء...' : 'انقر على "بدء المراقبة" لجمع بيانات الأداء'}
        </p>
        <Button
          variant="outline"
          onClick={resetMetrics}
          disabled={isMonitoring || metrics.fps.length === 0}
        >
          إعادة ضبط البيانات
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PerformanceMonitor;