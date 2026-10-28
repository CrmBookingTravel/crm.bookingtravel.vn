// =========================================================================
// HỆ THỐNG ĐIỀU HÀNH BOOKING TRAVEL - FILE CRM.gs HOÀN CHỈNH
// Tự động lưu đơn hàng vào Google Sheets "DON_HANG_THUE" & Gửi Bot Zalo
// Cấu hình Zalo OA & Nhóm Điều Hành: https://zalo.me/g/mtbelj694
// =========================================================================

// CẤU HÌNH DOANH NGHIỆP & ZALO OA
var ZALO_CONFIG = {
  appId: "2770692627149916393",
  appSecret: "miATWEV7nPIvODh1Q759",
  groupId: "mtbelj694",
  groupUrl: "https://zalo.me/g/mtbelj694",
  oaName: "Booking Travel",
  companyName: "CÔNG TY TNHH BOOKING TRAVEL",
  slogan: "Khách hàng là gia đình"
};

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "success",
    "message": "Cổng kết nối Google Sheets & Zalo Bot của Booking Travel đang hoạt động bình thường!",
    "groupUrl": ZALO_CONFIG.groupUrl,
    "groupId": ZALO_CONFIG.groupId,
    "appId": ZALO_CONFIG.appId
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "DON_HANG_THUE";
    var sheet = ss.getSheetByName(sheetName);
    
    // Nếu chưa có sheet DON_HANG_THUE, tự động tạo mới và gắn tiêu đề cột chuẩn
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "Mã Booking",
        "Khách Hàng",
        "Số Điện Thoại",
        "Đối Tác / Khách Sạn",
        "Hạng Phòng & Dịch Vụ",
        "Số Phòng",
        "Số Khách",
        "Số Đêm",
        "Ngày Check-In",
        "Ngày Check-Out",
        "Tổng Thu (Doanh Thu)",
        "Giá Vốn (Net)",
        "Lợi Nhuận Gộp",
        "Đã Thu Đợt Này",
        "Tài Khoản / Ngân Hàng",
        "Nhân Viên Sale",
        "Thời Gian Tạo"
      ]);
      sheet.getRange(1, 1, 1, 17).setFontWeight("bold").setBackground("#07162f").setFontColor("#ffffff");
    }

    var params = {};
    if (e && e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      params = e.parameter;
    }

    // Tự động sinh mã đơn hàng chuẩn DH + timestamp theo quanly.bookingtravel.vn
    var maBooking = params.maBooking || "DH" + new Date().getTime();
    var khachHang = params.khachHang || params.khangHang || "Khách Hàng";
    var sdt = params.sdt || params.phone || "";
    var doiTac = params.doiTac || "Khách sạn / Resort";
    var hangPhong = params.hangPhong || params.dichVu || "";
    var soLuongPhong = params.soLuongPhong || 1;
    var soKhach = params.soKhach || "2 Người lớn";
    var soDem = params.soDem || 1;
    var checkIn = params.checkIn || "";
    var checkOut = params.checkOut || "";
    var tongThu = Number(params.tongThu || params.giaBan || 0);
    var giaVon = Number(params.giaVon || 0);
    var loiNhuan = tongThu - giaVon;
    var soTienThuDotNay = Number(params.soTienThuDotNay || params.khachDaCoc || 0);
    var nganHang = params.nganHang || "Techcombank";
    var sale = params.sale || params.saleEmail || "Ban Giám Đốc";
    var thoiGianTao = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd HH:mm:ss");

    // 1. LƯU ĐƠN HÀNG VÀO GOOGLE SHEETS "DON_HANG_THUE"
    sheet.appendRow([
      maBooking,
      khachHang,
      sdt,
      doiTac,
      hangPhong,
      soLuongPhong,
      soKhach,
      soDem,
      checkIn,
      checkOut,
      tongThu,
      giaVon,
      loiNhuan,
      soTienThuDotNay,
      nganHang,
      sale,
      thoiGianTao
    ]);

    // 2. TỰ ĐỘNG GỬI THÔNG BÁO QUA ZALO BOT & NHÓM ĐIỀU HÀNH
    var noiDungZalo = "🚨 [BOOKING TRAVEL] CÓ ĐƠN HÀNG MỚI!\n\n" +
                      "• Mã Booking: " + maBooking + "\n" +
                      "• Khách hàng: " + khachHang + (sdt ? " (" + sdt + ")" : "") + "\n" +
                      "• Đối tác / Khách sạn: " + doiTac + "\n" +
                      "• Hạng phòng: " + hangPhong + "\n" +
                      "• Số lượng: " + soLuongPhong + " phòng | " + soKhach + " | " + soDem + " đêm\n" +
                      "• Lịch trình: " + checkIn + " ➔ " + checkOut + "\n" +
                      "• Tổng tiền: " + tongThu.toLocaleString('vi-VN') + " đ\n" +
                      "• Đã thu đợt này: " + soTienThuDotNay.toLocaleString('vi-VN') + " đ (" + nganHang + ")\n" +
                      "• Lợi nhuận gộp: " + loiNhuan.toLocaleString('vi-VN') + " đ\n" +
                      "• Phụ trách: " + sale + "\n" +
                      "• Nhóm Zalo Điều Hành: " + ZALO_CONFIG.groupUrl + "\n\n" +
                      "✨ Khách hàng là gia đình - Booking Travel";

    // Gửi thông báo đến Webhook Bot Zalo nếu có cấu hình
    try {
      var webhookUrl = params.zaloWebhookUrl || "";
      if (webhookUrl) {
        UrlFetchApp.fetch(webhookUrl, {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify({ 
            message: noiDungZalo,
            maBooking: maBooking,
            khachHang: khachHang,
            groupId: ZALO_CONFIG.groupId,
            groupUrl: ZALO_CONFIG.groupUrl,
            appId: ZALO_CONFIG.appId
          }),
          muteHttpExceptions: true
        });
      }
    } catch(zErr) {
      Logger.log("Lỗi gửi Webhook Zalo: " + zErr.toString());
    }

    // Trả kết quả thành công về cho hệ thống CRM
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "Đã lưu đơn hàng vào Google Sheets và kích hoạt Bot Zalo thành công!",
      "maBooking": maBooking,
      "zaloGroupUrl": ZALO_CONFIG.groupUrl,
      "zaloGroupId": ZALO_CONFIG.groupId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Trả về lỗi nếu có sự cố xảy ra
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
