# 🏨 CÔNG TY TNHH BOOKING TRAVEL - HỆ THỐNG ERP & CRM LỮ HÀNH v4.0

> **Nền Tảng Quản Trị Doanh Nghiệp Lữ Hành, Kế Toán Thuế & Hóa Đơn GTGT, Điều Hành Nghỉ Dưỡng Chuyên Nghiệp, Kiểm Soát Dòng Tiền & Tự Động Hóa Phát Tin Nhóm Zalo**

[![Website](https://img.shields.io/badge/Official_Website-bookingtravel.vn-blue?style=for-the-badge&logo=googlechrome)](https://bookingtravel.vn)
[![CRM System](https://img.shields.io/badge/CRM_System-crm.bookingtravel.vn-indigo?style=for-the-badge&logo=airplay)](https://crm.bookingtravel.vn)
[![ERP Version](https://img.shields.io/badge/Version-4.0.0_Enterprise-emerald?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/License-Proprietary-rose?style=for-the-badge)](https://github.com)

---

## 📌 1. TỔNG QUAN DOANH NGHIỆP & HỆ THỐNG

**Công ty TNHH Booking Travel** là doanh nghiệp lữ hành chuyên phân phối bán buôn và bán lẻ các dòng sản phẩm du lịch cao cấp:
- 🏨 **Phòng Khách Sạn & Resort:** Vinpearl Toàn Quốc, Amaya Retreat Sóc Sơn, King Town Grand Nha Trang, Rova Hotel, Dalat Villas, FLC Sầm Sơn/Quy Nhơn...
- ✈️ **Combo Du Lịch Trọn Gói:** Vé máy bay khứ hồi + Phòng khách sạn / Resort + Xe đón tiễn sân bay.
- 🚩 **Tour Ghép Đoàn & Tour Doanh Nghiệp (GIT/FIT):** Teambuilding, hội nghị khách hàng, gala dinner.
- 🎟️ **Vé Vui Chơi & Cáp Treo:** Sun World Fansipan / Bà Nà Hills, VinWonders & Safari Nha Trang / Phú Quốc.

Hệ thống **Booking Travel ERP v4.0** giải quyết triệt để bài toán: kết nối 119 Google Sheets bảng tính, kế toán hạch toán lãi lỗ tức thời, quản trị dòng tiền công ty, kiểm soát hóa đơn VAT đầu vào/đầu ra, phân quyền nhân sự chặt chẽ và tự động hóa phát tin tiếp thị đến các đại lý/CTV qua Zalo.

---

## 🚀 2. CÁC PHÂN HỆ CỐT LÕI (CORE MODULES)

### 📊 Phân hệ 1: Kế Toán Quản Trị & Báo Cáo P&L Real-time
- **Theo dõi chỉ số tài chính tức thời:** Tổng Doanh thu, Chi phí Giá vốn (COGS), Lợi nhuận gộp thực thu, Tỷ suất lợi nhuận gộp (%).
- **Báo cáo Lãi/Lỗ theo từng dịch vụ & đối tác:** Tính toán biên độ lợi nhuận theo từng đơn hàng.
- **Hóa Đơn Đầu Vào (NCC / Khách sạn):** Cảnh báo 🔴 `Cần Đòi HĐ!` vs 🟢 `Đã Có HĐ`. Nút 1-chạm sao chép mẫu tin nhắn Zalo gửi kế toán khách sạn đòi hóa đơn GTGT.
- **Hóa Đơn Đầu Ra (Khách hàng / Công ty):** Quản lý trạng thái xuất hóa đơn, lưu trữ MST, tên pháp nhân và email nhận HĐĐT.
- **Kho File Chứng Từ (File Vault):** Tải lên và lưu trữ lâu dài file PDF hóa đơn điện tử, XML, hình ảnh ủy nhiệm chi ngân hàng trên máy chủ (`upload.php`).
- **Xuất dữ liệu hóa đơn GTGT:** Xuất báo cáo bảng kê hóa đơn CSV/Excel tương thích 100% cho phần mềm kế toán và kê khai thuế.

---

### 📈 Phân hệ 2: Báo Cáo & Điều Hành Lữ Hành Chuyên Nghiệp (Booking Travel)
- **Chuẩn hóa vòng đời 5 bước của Booking:**
  `Mới tạo / Chờ cọc` ➔ `Đã cọc` ➔ `Đã chốt code phòng/vé với NCC` ➔ `Đang check-in / Đi tour` ➔ `Hoàn tất & Quyết toán`.
- **Cơ cấu Doanh thu & Dịch vụ:** Biểu đồ thanh trực quan phân tích tỷ trọng giữa *Khách sạn/Resort*, *Combo du lịch*, *Tour trọn gói*, và *Vé vui chơi*.
- **Đối soát Công nợ 2 chiều (Two-Way Debt Balance):**
  - *Công nợ phải thu (AR):* Nhắc nhở thu đủ tiền trước ngày khách lên đường.
  - *Công nợ phải trả (AP):* Cảnh báo các khoản cần chuyển tiền trước giờ G để tránh bị khách sạn hủy code phòng.
- **Đánh giá & Xếp hạng Nhà cung cấp (Suppliers Rating):** Đo lường đối tác nào mang lại doanh thu cao nhất, biên lợi nhuận tốt nhất và tỷ lệ trả hóa đơn VAT đầy đủ nhất.

---

### 🎯 Phân hệ 2.1: Phân Chia KPI Theo Ngày • Tuần • Tháng & Tiếp Lửa Sales ("CỐ LÊN!")
- **Phân rã đa chu kỳ linh hoạt:**
  - 📅 **Hôm Nay (Ngày):** Chỉ tiêu ngày = `Chỉ tiêu tháng / 26` ngày công (~7.69M/ngày). Phát hiện ngay nhân viên chưa chốt đơn trong ngày.
  - 📆 **Tuần Này:** Chỉ tiêu tuần = `Chỉ tiêu tháng / 4` (~50M/tuần).
  - 📊 **Tháng Này:** Chỉ tiêu chuẩn 200M/tháng cho mỗi chiến binh Sales.
  - ⚡ **Tổng Hợp 3 Chu Kỳ (Matrix):** Hiển thị trực quan cùng lúc cả 3 cột tiến độ Ngày - Tuần - Tháng kèm mã màu cảnh báo.
- **Thanh Sức Khỏe KPI & Cảnh Báo Tiếp Sức:**
  - 🏆 *Chiến binh về đích:* Tôn vinh các nhân sự đạt từ 100% KPI.
  - ⚡ *Cần nhắc "CỐ LÊN!":* Thống kê ngay các bạn đang chậm nhịp để lãnh đạo hỗ trợ kịp thời.
- **Hệ thống Gửi Lời Động Viên Cá Nhân Hóa (1-Click Zalo):**
  - Nút **"Nhắc: Cố lên!"** sinh tin nhắn truyền cảm hứng kèm số liệu thiếu hụt cụ thể, mở trực tiếp chat Zalo với Sales.
  - Nút **"Gửi Tin Động Viên Toàn Đội"** xuất bản tin tiếp lửa thi đua vào nhóm Zalo chung của công ty.

---

### 🏨 Phân hệ 2.2: Tự Động Điền Hạng Phòng & Báo Khách (Google Sheets)
- **Kết nối Trực Tiếp Master Sheet:** [BẢNG GIÁ - BOOKING TRAVEL](https://docs.google.com/spreadsheets/d/14nJMWVR75XOnVd_GpoE3LHELNFVok3KRc4FHk-yMSj4/edit?gid=0#gid=0).
- **Cơ chế Gợi Ý & Điền Tự Động (Auto-fill):** Khi nhập Booking, Sales chỉ cần gõ tên khách sạn hoặc hạng phòng (Amaya, King Town, Rova, Deluxe, Standard, Vinpearl...), hệ thống tự động điền 100% dữ liệu:
  - *Tên Dịch Vụ / Lộ Trình*
  - *Tên Đối Tác / Nhà Cung Cấp*
  - *Giá Báo Khách (Giá Bán)*
  - *Giá Vốn (Net)*
  - *Nhóm Dịch Vụ (Hotel / Combo / Tour / Ticket)*
- **Không bao giờ phải gõ lại bằng tay** (*"khỏi mất công đánh lại"*).
- **Tra Cứu Bảng Giá & Tạo Báo Giá Zalo 1-Click:** Mở nhanh danh mục phòng toàn quốc, lọc theo khu vực và sao chép mẫu báo giá sang trọng gửi ngay cho khách hàng.

---

### 💰 Phân hệ 3: Quản Trị Dòng Tiền Toàn Công Ty (Cash Flow Statement)
- **Kiểm soát dòng tiền thực tế:**
  - 📥 **Dòng Tiền Vào (Cash Inflow):** Tiền thực tế khách & CTV đã thanh toán/cọc.
  - 📤 **Dòng Tiền Ra (Outflow):** Tiền thực tế công ty đã thanh toán cho các khách sạn/đối tác.
  - 💵 **Dòng Tiền Thuần (Net Operating Cash Flow):** `Inflow - Outflow` (thặng dư tiền mặt hoạt động).
  - 🏦 **Số Dư Ngân Hàng Khả Dụng:** Đối soát tài khoản Techcombank & MB Bank.
- **Nhật ký Thu - Chi:** Thống kê chi tiết từng giao dịch theo mã booking và trạng thái quyết toán.

---

### 👥 Phân hệ 4: Nhân Sự, Phân Quyền & Bắt Buộc Thông Tin
- **Danh sách 11 tài khoản cài sẵn:**
  - `crm@bookingtravel.vn` (Ban Giám Đốc - Toàn quyền quản trị)
  - `sales1@bookingtravel.vn` đến `sales10@bookingtravel.vn` (Đội ngũ kinh doanh)
  - **Mật khẩu mặc định bàn giao:** `123456`
  - **Quỹ tiền tạm ứng bàn giao:** `1.000.000 đ` / nhân viên để giữ chỗ & cọc nhanh dịch vụ.
- **Cơ chế Bắt Buộc Thông Tin Cá Nhân:**
  - Nhân viên khi đăng nhập **bắt buộc phải nhập đủ 3 thông tin**:
    1. **Họ và tên thật** (theo CCCD)
    2. **Ngày tháng năm sinh** (bắt buộc đúng ngày sinh để quản lý nhân sự)
    3. **Số điện thoại liên hệ** (SĐT Zalo để nhận việc)
  - Hệ thống sẽ khóa màn hình làm việc cho đến khi nhân viên hoàn tất thông tin cá nhân.
- **Phân quyền linh hoạt (RBAC):** Ban Giám Đốc có thể bật/tắt quyền xem dòng tiền công ty, quyền xem đơn của đồng nghiệp hay chỉ xem đơn cá nhân, quyền xem giá vốn và quyền xóa đơn.

---

### 📢 Phân hệ 5: Trạm Tự Động Hóa Phát Tin 13 Nhóm Zalo
- Điều khiển Chrome thông qua Puppeteer và Chromium Engine độc lập.
- Quét mã QR trực tiếp trên màn hình Dashboard ([http://localhost:5000](http://localhost:5000)).
- Phát tin đồng loạt tới 13 nhóm Zalo đối tác và CTV (~10.000 thành viên) với cơ chế chống quét spam thông minh (độ trễ 5-10 giây giữa các nhóm).

---

### 📑 Phân hệ 6: Quản Lý & Đồng Bộ 119 Google Sheets
- Kết nối thông qua standalone Google Apps Script Web App API Proxy.
- Quản lý tập trung 119 bảng tính trong Google Drive: tìm kiếm, đọc dữ liệu, thêm mới dữ liệu, xuất danh mục ra CSV và JSON.

---

## 📁 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
├── index.html                   # Giao diện CRM chính (hỗ trợ cả GitHub Pages và Web Server)
├── crm.html                     # Bản sao độc lập của CRM Enterprise v4.0
├── server.js                    # Server Node.js Express điều hành & phát tin Zalo (Port 5000)
├── zalo-bot.js                  # Bot Puppeteer tự động hóa Zalo & chụp mã QR
├── zalo-groups.json             # Cấu hình danh sách 13 link nhóm Zalo đối tác
├── upload.php                   # Script PHP tiếp nhận và xử lý upload file hóa đơn / chứng từ
├── apps-script-manager.js       # Quản trị viên Google Apps Script API kết nối 119 Sheets
├── manager-client.js            # Node client quản lý 119 Google Sheets
├── export-list.js               # Script xuất danh mục 119 Sheets ra CSV & JSON
├── package.json                 # Cấu hình dự án Node.js & dependencies
├── .gitignore                   # Loại trừ các file nhạy cảm, cache, zalo_profile, uploads
└── public/                      # Thư mục web client cho Server Port 5000
    ├── crm.html                 # Giao diện CRM đồng bộ
    ├── index.html               # Bảng điều khiển Giám đốc & trạm phát tin Zalo
    └── upload.php               # Script upload phục vụ máy chủ web
```

---

## ⚙️ 4. HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH

### 1. Yêu cầu môi trường
* **Hệ điều hành:** Windows 10/11 hoặc Linux Server / VPS
* **Node.js:** Phiên bản 18+ trở lên
* **Máy chủ Web:** Máy chủ tĩnh Node.js / Vercel / GitHub Pages (hoàn toàn độc lập, không cần XAMPP)

### 2. Cài đặt các gói phụ thuộc & Khởi chạy máy chủ Web (Port 3000)
```bash
# Khởi chạy máy chủ Web CRM (Port 3000):
npm run dev
```
Truy cập hệ thống CRM tại:
👉 **[http://localhost:3000/CRM_Booking.html](http://localhost:3000/CRM_Booking.html)** (Hoặc: http://localhost:3000/)

### 4. Vận hành Trạm Phát Tin Tự Động Zalo (Port 5000)
```bash
npm start
# Hoặc: node server.js
```
Truy cập giao diện điều khiển Zalo tại:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🔐 5. BÀN GIAO TÀI KHOẢN MẪU

| Chức Vụ | ID Đăng Nhập (Email) | Mật Khẩu Bàn Giao | Quỹ Tiền Tạm Ứng | Quyền Hạn |
| :--- | :--- | :---: | :---: | :--- |
| **Ban Giám Đốc** | `crm@bookingtravel.vn` | `123456` | 247.800.000 đ | **Toàn Quyền Quản Trị & Dòng Tiền** |
| **Sales 1 (Kiều)** | `sales1@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 2 (Hồng)** | `sales2@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 3 (Quang)** | `sales3@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 4 (Linh)** | `sales4@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 5 (Hảo)** | `sales5@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 6 (Thắng)**| `sales6@bookingtravel.vn` | `123456` | 1.000.000 đ | Kinh doanh & Quản lý đơn riêng |
| **Sales 7 ➔ 10** | `sales7@...` đến `sales10@...` | `123456` | 1.000.000 đ | *Bắt buộc nhập Họ tên, Ngày sinh, SĐT* |

---

## 🏢 THÔNG TIN PHÁP NHÂN
* **Đơn vị chủ quản:** CÔNG TY TNHH BOOKING TRAVEL
* **Tên quốc tế:** BOOKING TRAVEL COMPANY LIMITED
* **Website:** [https://bookingtravel.vn](https://bookingtravel.vn)
* **Cổng CRM:** [https://crm.bookingtravel.vn](https://crm.bookingtravel.vn)
* **Email quản trị:** `crm@bookingtravel.vn`
* **Hotline:** 0846 477 222
