#!/bin/bash

echo "🚀 Starting BantayBot Monitor App..."
echo ""
echo "📦 Installing dependencies for SDK 53..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "📱 Starting Expo server..."
npx expo start --lan

# If that fails, try:
# npx expo start