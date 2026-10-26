@echo off
chcp 65001 >nul
title BOOKING TRAVEL CRM ERP - KHỞI CHẠY LÀM VIỆC
echo ===================================================================
echo     CÔNG TY TNHH BOOKING TRAVEL - HỆ THỐNG ERP & CRM v4.0
echo     Tài khoản Admin: crm@bookingtravel.vn
echo     Cổng làm việc nội bộ: http://localhost/CRM_Booking.html
echo ===================================================================
echo.

:: 1. Kiểm tra máy chủ Zalo Port 5000
echo [1/3] Kiểm tra dịch vụ Tự Động Hóa Zalo (Port 5000)...
netstat -ano | findstr ":5000" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [THÔNG BÁO] Đang khởi động máy chủ Zalo trên port 5000...
    start "Booking Travel Zalo Server" /min cmd /c "node server.js"
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] Máy chủ Zalo (Port 5000) đang hoạt động!
)

:: 2. Kiểm tra máy chủ Apache Port 80
echo.
echo [2/3] Kiểm tra máy chủ Apache XAMPP (Port 80)...
netstat -ano | findstr ":80" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [CẢNH BÁO] Apache chưa chạy! Đang khởi động XAMPP Apache...
    if exist "E:\xampp_booking\apache_start.bat" (
        start "" /min "E:\xampp_booking\apache_start.bat"
        timeout /t 2 /nobreak >nul
    )
) else (
    echo [OK] Máy chủ Web (Port 80) đang hoạt động!
)

:: 3. Mở trình duyệt làm việc ngay (Dùng Port 5000 để Chrome không bao giờ chặn HTTPS)
echo.
echo [3/3] Đang mở giao diện làm việc CRM trên trình duyệt...
start "" "http://localhost:5000/CRM_Booking.html"

echo.
echo ===================================================================
echo   [SẴN SÀNG LÀM VIỆC] Hệ thống đã mở trên trình duyệt của bạn!
echo   Nhấn phím bất kỳ để đóng cửa sổ thông báo này...
echo ===================================================================
pause >nul
