import React from "react";
import { usePerformanceMode, PerformanceMode } from "@/hooks/use-performance-mode";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Zap, Battery, Gauge } from "lucide-react";

/**
 * مكون للتحكم في إعدادات الأداء والرسوم المتحركة
 * يتيح للمستخدم اختيار وضع الأداء المناسب لجهازه
 */
export default function PerformanceControls() {
  const [settings, setMode] = usePerformanceMode();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 border-[#39FF14]/20"
          title="إعدادات الأداء"
        >
          <Gauge className="h-4 w-4 text-[#39FF14]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-lg border-[#39FF14]/20">
        <DialogHeader>
          <DialogTitle className="text-center mb-4 text-white">
            إعدادات الأداء والرسوم المتحركة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#39FF14]">وضع الأداء</h3>
            <p className="text-xs text-gray-400">
              اختر الوضع المناسب لجهازك وتفضيلاتك
            </p>

            <RadioGroup
              value={settings.mode}
              onValueChange={(value) => setMode(value as PerformanceMode)}
              className="grid grid-cols-2 gap-2 pt-2"
            >
              <div>
                <RadioGroupItem
                  value={PerformanceMode.HIGH}
                  id="high"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="high"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-950/50 p-3 hover:bg-gray-800/50 hover:border-[#39FF14]/50 peer-checked:border-[#39FF14] peer-checked:bg-[#39FF14]/10 peer-data-[state=checked]:border-[#39FF14] cursor-pointer text-center"
                >
                  <Zap className="mb-2 h-5 w-5 text-[#39FF14]" />
                  <span className="text-sm font-medium">كامل</span>
                  <span className="text-xs text-gray-400">جميع المؤثرات</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value={PerformanceMode.MEDIUM}
                  id="medium"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="medium"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-950/50 p-3 hover:bg-gray-800/50 hover:border-[#39FF14]/50 peer-checked:border-[#39FF14] peer-checked:bg-[#39FF14]/10 peer-data-[state=checked]:border-[#39FF14] cursor-pointer text-center"
                >
                  <Settings className="mb-2 h-5 w-5 text-[#39FF14]" />
                  <span className="text-sm font-medium">متوسط</span>
                  <span className="text-xs text-gray-400">مؤثرات معتدلة</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value={PerformanceMode.LOW}
                  id="low"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="low"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-950/50 p-3 hover:bg-gray-800/50 hover:border-[#39FF14]/50 peer-checked:border-[#39FF14] peer-checked:bg-[#39FF14]/10 peer-data-[state=checked]:border-[#39FF14] cursor-pointer text-center"
                >
                  <Gauge className="mb-2 h-5 w-5 text-[#39FF14]" />
                  <span className="text-sm font-medium">خفيف</span>
                  <span className="text-xs text-gray-400">أداء أفضل</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value={PerformanceMode.BATTERY}
                  id="battery"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="battery"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-gray-800 bg-gray-950/50 p-3 hover:bg-gray-800/50 hover:border-[#39FF14]/50 peer-checked:border-[#39FF14] peer-checked:bg-[#39FF14]/10 peer-data-[state=checked]:border-[#39FF14] cursor-pointer text-center"
                >
                  <Battery className="mb-2 h-5 w-5 text-[#39FF14]" />
                  <span className="text-sm font-medium">بطارية</span>
                  <span className="text-xs text-gray-400">استهلاك أقل</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#39FF14]">إعدادات متقدمة</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="particles" className="text-sm">تأثيرات الجزيئات</Label>
                  <p className="text-xs text-gray-400">جزيئات متحركة في الخلفية</p>
                </div>
                <Switch
                  id="particles"
                  checked={settings.useParticles}
                  disabled={settings.mode !== PerformanceMode.HIGH}
                  aria-readonly
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="hologram" className="text-sm">تأثيرات الهولوغرام</Label>
                  <p className="text-xs text-gray-400">تأثيرات متقدمة للعناصر</p>
                </div>
                <Switch
                  id="hologram"
                  checked={settings.useHologramEffects}
                  disabled={settings.mode === PerformanceMode.LOW || settings.mode === PerformanceMode.BATTERY}
                  aria-readonly
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations" className="text-sm">رسوم متحركة متقدمة</Label>
                  <p className="text-xs text-gray-400">رسوم وانتقالات مرئية معقدة</p>
                </div>
                <Switch
                  id="animations"
                  checked={settings.useHeavyAnimations}
                  disabled={settings.mode !== PerformanceMode.HIGH}
                  aria-readonly
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="glowing" className="text-sm">تأثيرات التوهج</Label>
                  <p className="text-xs text-gray-400">توهج وتألق للعناصر</p>
                </div>
                <Switch
                  id="glowing"
                  checked={settings.useGlowing}
                  disabled={settings.mode === PerformanceMode.LOW || settings.mode === PerformanceMode.BATTERY}
                  aria-readonly
                />
              </div>
            </div>
          </div>
          
          <div className="bg-[#39FF14]/5 p-3 rounded-md">
            <p className="text-xs text-center text-gray-300">
              اختيار وضع أداء أقل سيحسن من أداء التطبيق، ويقلل من استهلاك البطارية والموارد
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}