/**
 * @file firebase.ts
 * استخدام التكوين المحسّن من ملف firebase-config.ts لمعالجة مشاكل الاتصال
 */

import { app, auth, db, storage, safeDoc } from './firebase-config';

// تصدير كل شيء
export { app, auth, db, storage, safeDoc };

// التصدير الافتراضي
export default { app, auth, db, storage, safeDoc };