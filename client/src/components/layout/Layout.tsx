import React from "react";
import { BaseLayout } from "./RoleLayouts";

// هذا المكون يستخدم BaseLayout لضمان عدم وجود تكرار في أشرطة التنقل
// وتوحيد واجهة المستخدم في جميع أنحاء التطبيق
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout role="PUBLIC" gradientBackground={false}>
      {children}
    </BaseLayout>
  );
}