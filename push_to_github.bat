@echo off
title DANG DAY CODE CRM LEN GITHUB
cls
cd /d "C:\Users\USER\Documents\antigravity\modest-bohr"
echo ========================================================
echo   BOOKING TRAVEL CRM - DANG DAY CODE LEN GITHUB
echo ========================================================
echo.
echo 1. Thu muc:
cd
echo.
echo 2. Kiem tra trang thai:
git status -s
echo.
echo 3. Dang day code len GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [THANH CONG 100%] DA DAY TOAN BO MA NGUON LEN GITHUB!
    echo   Anh quay lai trinh duyet GitHub bam F5 la thay day du nhe!
    echo ========================================================
) else (
    echo ========================================================
    echo   [CHU Y] Neu co bang nho hien len hoi dang nhap:
    echo   Anh bam vao dong chu 'Sign in with your browser'.
    echo ========================================================
)
echo.
pause
