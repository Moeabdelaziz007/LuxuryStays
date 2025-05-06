#!/bin/bash

# بناء التطبيق
echo "Building the application..."
npm run build

# تسجيل الدخول إلى Firebase (إذا لم تكن مسجلاً الدخول بالفعل)
# قم بتعليق هذا السطر إذا كنت قد سجلت الدخول بالفعل
# echo "Logging in to Firebase..."
# npx firebase login

# نشر التطبيق على Firebase
echo "Deploying to Firebase..."
npx firebase deploy

echo "Deployment complete!"