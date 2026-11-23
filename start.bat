@echo off
title EasyDine - Food Ordering System Launcher
echo ====================================================
echo Starting EasyDine Backend & Frontend Servers...
echo ====================================================

start "EasyDine Backend API (Port 5000)" cmd /k "cd backend && npm start"
start "EasyDine Frontend React (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are launching!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Opening http://localhost:5173 in your default browser...
timeout /t 3 >nul
start http://localhost:5173

