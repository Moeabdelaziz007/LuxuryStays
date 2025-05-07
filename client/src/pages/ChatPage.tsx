import React, { useState } from 'react';
import SpaceChatBot from '@/features/chatbot/SpaceChatBot';
import { motion } from 'framer-motion';

const ChatPage: React.FC = () => {
  const [botName, setBotName] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (botName.trim()) {
      setIsNameSet(true);
    }
  };

  // إذا لم يتم تعيين اسم للروبوت، نعرض نموذج الإدخال
  if (!isNameSet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="stars-container stars-density-high">
            <div className="stars-small"></div>
            <div className="stars-medium"></div>
            <div className="stars-large"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="circuit-lines"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/60 backdrop-blur-xl p-8 rounded-xl border border-[#39FF14]/30 max-w-md w-full shadow-[0_0_30px_rgba(57,255,20,0.3)]"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="text-3xl font-bold">
                <span className="text-[#39FF14] text-shadow-glow">تسمية</span> <span className="text-white">المساعد الرقمي</span>
              </h1>
            </motion.div>
            <p className="text-gray-400 mt-3">
              أنشئ مساعدك الرقمي الشخصي بأسلوب واجهة فضائية. اختر اسمًا مميزًا لمساعدك الذكي.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="botName" className="block text-[#39FF14] font-medium">
                اسم المساعد الرقمي
              </label>
              <input
                id="botName"
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="أدخل اسماً للمساعد الرقمي"
                className="w-full p-3 bg-black/60 border border-[#39FF14]/50 rounded-lg text-white focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-all duration-300"
                required
              />
              <p className="text-xs text-gray-500">
                اختر اسماً يعكس شخصية المساعد الرقمي الخاص بك.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-black border border-[#39FF14] text-[#39FF14] rounded-lg hover:bg-[#39FF14]/10 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10">إنشاء المساعد الرقمي</span>
              <motion.div 
                className="absolute inset-0 bg-[#39FF14]/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
              />
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // إذا تم تعيين اسم للروبوت، نعرض صفحة الشات
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="stars-container stars-density-high">
          <div className="stars-small"></div>
          <div className="stars-medium"></div>
          <div className="stars-large"></div>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="circuit-lines"></div>
      </div>
      
      <header className="bg-black/60 backdrop-blur-xl border-b border-[#39FF14]/20 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                <img src="/assets/bot-avatar.svg" alt="Bot Avatar" className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-bold">
                <span className="text-[#39FF14]">{botName}</span> <span className="text-white">مساعدك الرقمي</span>
              </h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-400 mb-8">
            مرحباً بك في المساعد الرقمي {botName}. يمكنك استخدام هذا المساعد للتحدث ومساعدتك في الإجابة عن أسئلتك المتعلقة بالعقارات والخدمات المتاحة.
          </p>
          
          <SpaceChatBot botNameProp={botName} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;