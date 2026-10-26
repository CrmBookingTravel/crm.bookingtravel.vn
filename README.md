# Hệ Thống Quản Lý Google Sheets Tự Động - Booking Travel (bookingtravel.vn)

Đã kết nối thành công với tài khoản: **`sale.bookingtravel.com.vn@gmail.com`**

---

## 🛠️ Các lệnh quản trị nhanh

### 1. Liệt kê tất cả 119+ file Google Sheets
```bash
npm run manage
```

### 2. Xuất toàn bộ danh sách ra file Excel (CSV) & JSON
```bash
npm run export
```
File được xuất ra:
- `danh_sach_google_sheets.csv` (Mở trực tiếp bằng Microsoft Excel)
- `danh_sach_google_sheets.json`

### 3. Tìm kiếm file bảng tính theo tên
```bash
node search.js "Booking"
node search.js "Tour"
node search.js "DT102026"
```

### 4. Đọc dữ liệu từ bất kỳ file nào (bằng tên file hoặc ID)
```bash
node read.js "DATA_APP QL Booking test"
# Hoặc truyền trực tiếp ID:
node read.js "1NhoyuXJSq_JHvq3teToPPWeWskVKBrHefcg6Z_A6HDg"
```

### 5. Tạo một file Google Sheet mới tinh trong Google Drive
```bash
node create.js "Quản Lý Đơn Tour Mới 2026"
```
