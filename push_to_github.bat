@echo off
chcp 65001 >nul
echo ========================================================
echo   BOOKING TRAVEL ERP - ĐẨY MÃ NGUỒN LÊN GITHUB
echo   Kho chứa: https://github.com/CrmBookingTravel/crm.bookingtravel.vn.git
echo ========================================================
echo.
echo Đang kết nối và đẩy mã nguồn lên nhánh main...
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   [THÀNH CÔNG] Đã đẩy toàn bộ hệ thống lên GitHub!
    echo   Xem tại: https://github.com/CrmBookingTravel/crm.bookingtravel.vn
    echo ========================================================
) else (
    echo.
    echo [LƯU Ý] Nếu GitHub yêu cầu đăng nhập, vui lòng chọn 'Sign in with your browser' trên cửa sổ vừa mở.
)
echo.
pause
