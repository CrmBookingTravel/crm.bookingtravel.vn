const express = require('express');
const path = require('path');
const fs = require('fs');
const { readSheetData } = require('./manager-client');
const zaloBot = require('./zalo-bot');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GROUPS_FILE = path.join(__dirname, 'zalo-groups.json');

// Cache dữ liệu thống kê
let cachedStats = null;
let lastStatsFetch = 0;

// ==========================================
// 1. API THỐNG KÊ DOANH THU & ĐƠN HÀNG (GIÁM ĐỐC)
// ==========================================
app.get('/api/stats', async (req, res) => {
  try {
    const now = Date.now();
    // Cache 60 giây để không spam request
    if (cachedStats && (now - lastStatsFetch < 60000)) {
      return res.json({ success: true, ...cachedStats });
    }

    // Đọc từ file DATA_APP QL Booking
    const rows = await readSheetData('1mGCk6DaEh1h512v0G7IyYkKFkU0EJT-AE2ceylp7_20');
    if (!rows || rows.length < 2) {
      return res.json({ success: false, error: 'Không đọc được dữ liệu booking' });
    }

    const dataRows = rows.slice(1);
    let totalCost = 0;
    let totalRevenue = 0;
    let totalProfit = 0;
    let validCount = 0;

    const salesMap = {};
    const recentOrders = [];

    dataRows.forEach((r, idx) => {
      const cost = parseFloat(r[6]) || 0;
      const rev = parseFloat(r[7]) || 0;
      const profit = parseFloat(r[8]) || (rev - cost);
      const saleEmail = (r[16] || 'Chưa phân bổ').trim();
      const customer = r[4] || 'Khách vãng lai';
      const orderCode = r[17] || `DH-${idx}`;
      const checkin = r[1] ? r[1].toString().substring(0, 10) : '';

      if (rev > 0) {
        totalCost += cost;
        totalRevenue += rev;
        totalProfit += profit;
        validCount++;

        if (!salesMap[saleEmail]) {
          salesMap[saleEmail] = { email: saleEmail, count: 0, revenue: 0, profit: 0 };
        }
        salesMap[saleEmail].count++;
        salesMap[saleEmail].revenue += rev;
        salesMap[saleEmail].profit += profit;

        if (recentOrders.length < 15) {
          recentOrders.push({
            orderCode,
            customer,
            checkin,
            revenue: rev,
            profit,
            saleEmail
          });
        }
      }
    });

    const topSales = Object.values(salesMap).sort((a, b) => b.revenue - a.revenue);

    cachedStats = {
      totalBookings: dataRows.length,
      validBookings: validCount,
      totalRevenue,
      totalCost,
      totalProfit,
      marginPercent: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0,
      topSales,
      recentOrders
    };
    lastStatsFetch = now;

    res.json({ success: true, ...cachedStats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. API QUẢN LÝ 12 NHÓM ZALO
// ==========================================
app.get('/api/groups', (req, res) => {
  try {
    if (fs.existsSync(GROUPS_FILE)) {
      const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf-8'));
      res.json({ success: true, groups });
    } else {
      res.json({ success: true, groups: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/groups', (req, res) => {
  try {
    const { groups } = req.body;
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2), 'utf-8');
    res.json({ success: true, message: 'Đã lưu danh sách nhóm Zalo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. API ĐIỀU KHIỂN ZALO ROBOT
// ==========================================
app.get('/api/zalo/qr', async (req, res) => {
  try {
    const result = await zaloBot.getQRCode();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/zalo/status', async (req, res) => {
  try {
    const result = await zaloBot.checkLoginStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/zalo/broadcast', async (req, res) => {
  const { message, groups } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Nội dung tin nhắn không được để trống' });
  }

  // Kiểm tra đăng nhập trước khi cho phép chạy
  const status = await zaloBot.checkLoginStatus();
  if (!status.isLoggedIn) {
    return res.status(400).json({
      success: false,
      error: 'Zalo chưa đăng nhập! Giám đốc vui lòng bấm nút "1. Mở Zalo Quét QR" ở góc trên bên phải để quét mã đăng nhập trước nhé.'
    });
  }

  // Chạy broadcast
  zaloBot.startBroadcast(groups, message).catch(err => {
    console.error('Lỗi broadcast:', err);
  });

  res.json({ success: true, message: 'Đã kích hoạt tiến trình phát tin đồng loạt!' });
});

app.get('/api/zalo/broadcast-status', (req, res) => {
  res.json(zaloBot.getBroadcastStatus());
});

// Mẫu bài đăng tự động chuẩn văn phong Travel Agency
app.get('/api/zalo/deal-template', (req, res) => {
  const template = `🔥✨ BẢNG DEAL HOT GIÁ SỈ CTV HÔM NAY - BOOKING TRAVEL ✨🔥
(Áp dụng độc quyền cho hệ thống 12 Nhóm CTV & Đại lý)

🏝️ 1. VINPEARL NHA TRANG RESORT & SPA 5⭐
👉 Quỹ phòng Commit giá bao toàn thị trường:
- Deluxe Ocean View: chỉ từ 1.xxx.000đ/đêm (Bao gồm ăn sáng buffet)
- Combo 3N2Đ + Vé Cáp Treo VinWonders không giới hạn: chỉ 2.xxx.000đ/khách

🌲 2. AMAYA RETREAT SÓC SƠN - NGHỈ DƯỠNG RIÊNG TƯ
- Không gian biệt lập, rừng thông yên tĩnh
- Giá CTV độc quyền mùa thấp điểm: Giảm 25% cho booking đặt trong tuần

🏡 3. HỆ THỐNG VILLA ĐÀ LẠT NGUYÊN CĂN (4 - 8 PHÒNG NGỦ)
- Phù hợp khách đoàn gia đình, view thung lũng săn mây
- Đầy đủ BBQ, sân vườn riêng
- Giá sỉ hỗ trợ CTV chốt đơn: Chỉ từ 3.xxx.000đ/căn/đêm

----------------------------------
📌 CHÍNH SÁCH ĐẶC QUYỀN CTV:
✅ Giữ phòng nhanh trong 30 phút
✅ Chiết khấu hoa hồng trực tiếp trên từng booking
✅ Hỗ trợ xuất VAT công ty đầy đủ

📞 HOTLINE ĐIỀU HÀNH / CHECK PHÒNG: 09xx.xxx.xxx (Ms. Kiều / Mr. Quang)
🌐 Website: bookingtravel.vn`;

  res.json({ success: true, template });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 HỆ THỐNG QUẢN LÝ BOOKING TRAVEL & TỰ ĐỘNG HÓA ZALO`);
  console.log(`🌐 Mở trình duyệt truy cập: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
