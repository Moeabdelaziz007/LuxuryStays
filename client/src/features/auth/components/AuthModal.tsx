import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useTranslation } from "@/features/i18n/hooks/useTranslation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-effect border-accent/30 sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-poppins">
            {activeTab === 'login' ? t('auth.login') : t('auth.register')}
            <span className="text-accent">.</span>
          </DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        <DialogDescription>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={onClose} />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t('auth.noAccount')}{' '}
                  <button 
                    onClick={() => setActiveTab('register')} 
                    className="text-accent hover:underline"
                  >
                    {t('auth.register')}
                  </button>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={onClose} />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {t('auth.haveAccount')}{' '}
                  <button 
                    onClick={() => setActiveTab('login')} 
                    className="text-accent hover:underline"
                  >
                    {t('auth.login')}
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
