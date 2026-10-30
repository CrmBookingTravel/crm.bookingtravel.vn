// =========================================================================
// GOOGLE APPS SCRIPT: QUẢN LÝ TẤT CẢ GOOGLE SHEETS TRONG TÀI KHOẢN
// =========================================================================
// Hướng dẫn triển khai (chỉ làm 1 lần duy nhất):
// 1. Mở trình duyệt, truy cập: https://script.google.com/home/start
//    (Đảm bảo đang đăng nhập tài khoản sale.bookingtravel.com.vn@gmail.com)
// 2. Nhấn nút "Dự án mới" (New project) ở góc trên bên trái.
// 3. Xóa toàn bộ mã mặc định, dán TOÀN BỘ đoạn mã này vào.
// 4. Bấm biểu tượng "Lưu" (Save - phím tắt Ctrl+S).
// 5. Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> "Triển khai mới" (New deployment).
// 6. Nhấn vào biểu tượng Bánh răng (Chọn loại) -> Chọn "Ứng dụng web" (Web app).
// 7. Cấu hình:
//    - Mô tả: Google Sheets Manager
//    - Thực thi dưới dạng (Execute as): Tôi (sale.bookingtravel.com.vn@gmail.com)
//    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
// 8. Bấm "Triển khai" -> "Ủy quyền truy cập" (Authorize access) -> Chọn tài khoản ->
//    Bấm "Nâng cao" (Advanced) -> "Đi tới... (không an toàn)" -> Bấm "Cho phép" (Allow).
// 9. Copy "URL ứng dụng web" và dán vào file manager-client.js.
// =========================================================================

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'list';

  try {
    // 1. Liệt kê tất cả Google Sheets có trong Drive
    if (action === 'list') {
      var files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
      var list = [];
      while (files.hasNext()) {
        var file = files.next();
        list.push({
          id: file.getId(),
          name: file.getName(),
          url: file.getUrl(),
          lastUpdated: file.getLastUpdated()
        });
      }
      return respondJson({ success: true, total: list.length, sheets: list });
    }

    // 2. Đọc dữ liệu của 1 bảng tính theo ID qua GET
    if (action === 'read') {
      var id = e.parameter.id;
      if (!id) return respondJson({ success: false, error: 'Thiếu tham số "id"' });

      var ss = SpreadsheetApp.openById(id);
      var sheet = ss.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      return respondJson({
        success: true,
        sheetName: ss.getName(),
        activeTab: sheet.getName(),
        data: data
      });
    }

    return respondJson({ success: false, error: 'Hành động GET không hợp lệ' });
  } catch (err) {
    return respondJson({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    // 1. Tạo một Google Sheet mới tinh trong Drive
    if (action === 'create') {
      var name = payload.name || 'Bảng tính không có tiêu đề';
      var newSS = SpreadsheetApp.create(name);
      return respondJson({
        success: true,
        message: 'Đã tạo thành công file Google Sheet mới',
        id: newSS.getId(),
        name: newSS.getName(),
        url: newSS.getUrl()
      });
    }

    // 2. Đọc dữ liệu bảng tính theo ID
    if (action === 'read') {
      var ss = SpreadsheetApp.openById(payload.id);
      var sheet = payload.sheetName ? ss.getSheetByName(payload.sheetName) : ss.getActiveSheet();
      var data = sheet.getDataRange().getValues();
      return respondJson({
        success: true,
        sheetName: ss.getName(),
        activeTab: sheet.getName(),
        data: data
      });
    }

    // 3. Thêm dòng mới vào bất kỳ bảng tính nào theo ID
    if (action === 'append') {
      var ss = SpreadsheetApp.openById(payload.id);
      var sheet = payload.sheetName ? ss.getSheetByName(payload.sheetName) : ss.getActiveSheet();
      sheet.appendRow(payload.row);
      return respondJson({
        success: true,
        message: 'Đã thêm dòng mới vào bảng tính ' + ss.getName()
      });
    }

    // 4. Tìm kiếm bảng tính theo tên
    if (action === 'search') {
      var query = payload.name;
      var files = DriveApp.searchFiles("mimeType = 'application/vnd.google-apps.spreadsheet' and title contains '" + query + "'");
      var results = [];
      while (files.hasNext()) {
        var f = files.next();
        results.push({
          id: f.getId(),
          name: f.getName(),
          url: f.getUrl()
        });
      }
      return respondJson({ success: true, results: results });
    }

    return respondJson({ success: false, error: 'Hành động POST không hợp lệ' });
  } catch (err) {
    return respondJson({ success: false, error: err.toString() });
  }
}

function respondJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
