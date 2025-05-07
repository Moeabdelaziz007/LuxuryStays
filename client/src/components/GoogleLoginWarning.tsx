import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy, ExternalLink } from "lucide-react";

export default function GoogleLoginWarning() {
  const currentDomain = window.location.host;
  
  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    alert('تم نسخ النطاق إلى الحافظة!');
  };
  
  return (
    <Card className="mx-auto max-w-md bg-gray-900/90 border-red-800/50 text-white">
      <CardHeader className="bg-red-900/40 border-b border-red-800/20">
        <CardTitle className="flex items-center gap-2 text-red-300">
          <AlertCircle className="h-5 w-5" />
          تسجيل الدخول بواسطة Google غير متاح
        </CardTitle>
        <CardDescription className="text-gray-300">
          تم اكتشاف مشكلة في نطاق مصادقة Firebase
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 text-sm text-gray-200">
        <p className="mb-4">
          النطاق الحالي غير مصرح به في إعدادات مصادقة Firebase. هذه مشكلة شائعة في بيئات التطوير مثل Replit حيث تتغير النطاقات بين الجلسات.
        </p>
        <p className="font-bold mb-2 text-white">يجب إضافة النطاق الحالي:</p>
        <div className="bg-gray-800 p-3 rounded-md mb-4 font-mono text-xs text-green-400 break-all">
          {currentDomain}
        </div>
        <h3 className="text-white font-semibold mb-2">How to fix this:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300">
          <li>Copy the domain above</li>
          <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Firebase Console</a></li>
          <li>Select your project: <span className="text-amber-400">stay-chill-e3743</span></li>
          <li>Navigate to: Authentication → Settings → Authorized domains</li>
          <li>Click "Add domain" and paste the copied domain</li>
          <li>Save and refresh this page</li>
        </ol>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <Button 
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
          onClick={handleCopyDomain}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Domain
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Firebase Console
        </Button>
      </CardFooter>
    </Card>
  );
}