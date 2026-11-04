@echo off
title Deskelp Frontend
echo.
echo  =============================================
echo   Deskelp - React (Vite) Frontend
echo   Starting on http://localhost:5173
echo  =============================================
echo.
echo  Connected to Java Backend at:
echo    http://localhost:8080/helpdesk-ticket-system/api
echo.
echo  Press Ctrl+C to stop the frontend dev server.
echo.

cd /d "%~dp0frontend"
npm run dev

pause

