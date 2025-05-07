import React from "react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#39FF14] mb-8 text-center">الشروط والأحكام</h1>
        
        <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm border border-[#39FF14]/10">
          <p className="mb-6 text-gray-300 font-tajawal">
            تم تحديث هذه الشروط في: ١ مايو ٢٠٢٥
          </p>
          
          <div className="space-y-8 font-tajawal text-right">
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">المقدمة</h2>
              <p className="text-gray-300 leading-relaxed">
                تحدد هذه الشروط والأحكام اتفاقية قانونية بينك وبين StayX بخصوص استخدام خدماتنا. باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">خدمات الحجز</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                توفر StayX منصة تتيح للمستخدمين البحث وحجز إقامات في عقارات فاخرة. عند إجراء الحجز من خلال منصتنا:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>يجب تقديم معلومات دقيقة وكاملة</li>
                <li>تخضع الحجوزات لسياسات الإلغاء والاسترداد المحددة لكل عقار</li>
                <li>قد تكون هناك رسوم إضافية لخدمات معينة</li>
                <li>نحتفظ بالحق في رفض أي حجز وفقًا لتقديرنا</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">استخدام المنصة</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                عند استخدام منصة StayX، يجب عليك:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>عدم انتهاك أي قوانين معمول بها</li>
                <li>عدم إساءة استخدام المنصة أو التلاعب بها</li>
                <li>عدم انتهاك خصوصية الآخرين</li>
                <li>الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">سياسة الإلغاء والاسترداد</h2>
              <p className="text-gray-300 leading-relaxed">
                تختلف سياسات الإلغاء والاسترداد حسب كل عقار. يرجى مراجعة سياسة الإلغاء المحددة قبل إتمام الحجز. بشكل عام:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mr-4">
                <li>الإلغاء قبل 30 يومًا من تاريخ الوصول: استرداد كامل</li>
                <li>الإلغاء قبل 14 يومًا من تاريخ الوصول: استرداد 50%</li>
                <li>الإلغاء بعد ذلك: لا يوجد استرداد</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-[#39FF14] mb-4">الاتصال بنا</h2>
              <p className="text-gray-300 leading-relaxed">
                إذا كانت لديك أي أسئلة حول شروط الاستخدام الخاصة بنا، يرجى التواصل معنا على البريد الإلكتروني: terms@stayx.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}