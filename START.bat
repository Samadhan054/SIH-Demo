@echo off
title FloodGuard - Local Dev Servers
echo.
echo  ================================================
echo   FloodGuard - Flash Flood Prediction System
echo   Starting local development servers...
echo  ================================================
echo.

:: Start Backend (port 5000) in a new window
start "FloodGuard Backend :5000" cmd /k "cd /d d:\SIH demo && npm --prefix server run dev"

:: Wait 3 seconds then start Frontend (port 3000) in a new window
timeout /t 3 /nobreak >nul
start "FloodGuard Frontend :3000" cmd /k "cd /d d:\SIH demo && npm --prefix client run dev"

:: Wait then open browser
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo  Both servers started!
echo  Backend  : http://localhost:5000
echo  Frontend : http://localhost:3000
echo.
echo  Login: Flash Flood / 123456789
echo.
pause
