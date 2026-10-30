@echo off
title DANG DAY CODE CRM LEN GITHUB (CrmBookingTravel)
color 0a
cls
cd /d "C:\Users\USER\Documents\antigravity\modest-bohr"
echo ========================================================
echo   BOOKING TRAVEL CRM - DANG DAY CODE LEN GITHUB
echo   Tai khoan: CrmBookingTravel (quangthebui2108@gmail.com)
echo   Kho ma nguon: github.com/CrmBookingTravel/crm.bookingtravel.vn
echo ========================================================
echo.
echo 1. Kiem tra trang thai ma nguon...
git status -s
echo.
echo 2. Dang day toan bo ma nguon len GitHub...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [THANH CONG 100%%] DA DAY TOAN BO MA NGUON LEN GITHUB!
    echo   Vercel quangthebui2108-3134 dang tu dong cap nhat!
    echo ========================================================
) else (
    echo ========================================================
    echo   Co loi xay ra khi day code. Anh kiem tra lai ket noi nhe!
    echo ========================================================
)
echo.
pause
