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

# نسخ ملف 404.html إلى مجلد dist/public
echo "Copying 404.html to dist/public..."
cp client/public/404.html dist/public/

# إنشاء redirects.json لمعالجة المسارات مباشرة
echo "Creating redirects configuration..."
cat > dist/public/redirects.json << EOL
{
  "redirects": [
    {
      "source": "/customer{,/**}",
      "destination": "/index.html",
      "type": 301
    },
    {
      "source": "/property-admin{,/**}",
      "destination": "/index.html",
      "type": 301
    },
    {
      "source": "/super-admin{,/**}",
      "destination": "/index.html",
      "type": 301
    }
  ]
}
EOL

# نشر التطبيق على Firebase مع خيار عدم استخدام الذاكرة المؤقتة
echo "Deploying to Firebase (with cache disabled)..."
npx firebase deploy --non-interactive --force

echo "Deployment complete!"