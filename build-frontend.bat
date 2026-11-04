@echo off
title Build Deskelp Frontend
echo.
echo  =============================================
echo   Building React Production Bundle
echo  =============================================
echo.

cd /d "%~dp0frontend"
npm run build

echo.
echo  Build complete! Output in frontend/dist/
pause

