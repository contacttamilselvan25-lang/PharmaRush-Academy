@echo off
title PHARMA RUSH
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js was not found! Install it from https://nodejs.org then run this again.
  pause
  exit /b 1
)

del /q "PHARMA_RUSH_URL.txt" >nul 2>nul

echo Starting PHARMA RUSH server...
start "PHARMA RUSH Server" cmd /c "node server.mjs"

timeout /t 3 /nobreak >nul

set "URL="
if exist "PHARMA_RUSH_URL.txt" set /p URL=<"PHARMA_RUSH_URL.txt"
if "%URL%"=="" set "URL=http://localhost:8123"

start "" "%URL%"
echo Opening %URL% in your browser.
echo If it did not open, copy that address into your browser.
pause