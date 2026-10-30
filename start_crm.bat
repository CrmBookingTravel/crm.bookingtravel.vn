@echo off
chcp 65001 >nul
title BOOKING TRAVEL CRM ERP - KHỞI CHẠY LÀM VIỆC
echo ===================================================================
echo     CÔNG TY TNHH BOOKING TRAVEL - HỆ THỐNG ERP & CRM
echo     Tài khoản Admin: crm@bookingtravel.vn
echo     Cổng làm việc: http://localhost:3000/CRM_Booking.html
echo ===================================================================
echo.

:: 1. Kiểm tra máy chủ Zalo Port 5000 (nếu cần)
echo [1/2] Kiểm tra dịch vụ Tự Động Hóa (Port 5000)...
netstat -ano | findstr ":5000" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [THÔNG BÁO] Đang khởi động máy chủ nền...
    start "Booking Travel Server" /min cmd /c "node server.js"
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] Máy chủ nền (Port 5000) đang hoạt động!
)

:: 2. Kiểm tra máy chủ Web Port 3000
echo.
echo [2/2] Kiểm tra máy chủ Web (Port 3000)...
netstat -ano | findstr ":3000" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [THÔNG BÁO] Đang khởi động máy chủ Web Port 3000 (npm run dev)...
    start "Booking Travel Web 3000" /min cmd /c "npx serve -l 3000 ."
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] Máy chủ Web (Port 3000) đang hoạt động!
)

:: 3. Mở trình duyệt làm việc ngay
echo.
echo Đang mở giao diện làm việc CRM trên trình duyệt...
start "" "http://localhost:3000/CRM_Booking.html"

echo.
echo ===================================================================
echo   [SẴN SÀNG LÀM VIỆC] Hệ thống đã mở trên trình duyệt của bạn!
echo   Nhấn phím bất kỳ để đóng cửa sổ thông báo này...
echo ===================================================================
pause >nul
