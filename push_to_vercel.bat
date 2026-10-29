@echo off
title DANG DAY CODE LEN VERCEL (BOOKINGTRAVELVN)
color 0a
cls
cd /d "C:\Users\USER\Documents\antigravity\modest-bohr"
echo ========================================================
echo   BOOKING TRAVEL CRM - DANG DAY CODE LEN VERCEL
echo ========================================================
echo.
echo 1. Kiem tra trang thai ma nguon...
git status -s
echo.
echo 2. Dang ket noi toi kho: github.com/bookingtravelvn/crm.bookingtravel.vn ...
echo.
echo    [CHU Y] Mot cua so nho se hien len de dang nhap GitHub:
echo    - Anh bam chu: 'Sign in with your browser'
echo    - Trinh duyet Chrome se mo ra, anh bam nut xanh 'Authorize GitCredentialManager'
echo    - Sau do cua so nay se tu dong day 100%% code len Vercel!
echo.
git push -u https://github.com/bookingtravelvn/crm.bookingtravel.vn.git main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [THANH CONG 100%%] DA DAY TOAN BO CODE MOI LEN VERCEL!
    echo   Trang https://crm.bookingtravel.vn dang tu dong cap nhat!
    echo ========================================================
) else (
    echo ========================================================
    echo   Neu chua day duoc, anh thu bam lai nhe.
    echo ========================================================
)
echo.
pause
