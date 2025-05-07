import { SpaceButton } from "../ui/space-button";

export default function SpaceFooter() {
  return (
    <footer className="pt-12 pb-6 sm:py-12 bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm border-t border-gray-800/50">
      <div className="container mx-auto px-4">
        {/* محتوى تذييل محسّن */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-right">
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center justify-end">
              <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <span>StayX</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              بوابتك للإقامة الفاخرة في أفضل العقارات بالساحل الشمالي وراس الحكمة مع خدمات حصرية وتجربة تقنية متطورة.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse">
              <a href="#" className="space-circuit-pattern bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="space-circuit-pattern bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="space-circuit-pattern bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
              <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>روابط سريعة</span>
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/" className="flex items-center justify-end gap-1">
                  <span>الصفحة الرئيسية</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/properties" className="flex items-center justify-end gap-1">
                  <span>استكشف العقارات</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/services" className="flex items-center justify-end gap-1">
                  <span>خدماتنا</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/about" className="flex items-center justify-end gap-1">
                  <span>من نحن</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
              <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
              <span>الفئات المتميزة</span>
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/properties?category=villas" className="flex items-center justify-end gap-1">
                  <span>الفلل الفاخرة</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/properties?category=chalets" className="flex items-center justify-end gap-1">
                  <span>شاليهات على البحر</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/properties?category=pools" className="flex items-center justify-end gap-1">
                  <span>عقارات بمسابح خاصة</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
              <li className="hover:text-[#39FF14] transition-colors">
                <a href="/properties?category=luxury" className="flex items-center justify-end gap-1">
                  <span>العقارات الاستثنائية</span>
                  <span className="text-[#39FF14]">›</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
              <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>تواصل معنا</span>
            </h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center justify-end gap-2">
                <div>
                  <p>info@stayx.com</p>
                  <p>support@stayx.com</p>
                </div>
                <div className="bg-[#39FF14]/10 p-1 rounded flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div>
                  <p>+20 123 456 789</p>
                  <p>+20 123 456 780</p>
                </div>
                <div className="bg-[#39FF14]/10 p-1 rounded flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* سطر فاصل مع تأثير تكنو فضائي */}
        <div className="relative h-px mb-6">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
          <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#39FF14] transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>
        
        {/* حقوق النشر */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-right">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-bold mb-2">
              <span className="text-[#39FF14]">StayX</span>
              <span className="text-white"> - بوابة الإقامة الفاخرة</span>
            </h3>
          </div>
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} StayX. جميع الحقوق محفوظة.
          </p>
        </div>
        
        {/* زر التحكم الفضائي */}
        <div className="fixed bottom-4 right-4 z-50">
          <SpaceButton 
            variant="hologram" 
            size="icon" 
            className="rounded-full"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            }
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>
      </div>
    </footer>
  );
}