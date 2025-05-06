#!/bin/bash

# سيناريو تهيئة Firebase
echo "تهيئة مشروع Firebase..."

# تسجيل الدخول إلى Firebase
echo "تسجيل الدخول إلى Firebase..."
npx firebase login

# تهيئة Firebase
echo "تهيئة Firebase Hosting..."
npx firebase init hosting

echo "تم الانتهاء من تهيئة Firebase!"
echo "يرجى التأكد من أن معرف المشروع في ملف .firebaserc هو: stay-chill-e3743"
echo "الآن يمكنك تشغيل ./firebase-deploy.sh لنشر التطبيق"