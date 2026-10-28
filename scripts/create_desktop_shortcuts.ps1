$desktop = "C:\Users\USER\OneDrive\Desktop"
$wsh = New-Object -ComObject WScript.Shell

# 1. Shortcut to Uploads Folder (Kho Du Lieu Chung Tu & Hoa Don)
$lnk1 = $wsh.CreateShortcut("$desktop\KHO DU LIEU CHUNG TU & HOA DON.lnk")
$lnk1.TargetPath = "E:\xampp_booking\htdocs\uploads"
$lnk1.Description = "Kho luu tru file chung tu, hoa don dien tu, voucher tren may tinh"
$lnk1.IconLocation = "shell32.dll,4"
$lnk1.Save()

# 2. Shortcut to Root Htdocs Folder
$lnk2 = $wsh.CreateShortcut("$desktop\THU MUC GOC CRM (HTDOCS).lnk")
$lnk2.TargetPath = "E:\xampp_booking\htdocs"
$lnk2.Description = "Thu muc goc web CRM Booking Travel"
$lnk2.IconLocation = "shell32.dll,3"
$lnk2.Save()

# 3. URL Shortcut to CRM Pro
$url1 = "$desktop\CRM PRO - GIAO DIEN MOI.url"
@"
[InternetShortcut]
URL=http://localhost/CRM_Pro.html
IconIndex=0
IconFile=C:\Windows\System32\shell32.dll
"@ | Set-Content -Path $url1 -Encoding UTF8

# 4. URL Shortcut to Full CRM ERP
$url2 = "$desktop\CRM BOOKING TRAVEL - BAN DAY DU.url"
@"
[InternetShortcut]
URL=http://localhost/CRM_Booking.html
IconIndex=0
IconFile=C:\Windows\System32\shell32.dll
"@ | Set-Content -Path $url2 -Encoding UTF8

Write-Host ">>> COMPLETED: All desktop shortcuts created successfully! <<<"
