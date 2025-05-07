#!/bin/bash

# بناء التطبيق مع تنظيف مسبق
echo "Cleaning previous build..."
rm -rf dist

echo "Building the application..."
npm run build

# التأكد من وجود المجلدات المطلوبة
echo "Verifying build output..."
if [ ! -d "dist/public" ]; then
  echo "Error: dist/public directory not found!"
  exit 1
fi

# نشر التطبيق على Firebase مع خيار عدم استخدام الذاكرة المؤقتة
echo "Deploying to Firebase (with cache disabled)..."
npx firebase deploy --non-interactive --force

echo "Deployment complete!"