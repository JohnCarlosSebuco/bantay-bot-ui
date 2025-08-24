@echo off
echo Fixing BantayBot UI Dependencies...
echo.

echo Step 1: Cleaning old modules...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
rmdir /s /q .expo 2>nul

echo.
echo Step 2: Installing fresh dependencies...
call npm install

echo.
echo Step 3: Installing missing Babel dependencies...
call npm install @babel/helper-validator-identifier @babel/highlight @babel/code-frame --save-dev

echo.
echo Step 4: Starting Expo...
echo.
echo ========================================
echo App is starting! 
echo On your phone:
echo 1. Open Expo Go app
echo 2. Scan the QR code
echo ========================================
echo.

call npx expo start --lan

pause