@echo off
title Deskelp Backend
echo.
echo  =============================================
echo   Deskelp - Java REST API Backend
echo   Starting on http://localhost:8080/helpdesk-ticket-system
echo  =============================================
echo.
echo  API base URL:
echo    http://localhost:8080/helpdesk-ticket-system/api
echo.
echo  Press Ctrl+C to stop the server.
echo.

"C:\ProgramData\chocolatey\lib\maven\apache-maven-3.10.0\bin\mvn.cmd" cargo:run

pause

