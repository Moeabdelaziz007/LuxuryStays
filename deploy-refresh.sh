#!/bin/bash

echo "🔄 Starting clean deployment process..."

# Clean any existing build files
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .firebase

# Rebuild the application from scratch
echo "🏗️ Building application..."
npm run build

# Verify build output
if [ ! -d "dist/public" ]; then
  echo "❌ Error: dist/public directory not found!"
  exit 1
fi

# Use --no-build to skip the build step since we already built
# Use --force to ignore Firebase caching
echo "🚀 Deploying to Firebase with cache disabled..."
npx firebase deploy --force --non-interactive

echo "✅ Deployment complete!"
echo ""
echo "If changes still don't appear, try:"
echo "1. Clearing your browser cache"
echo "2. Opening the site in an incognito/private window"
echo "3. Trying a different browser"
echo ""