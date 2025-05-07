import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#39FF14] mb-8 text-center">سياسة الخصوصية</h1>
        
        <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm border border-[#39FF14]/10">
          <p className="mb-6 text-gray-300 font-tajawal">
            تم تحديث هذه السياسة في: ١ مايو ٢٠٢٥
          </p>
          
          <div className="space-y-8 font-tajawal text-right">
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">مقدمة</h2>
              <p className="text-gray-300 leading-relaxed">
                نحن في StayX نلتزم بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع المعلومات الشخصية واستخدامها عند استخدام منصتنا لحجز العقارات الفاخرة.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">المعلومات التي نجمعها</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                نجمع المعلومات التي تقدمها لنا مباشرة، مثل:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>معلومات الحساب (الاسم، البريد الإلكتروني، رقم الهاتف)</li>
                <li>معلومات الدفع (يتم معالجتها بشكل آمن عبر بوابات دفع معتمدة)</li>
                <li>تفضيلات الحجز والإقامة</li>
                <li>المراسلات معنا</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">كيفية استخدام المعلومات</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                نستخدم المعلومات التي نجمعها لأغراض تشمل:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>توفير خدمات الحجز وإدارة الحساب</li>
                <li>معالجة المدفوعات وإرسال الإيصالات</li>
                <li>التواصل حول الحجوزات والعروض</li>
                <li>تحسين تجربتك على منصتنا</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">الاتصال بنا</h2>
              <p className="text-gray-300 leading-relaxed">
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يرجى التواصل معنا على البريد الإلكتروني: privacy@stayx.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}