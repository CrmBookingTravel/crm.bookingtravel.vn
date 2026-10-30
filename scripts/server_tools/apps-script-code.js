// =========================================================================
// MÃ NGUỒN NÀY DÙNG ĐỂ DÁN VÀO GOOGLE APPS SCRIPT TRÊN GOOGLE SHEETS
// =========================================================================
// Hướng dẫn:
// 1. Mở Google Sheet của bạn trên trình duyệt
// 2. Vào menu "Tiện ích mở rộng" (Extensions) -> chọn "Apps Script"
// 3. Xóa hết mã cũ trong đó, dán toàn bộ đoạn mã bên dưới vào và bấm biểu tượng Lưu (Save)
// 4. Nhấn nút "Triển khai" (Deploy) ở góc trên bên phải -> "Triển khai mới" (New deployment)
// 5. Bấm vào biểu tượng bánh răng bên cạnh "Chọn loại" -> Chọn "Ứng dụng web" (Web app)
// 6. Cấu hình:
//    - Mô tả: Bot Sheets API
//    - Thực thi dưới dạng (Execute as): Tôi (tài khoản của bạn)
//    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
// 7. Nhấn "Triển khai" (Deploy) -> Cấp quyền (Authorize access) -> Chọn tài khoản Google của bạn -> Bấm Nâng cao (Advanced) -> Đi tới ứng dụng (không an toàn) -> Cho phép (Allow).
// 8. Copy đường dẫn "URL ứng dụng web" (dạng https://script.google.com/macros/s/.../exec) và dán vào file apps-script-client.js
// =========================================================================

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var values = sheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: values
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);

    if (payload.action === 'append') {
      // payload.row là một mảng dữ liệu, ví dụ: ["Nguyễn Văn A", "0901234567", "Tour Đà Nẵng"]
      sheet.appendRow(payload.row);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Đã thêm dòng mới thành công'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Hành động không hợp lệ'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
