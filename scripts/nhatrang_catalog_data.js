// Kho dữ liệu chuẩn Bảng Giá Hạng Phòng Khách Sạn & Resort (Booking Travel)
// Bao gồm Master Catalog 26 Khách Sạn Nha Trang (3, 4, 5 sao) và 84 Hạng Phòng chi tiết

const MASTER_NHA_TRANG_CATALOG = [
  // =========================================================================
  // 1. PHÂN KHÚC 5 SAO NHA TRANG (11 KHÁCH SẠN / RESORT NỔI TIẾNG)
  // =========================================================================
  {
    id: "RM-NT-5-VIN-01",
    khuVuc: "Nha Trang (Đảo Hòn Tre)",
    hotel: "Vinpearl Resort & Spa Nha Trang Bay",
    sao: 5,
    hangPhong: "Deluxe King Hướng Vườn",
    serviceType: "hotel",
    giaBaoKhach: 2750000,
    giaVon: 2300000,
    moTa: "Phòng 45m2, 1 giường King, ăn sáng buffet 2 khách, cano cao tốc 2 chiều ra đảo Hòn Tre"
  },
  {
    id: "RM-NT-5-VIN-02",
    khuVuc: "Nha Trang (Đảo Hòn Tre)",
    hotel: "Vinpearl Resort & Spa Nha Trang Bay",
    sao: 5,
    hangPhong: "Deluxe Twin Hướng Biển",
    serviceType: "hotel",
    giaBaoKhach: 3100000,
    giaVon: 2600000,
    moTa: "Phòng 45m2, 2 giường đơn, ban công view biển trực diện, buffet sáng hải sản, cano ra đảo"
  },
  {
    id: "RM-NT-5-VIN-03",
    khuVuc: "Nha Trang (Đảo Hòn Tre)",
    hotel: "Vinpearl Resort & Spa Nha Trang Bay",
    sao: 5,
    hangPhong: "Executive Suite Hướng Biển",
    serviceType: "hotel",
    giaBaoKhach: 5000000,
    giaVon: 4200000,
    moTa: "Suite 90m2, bồn tắm kính view biển, đặc quyền Lounge VIP, trà chiều cano riêng"
  },
  {
    id: "RM-NT-5-VIN-04",
    khuVuc: "Nha Trang (Đảo Hòn Tre)",
    hotel: "Vinpearl Resort & Spa Nha Trang Bay",
    sao: 5,
    hangPhong: "Villa 2 Phòng Ngủ Hồ Bơi Riêng",
    serviceType: "hotel",
    giaBaoKhach: 7900000,
    giaVon: 6800000,
    moTa: "Villa 190m2 hồ bơi riêng biệt, phòng khách riêng, cho 4 người lớn 2 trẻ em, ăn sáng buffet"
  },
  {
    id: "RM-NT-5-VIN-05",
    khuVuc: "Nha Trang (Đảo Hòn Tre)",
    hotel: "Vinpearl Resort & Spa Nha Trang Bay",
    sao: 5,
    hangPhong: "Villa 3 Phòng Ngủ Hướng Biển",
    serviceType: "hotel",
    giaBaoKhach: 11200000,
    giaVon: 9500000,
    moTa: "Villa 290m2 sát biển hồ bơi riêng, 3 phòng ngủ master cho 6 người lớn, sân vườn BBQ"
  },

  // InterContinental Nha Trang (5⭐ Trần Phú)
  {
    id: "RM-NT-5-IC-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "InterContinental Nha Trang",
    sao: 5,
    hangPhong: "Classic City View",
    serviceType: "hotel",
    giaBaoKhach: 2950000,
    giaVon: 2500000,
    moTa: "Chuẩn 5 sao quốc tế IHG, bồn tắm cẩm thạch, buffet sáng hải sản thượng hạng, đối diện biển"
  },
  {
    id: "RM-NT-5-IC-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "InterContinental Nha Trang",
    sao: 5,
    hangPhong: "Classic Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 3450000,
    giaVon: 2900000,
    moTa: "Ban công ngắm trọn vẹn vịnh Nha Trang, giường lông vũ cao cấp, bồn tắm nằm view biển"
  },
  {
    id: "RM-NT-5-IC-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "InterContinental Nha Trang",
    sao: 5,
    hangPhong: "Premium Ocean Front",
    serviceType: "hotel",
    giaBaoKhach: 4250000,
    giaVon: 3600000,
    moTa: "Tầng cao trực diện biển, ban công rộng góc panorama ngắm bình minh đại dương"
  },
  {
    id: "RM-NT-5-IC-04",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "InterContinental Nha Trang",
    sao: 5,
    hangPhong: "Junior Suite Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 6100000,
    giaVon: 5200000,
    moTa: "Suite 70m2, khu tiếp khách riêng, bồn tắm kính nhìn ra biển, Club InterContinental Lounge"
  },

  // Sheraton Nha Trang Hotel & Spa (5⭐ Trần Phú)
  {
    id: "RM-NT-5-SHE-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Sheraton Nha Trang Hotel & Spa",
    sao: 5,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 2650000,
    giaVon: 2200000,
    moTa: "100% phòng hướng biển, giường độc quyền Sheraton Sweet Sleeper Bed, buffet sáng Feast"
  },
  {
    id: "RM-NT-5-SHE-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Sheraton Nha Trang Hotel & Spa",
    sao: 5,
    hangPhong: "Premium Deluxe Ocean",
    serviceType: "hotel",
    giaBaoKhach: 3050000,
    giaVon: 2550000,
    moTa: "Tầng 18-24, ban công kính ngắm bình minh biển Nha Trang, bồn tắm nằm cao cấp"
  },
  {
    id: "RM-NT-5-SHE-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Sheraton Nha Trang Hotel & Spa",
    sao: 5,
    hangPhong: "Club Ocean View (Sheraton Club)",
    serviceType: "hotel",
    giaBaoKhach: 3900000,
    giaVon: 3300000,
    moTa: "Đặc quyền Sheraton Club Lounge tầng 25, trà chiều, bánh ngọt & cocktail tối ngắm vịnh"
  },
  {
    id: "RM-NT-5-SHE-04",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Sheraton Nha Trang Hotel & Spa",
    sao: 5,
    hangPhong: "Executive Suite Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 5400000,
    giaVon: 4600000,
    moTa: "70m2 phòng khách riêng biệt, bồn tắm sục jacuzzi view biển, đặc quyền Club Lounge"
  },

  // Havana Nha Trang Hotel (5⭐ Trần Phú)
  {
    id: "RM-NT-5-HAV-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Havana Nha Trang Hotel",
    sao: 5,
    hangPhong: "Deluxe Ocean View (Hầm Qua Biển)",
    serviceType: "hotel",
    giaBaoKhach: 1550000,
    giaVon: 1250000,
    moTa: "Khách sạn có đường hầm ngầm riêng ra bãi biển, bồn tắm nằm view biển, buffet sáng quốc tế"
  },
  {
    id: "RM-NT-5-HAV-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Havana Nha Trang Hotel",
    sao: 5,
    hangPhong: "Junior Suite Queen",
    serviceType: "hotel",
    giaBaoKhach: 1950000,
    giaVon: 1650000,
    moTa: "Phòng 40m2 nội thất gỗ cao cấp, ban công thoáng nhìn trọn vịnh Nha Trang"
  },
  {
    id: "RM-NT-5-HAV-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Havana Nha Trang Hotel",
    sao: 5,
    hangPhong: "Club Suite King Ocean",
    serviceType: "hotel",
    giaBaoKhach: 2500000,
    giaVon: 2100000,
    moTa: "Phòng 65m2 tầng cao ngắm toàn cảnh thành phố và biển, skylight rooftop club"
  },
  {
    id: "RM-NT-5-HAV-04",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Havana Nha Trang Hotel",
    sao: 5,
    hangPhong: "Family Suite 2 Phòng Ngủ",
    serviceType: "hotel",
    giaBaoKhach: 3450000,
    giaVon: 2900000,
    moTa: "2 phòng ngủ riêng biệt cho 4 người lớn, bếp & phòng khách, 2 phòng tắm rộng"
  },

  // Amiana Resort Nha Trang (5⭐ Phạm Văn Đồng)
  {
    id: "RM-NT-5-AMI-01",
    khuVuc: "Nha Trang (Đường Phạm Văn Đồng)",
    hotel: "Amiana Resort Nha Trang",
    sao: 5,
    hangPhong: "Deluxe Villa Hướng Vườn",
    serviceType: "hotel",
    giaBaoKhach: 4050000,
    giaVon: 3400000,
    moTa: "Villa 65m2 phòng tắm ngoài trời độc đáo, bể bơi nước biển tự nhiên 2.500m2, bãi biển riêng"
  },
  {
    id: "RM-NT-5-AMI-02",
    khuVuc: "Nha Trang (Đường Phạm Văn Đồng)",
    hotel: "Amiana Resort Nha Trang",
    sao: 5,
    hangPhong: "Ocean Deluxe King",
    serviceType: "hotel",
    giaBaoKhach: 4850000,
    giaVon: 4100000,
    moTa: "Sát mép biển vịnh Nha Trang, ngắm hoàng hôn vịnh biển tuyệt đẹp, tắm bùn khoáng cao cấp"
  },
  {
    id: "RM-NT-5-AMI-03",
    khuVuc: "Nha Trang (Đường Phạm Văn Đồng)",
    hotel: "Amiana Resort Nha Trang",
    sao: 5,
    hangPhong: "Ocean Villa Hồ Bơi Riêng",
    serviceType: "hotel",
    giaBaoKhach: 8200000,
    giaVon: 6900000,
    moTa: "Villa hồ bơi riêng view biển trực diện, hiên tắm nắng, dịch vụ quản gia cao cấp"
  },
  {
    id: "RM-NT-5-AMI-04",
    khuVuc: "Nha Trang (Đường Phạm Văn Đồng)",
    hotel: "Amiana Resort Nha Trang",
    sao: 5,
    hangPhong: "Family Villa 2 Phòng Ngủ",
    serviceType: "hotel",
    giaBaoKhach: 9200000,
    giaVon: 7800000,
    moTa: "120m2 cho đại gia đình 4-6 khách, không gian xanh riêng tư, ăn sáng buffet Á-Âu"
  },

  // Six Senses Ninh Van Bay (5⭐ Siêu Sang)
  {
    id: "RM-NT-5-SIX-01",
    khuVuc: "Nha Trang (Vịnh Ninh Vân)",
    hotel: "Six Senses Ninh Van Bay",
    sao: 5,
    hangPhong: "Hill Top Pool Villa",
    serviceType: "hotel",
    giaBaoKhach: 16800000,
    giaVon: 14500000,
    moTa: "Biệt thự đỉnh đồi có hồ bơi riêng, ngắm toàn cảnh vịnh Ninh Vân, quản gia GEM riêng biệt"
  },
  {
    id: "RM-NT-5-SIX-02",
    khuVuc: "Nha Trang (Vịnh Ninh Vân)",
    hotel: "Six Senses Ninh Van Bay",
    sao: 5,
    hangPhong: "Beachfront Pool Villa",
    serviceType: "hotel",
    giaBaoKhach: 21000000,
    giaVon: 18200000,
    moTa: "Biệt thự bãi biển bước thẳng ra bờ cát trắng mịn, hồ bơi riêng biệt lập, tàu cano đưa đón"
  },
  {
    id: "RM-NT-5-SIX-03",
    khuVuc: "Nha Trang (Vịnh Ninh Vân)",
    hotel: "Six Senses Ninh Van Bay",
    sao: 5,
    hangPhong: "Water Pool Villa",
    serviceType: "hotel",
    giaBaoKhach: 25500000,
    giaVon: 22000000,
    moTa: "Biệt thự dựng trên ghềnh đá mép sóng đại dương, hồ bơi vô cực ngắm hoàng hôn buông xuống vịnh"
  },

  // Muong Thanh Luxury Nha Trang (5⭐ Trần Phú)
  {
    id: "RM-NT-5-MTL-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Muong Thanh Luxury Nha Trang",
    sao: 5,
    hangPhong: "Deluxe King Hướng Phố",
    serviceType: "hotel",
    giaBaoKhach: 1300000,
    giaVon: 1050000,
    moTa: "32m2, tiện nghi 5 sao, hồ bơi lớn tầng 4, buffet sáng phong phú 100 món Á-Âu"
  },
  {
    id: "RM-NT-5-MTL-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Muong Thanh Luxury Nha Trang",
    sao: 5,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1550000,
    giaVon: 1250000,
    moTa: "Ban công hướng biển Trần Phú lộng gió, bồn tắm nằm, cách bãi biển 20m"
  },
  {
    id: "RM-NT-5-MTL-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Muong Thanh Luxury Nha Trang",
    sao: 5,
    hangPhong: "Grand Suite King",
    serviceType: "hotel",
    giaBaoKhach: 2850000,
    giaVon: 2400000,
    moTa: "60m2 phòng khách riêng biệt, bồn tắm sục jacuzzi ngắm biển, hoa quả chào đón"
  },

  // Queen Ann Nha Trang Hotel (5⭐ Trần Phú)
  {
    id: "RM-NT-5-QA-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Queen Ann Nha Trang Hotel",
    sao: 5,
    hangPhong: "Deluxe City View",
    serviceType: "hotel",
    giaBaoKhach: 1400000,
    giaVon: 1150000,
    moTa: "Thiết kế sang trọng châu Âu dát vàng, cách biển 30m, hồ bơi tràn bờ view vịnh"
  },
  {
    id: "RM-NT-5-QA-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Queen Ann Nha Trang Hotel",
    sao: 5,
    hangPhong: "Grand Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1700000,
    giaVon: 1400000,
    moTa: "View biển 180 độ không góc khuất, ban công kính, bồn tắm nằm sang trọng"
  },
  {
    id: "RM-NT-5-QA-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Queen Ann Nha Trang Hotel",
    sao: 5,
    hangPhong: "Premier Suite King",
    serviceType: "hotel",
    giaBaoKhach: 2350000,
    giaVon: 1950000,
    moTa: "55m2 tầng 25+, ngắm bình minh và pháo hoa vịnh Nha Trang, phòng khách riêng"
  },

  // Regalia Gold Hotel (5⭐ Nguyễn Thị Minh Khai)
  {
    id: "RM-NT-5-RG-01",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Regalia Gold Hotel",
    sao: 5,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 1100000,
    giaVon: 850000,
    moTa: "Hồ bơi vô cực tầng 40 cao nhất Nha Trang, buffet sáng 5 sao, trung tâm phố đi bộ"
  },
  {
    id: "RM-NT-5-RG-02",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Regalia Gold Hotel",
    sao: 5,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1350000,
    giaVon: 1050000,
    moTa: "Tầng cao hướng biển, giường nệm êm ái, bồn tắm sang trọng, view ngắm biển lộng lẫy"
  },
  {
    id: "RM-NT-5-RG-03",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Regalia Gold Hotel",
    sao: 5,
    hangPhong: "Senior Suite King",
    serviceType: "hotel",
    giaBaoKhach: 1950000,
    giaVon: 1600000,
    moTa: "48m2 sofa tiếp khách, ban công riêng ngắm biển, nội thất chuẩn hoàng gia"
  },

  // Virgo Hotel Nha Trang (5⭐ Nguyễn Thị Minh Khai)
  {
    id: "RM-NT-5-VG-01",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Virgo Hotel Nha Trang",
    sao: 5,
    hangPhong: "Deluxe City View",
    serviceType: "hotel",
    giaBaoKhach: 1150000,
    giaVon: 900000,
    moTa: "Trung tâm phố Tây ẩm thực sầm uất, hồ bơi trong nhà tầng 28, buffet sáng phong phú"
  },
  {
    id: "RM-NT-5-VG-02",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Virgo Hotel Nha Trang",
    sao: 5,
    hangPhong: "Premier Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1450000,
    giaVon: 1150000,
    moTa: "Ban công rộng hướng biển, bồn tắm nằm cao cấp, ngắm biển và thành phố về đêm"
  },
  {
    id: "RM-NT-5-VG-03",
    khuVuc: "Nha Trang (Đường Nguyễn Thị Minh Khai)",
    hotel: "Virgo Hotel Nha Trang",
    sao: 5,
    hangPhong: "Executive Suite Ocean",
    serviceType: "hotel",
    giaBaoKhach: 2100000,
    giaVon: 1750000,
    moTa: "55m2 phòng khách riêng, trang thiết bị hiện đại 5 sao, bồn tắm sục thư giãn"
  },

  // Potique Hotel Nha Trang (5⭐ Indochine Hùng Vương)
  {
    id: "RM-NT-5-POT-01",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Potique Hotel Nha Trang",
    sao: 5,
    hangPhong: "Classic King Indochine",
    serviceType: "hotel",
    giaBaoKhach: 2250000,
    giaVon: 1850000,
    moTa: "Khách sạn boutique phong cách Đông Dương quý phái, bồn tắm chân rồng, hồ bơi vô cực sân thượng"
  },
  {
    id: "RM-NT-5-POT-02",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Potique Hotel Nha Trang",
    sao: 5,
    hangPhong: "Premier Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 2800000,
    giaVon: 2350000,
    moTa: "Nội thất gỗ thủ công tinh xảo, ban công ngắm biển phố, thưởng trà chiều phong cách Pháp"
  },
  {
    id: "RM-NT-5-POT-03",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Potique Hotel Nha Trang",
    sao: 5,
    hangPhong: "Potique Suite Quý Tộc",
    serviceType: "hotel",
    giaBaoKhach: 4500000,
    giaVon: 3800000,
    moTa: "75m2 phong cách quý tộc Đông Dương cổ điển, phòng khách gỗ trầm, bồn tắm sứ sang trọng"
  },

  // =========================================================================
  // 2. PHÂN KHÚC 4 SAO NHA TRANG (9 KHÁCH SẠN ĐƯỢC ƯA CHUỘNG NHẤT)
  // =========================================================================
  // King Town Grand Hotel (4⭐)
  {
    id: "RM-NT-4-KT-01",
    khuVuc: "Nha Trang (Đường Lê Hồng Phong/Hùng Vương)",
    hotel: "King Town Grand Hotel",
    sao: 4,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 950000,
    giaVon: 750000,
    moTa: "Chuẩn 4 sao, hồ bơi vô cực, gym, buffet sáng phong phú, xe đưa đón bãi biển"
  },
  {
    id: "RM-NT-4-KT-02",
    khuVuc: "Nha Trang (Đường Lê Hồng Phong/Hùng Vương)",
    hotel: "King Town Grand Hotel",
    sao: 4,
    hangPhong: "Deluxe City View",
    serviceType: "hotel",
    giaBaoKhach: 1200000,
    giaVon: 950000,
    moTa: "Phòng 35m2 rộng rãi, nội thất gỗ ấm cúng, bồn tắm nằm cao cấp"
  },
  {
    id: "RM-NT-4-KT-03",
    khuVuc: "Nha Trang (Đường Lê Hồng Phong/Hùng Vương)",
    hotel: "King Town Grand Hotel",
    sao: 4,
    hangPhong: "Executive Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1600000,
    giaVon: 1300000,
    moTa: "Tầng cao ngắm trọn vịnh Nha Trang, phòng tắm kính sang trọng, trà nước miễn phí"
  },
  {
    id: "RM-NT-4-KT-04",
    khuVuc: "Nha Trang (Đường Lê Hồng Phong/Hùng Vương)",
    hotel: "King Town Grand Hotel",
    sao: 4,
    hangPhong: "Premier Suite Hướng Biển",
    serviceType: "hotel",
    giaBaoKhach: 2100000,
    giaVon: 1700000,
    moTa: "Suite VIP 60m2 phòng khách riêng biệt view biển, miễn phí ăn sáng và cocktail hoàng hôn"
  },

  // Novotel Nha Trang (4⭐ Quốc Tế Trần Phú)
  {
    id: "RM-NT-4-NVT-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Novotel Nha Trang",
    sao: 4,
    hangPhong: "Standard Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 2100000,
    giaVon: 1750000,
    moTa: "Chuẩn 4 sao Accor quốc tế, ban công nhìn ra vịnh, ăn sáng buffet The Square phong phú"
  },
  {
    id: "RM-NT-4-NVT-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Novotel Nha Trang",
    sao: 4,
    hangPhong: "Superior Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 2450000,
    giaVon: 2050000,
    moTa: "Tầng cao thoáng mát, nệm Novotel Live N Dream siêu êm, view toàn cảnh biển Trần Phú"
  },
  {
    id: "RM-NT-4-NVT-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Novotel Nha Trang",
    sao: 4,
    hangPhong: "Executive Suite Ocean",
    serviceType: "hotel",
    giaBaoKhach: 3800000,
    giaVon: 3200000,
    moTa: "Phòng góc 2 mặt thoáng ngắm toàn cảnh biển và đảo Vinpearl, bồn tắm kính hướng đại dương"
  },

  // Comodo Nha Trang Hotel (4⭐ Trần Phú)
  {
    id: "RM-NT-4-CMD-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Comodo Nha Trang Hotel",
    sao: 4,
    hangPhong: "Deluxe City View",
    serviceType: "hotel",
    giaBaoKhach: 1050000,
    giaVon: 850000,
    moTa: "Mặt tiền đường Trần Phú, hồ bơi tầng thượng vô cực, buffet sáng Á-Âu"
  },
  {
    id: "RM-NT-4-CMD-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Comodo Nha Trang Hotel",
    sao: 4,
    hangPhong: "Premier Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1350000,
    giaVon: 1100000,
    moTa: "Ban công hướng biển lộng gió, bồn tắm nằm, view trọn vịnh Nha Trang"
  },
  {
    id: "RM-NT-4-CMD-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Comodo Nha Trang Hotel",
    sao: 4,
    hangPhong: "Grand Family Suite",
    serviceType: "hotel",
    giaBaoKhach: 2300000,
    giaVon: 1900000,
    moTa: "Phòng gia đình 2 giường King lớn cho 4 khách, ban công đôi ngắm biển"
  },

  // Liberty Central Nha Trang (4⭐ Biệt Thự)
  {
    id: "RM-NT-4-LBC-01",
    khuVuc: "Nha Trang (Đường Biệt Thự)",
    hotel: "Liberty Central Nha Trang",
    sao: 4,
    hangPhong: "Deluxe King",
    serviceType: "hotel",
    giaBaoKhach: 1550000,
    giaVon: 1250000,
    moTa: "Vị trí đắc địa phố Tây Biệt Thự, cách biển 120m, buffet Á-Âu, hồ bơi tầng 4"
  },
  {
    id: "RM-NT-4-LBC-02",
    khuVuc: "Nha Trang (Đường Biệt Thự)",
    hotel: "Liberty Central Nha Trang",
    sao: 4,
    hangPhong: "Premier Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1850000,
    giaVon: 1550000,
    moTa: "Ban công kính view biển, bồn tắm nằm cao cấp, tiện nghi hiện đại chuẩn quốc tế"
  },
  {
    id: "RM-NT-4-LBC-03",
    khuVuc: "Nha Trang (Đường Biệt Thự)",
    hotel: "Liberty Central Nha Trang",
    sao: 4,
    hangPhong: "Executive Club Ocean",
    serviceType: "hotel",
    giaBaoKhach: 2500000,
    giaVon: 2100000,
    moTa: "Quyền lợi Executive Lounge, trà chiều, canape tối và đồ uống miễn phí"
  },

  // TTC Hotel Premium Michelia (4⭐ Pasteur)
  {
    id: "RM-NT-4-TTC-01",
    khuVuc: "Nha Trang (Đường Pasteur)",
    hotel: "TTC Hotel Premium Michelia",
    sao: 4,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 1050000,
    giaVon: 800000,
    moTa: "Gần công viên Yersin và bãi biển, hồ bơi nước ngọt lớn, buffet sáng đa dạng"
  },
  {
    id: "RM-NT-4-TTC-02",
    khuVuc: "Nha Trang (Đường Pasteur)",
    hotel: "TTC Hotel Premium Michelia",
    sao: 4,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1350000,
    giaVon: 1050000,
    moTa: "View biển thoáng, ban công riêng, bồn tắm nằm cao cấp"
  },
  {
    id: "RM-NT-4-TTC-03",
    khuVuc: "Nha Trang (Đường Pasteur)",
    hotel: "TTC Hotel Premium Michelia",
    sao: 4,
    hangPhong: "Premier Suite",
    serviceType: "hotel",
    giaBaoKhach: 2050000,
    giaVon: 1650000,
    moTa: "52m2 ban công góc ngắm biển và thành phố, sofa tiếp khách êm ái"
  },

  // Alana Nha Trang Beach Hotel (4⭐ Trần Quang Khải)
  {
    id: "RM-NT-4-ALN-01",
    khuVuc: "Nha Trang (Đường Trần Quang Khải)",
    hotel: "Alana Nha Trang Beach Hotel",
    sao: 4,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 1100000,
    giaVon: 850000,
    moTa: "Phố du lịch Trần Quang Khải sầm uất, hồ bơi vô cực view biển tầng mái, spa thư giãn"
  },
  {
    id: "RM-NT-4-ALN-02",
    khuVuc: "Nha Trang (Đường Trần Quang Khải)",
    hotel: "Alana Nha Trang Beach Hotel",
    sao: 4,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1400000,
    giaVon: 1150000,
    moTa: "Ban công riêng đón gió biển, bồn tắm kính nhìn ra biển, buffet sáng phong phú"
  },
  {
    id: "RM-NT-4-ALN-03",
    khuVuc: "Nha Trang (Đường Trần Quang Khải)",
    hotel: "Alana Nha Trang Beach Hotel",
    sao: 4,
    hangPhong: "Club Suite King Ocean",
    serviceType: "hotel",
    giaBaoKhach: 2100000,
    giaVon: 1700000,
    moTa: "Phòng VIP tầng cao ngắm toàn vịnh Nha Trang, tặng kèm đĩa trái cây & rượu vang"
  },

  // Melissa Hotel Nha Trang (4⭐ Trần Phú)
  {
    id: "RM-NT-4-MLS-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Melissa Hotel Nha Trang",
    sao: 4,
    hangPhong: "Superior Double",
    serviceType: "hotel",
    giaBaoKhach: 950000,
    giaVon: 750000,
    moTa: "Mặt biển Trần Phú, buffet sáng phong phú, hồ bơi tầng mái view toàn vịnh"
  },
  {
    id: "RM-NT-4-MLS-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Melissa Hotel Nha Trang",
    sao: 4,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1200000,
    giaVon: 950000,
    moTa: "Ban công hướng biển trực diện, bồn tắm nằm, ngắm sóng biển ngày và đêm"
  },
  {
    id: "RM-NT-4-MLS-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Melissa Hotel Nha Trang",
    sao: 4,
    hangPhong: "Senior Suite Ocean",
    serviceType: "hotel",
    giaBaoKhach: 1850000,
    giaVon: 1500000,
    moTa: "45m2 tầng cao, ban công kính ngắm bình minh trên biển, phòng khách riêng"
  },

  // V Hotel Nha Trang (4⭐ Hùng Vương)
  {
    id: "RM-NT-4-VH-01",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "V Hotel Nha Trang",
    sao: 4,
    hangPhong: "Deluxe Double",
    serviceType: "hotel",
    giaBaoKhach: 900000,
    giaVon: 700000,
    moTa: "Trung tâm Hùng Vương, thiết kế trẻ trung sang trọng, hồ bơi vô cực ngắm phố"
  },
  {
    id: "RM-NT-4-VH-02",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "V Hotel Nha Trang",
    sao: 4,
    hangPhong: "Premier Balcony City",
    serviceType: "hotel",
    giaBaoKhach: 1150000,
    giaVon: 900000,
    moTa: "Ban công riêng nhìn ra phố Tây lung linh về đêm, bồn tắm nằm, free buffet sáng"
  },
  {
    id: "RM-NT-4-VH-03",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "V Hotel Nha Trang",
    sao: 4,
    hangPhong: "Suite Family Ocean",
    serviceType: "hotel",
    giaBaoKhach: 1800000,
    giaVon: 1450000,
    moTa: "2 giường lớn cho gia đình 4 người lớn, ban công thoáng ngắm biển xa xa"
  },

  // Bonjour Nha Trang Hotel (4⭐ Đống Đa)
  {
    id: "RM-NT-4-BJ-01",
    khuVuc: "Nha Trang (Đường Đống Đa)",
    hotel: "Bonjour Nha Trang Hotel",
    sao: 4,
    hangPhong: "Superior King",
    serviceType: "hotel",
    giaBaoKhach: 880000,
    giaVon: 680000,
    moTa: "Khách sạn mới 4 sao, hồ bơi tầng thượng, buffet sáng phong phú, gần chợ Đầm"
  },
  {
    id: "RM-NT-4-BJ-02",
    khuVuc: "Nha Trang (Đường Đống Đa)",
    hotel: "Bonjour Nha Trang Hotel",
    sao: 4,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 1100000,
    giaVon: 880000,
    moTa: "Tầng cao hướng biển, phòng tắm kính hiện đại, ăn sáng buffet miễn phí"
  },

  // =========================================================================
  // 3. PHÂN KHÚC 3 SAO NHA TRANG (6 KHÁCH SẠN GIÁ TỐT, GẦN BIỂN, BÁN CHẠY)
  // =========================================================================
  // Khách Sạn Rova Nha Trang (3⭐)
  {
    id: "RM-NT-3-ROV-01",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Khách Sạn Rova Nha Trang",
    sao: 3,
    hangPhong: "Standard Double",
    serviceType: "hotel",
    giaBaoKhach: 600000,
    giaVon: 450000,
    moTa: "Phòng tiện nghi sạch sẽ, cách bãi biển 150m, điều hòa êm, free wifi"
  },
  {
    id: "RM-NT-3-ROV-02",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Khách Sạn Rova Nha Trang",
    sao: 3,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 700000,
    giaVon: 550000,
    moTa: "Cửa sổ lớn ngắm phố, ăn sáng buffet, cách quảng trường 2/4 chỉ 5 phút đi bộ"
  },
  {
    id: "RM-NT-3-ROV-03",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Khách Sạn Rova Nha Trang",
    sao: 3,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 880000,
    giaVon: 700000,
    moTa: "Ban công hướng biển, bồn tắm đứng hiện đại, free trà cafe hàng ngày"
  },
  {
    id: "RM-NT-3-ROV-04",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Khách Sạn Rova Nha Trang",
    sao: 3,
    hangPhong: "Suite Balcony Gia Đình",
    serviceType: "hotel",
    giaBaoKhach: 1300000,
    giaVon: 1050000,
    moTa: "40m2 phòng 2 giường đôi lớn cho 4 khách, ban công riêng, buffet sáng 4 người"
  },

  // Dendro Hotel Nha Trang (3⭐ Trần Phú)
  {
    id: "RM-NT-3-DND-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Dendro Hotel Nha Trang",
    sao: 3,
    hangPhong: "Superior Double",
    serviceType: "hotel",
    giaBaoKhach: 650000,
    giaVon: 480000,
    moTa: "Mặt đường Trần Phú, hồ bơi trong nhà tầng 15, ăn sáng buffet miễn phí"
  },
  {
    id: "RM-NT-3-DND-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Dendro Hotel Nha Trang",
    sao: 3,
    hangPhong: "Deluxe City View",
    serviceType: "hotel",
    giaBaoKhach: 780000,
    giaVon: 600000,
    moTa: "Cửa sổ thoáng mát, tiện nghi đầy đủ, đối diện bãi biển Trần Phú"
  },
  {
    id: "RM-NT-3-DND-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Dendro Hotel Nha Trang",
    sao: 3,
    hangPhong: "Premier Sea View",
    serviceType: "hotel",
    giaBaoKhach: 950000,
    giaVon: 750000,
    moTa: "Ban công ngắm biển Trần Phú trực diện, phòng tắm hiện đại, buffet sáng"
  },

  // Siren Flower Hotel Nha Trang (3⭐ Hùng Vương)
  {
    id: "RM-NT-3-SRN-01",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Siren Flower Hotel Nha Trang",
    sao: 3,
    hangPhong: "Standard Double",
    serviceType: "hotel",
    giaBaoKhach: 550000,
    giaVon: 420000,
    moTa: "Gần phố đi bộ và chợ đêm, phòng mới tinh tươm, nhân viên thân thiện"
  },
  {
    id: "RM-NT-3-SRN-02",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Siren Flower Hotel Nha Trang",
    sao: 3,
    hangPhong: "Superior City View",
    serviceType: "hotel",
    giaBaoKhach: 680000,
    giaVon: 520000,
    moTa: "Cửa sổ lớn đón ánh sáng tự nhiên, buffet sáng ngon miệng, cách biển 200m"
  },
  {
    id: "RM-NT-3-SRN-03",
    khuVuc: "Nha Trang (Đường Hùng Vương)",
    hotel: "Siren Flower Hotel Nha Trang",
    sao: 3,
    hangPhong: "Deluxe Balcony",
    serviceType: "hotel",
    giaBaoKhach: 820000,
    giaVon: 650000,
    moTa: "Ban công riêng thoáng đãng, trà cafe miễn phí, phòng tắm đứng kính"
  },

  // Ruby Hotel Nha Trang (3⭐ Trần Phú)
  {
    id: "RM-NT-3-RBY-01",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Ruby Hotel Nha Trang",
    sao: 3,
    hangPhong: "Superior Double",
    serviceType: "hotel",
    giaBaoKhach: 620000,
    giaVon: 480000,
    moTa: "Đối diện bãi tắm Trần Phú, hồ bơi ngoài trời tầng thượng, buffet sáng"
  },
  {
    id: "RM-NT-3-RBY-02",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Ruby Hotel Nha Trang",
    sao: 3,
    hangPhong: "Deluxe Hướng Biển",
    serviceType: "hotel",
    giaBaoKhach: 820000,
    giaVon: 650000,
    moTa: "Ban công trực diện biển, đón bình minh rực rỡ, bồn tắm nằm"
  },
  {
    id: "RM-NT-3-RBY-03",
    khuVuc: "Nha Trang (Đường Trần Phú)",
    hotel: "Ruby Hotel Nha Trang",
    sao: 3,
    hangPhong: "Family Suite",
    serviceType: "hotel",
    giaBaoKhach: 1200000,
    giaVon: 950000,
    moTa: "2 giường đôi lớn cho gia đình 4 người lớn, không gian ấm cúng"
  },

  // SeaSing Boutique Hotel (3⭐ Dương Hiến Tuyền)
  {
    id: "RM-NT-3-SSB-01",
    khuVuc: "Nha Trang (Đường Dương Hiến Tuyền)",
    hotel: "SeaSing Boutique Hotel",
    sao: 3,
    hangPhong: "Superior Double",
    serviceType: "hotel",
    giaBaoKhach: 590000,
    giaVon: 450000,
    moTa: "Khu Bắc Nha Trang yên tĩnh, gần biển Ba Làng và bến du thuyền Ana Marina"
  },
  {
    id: "RM-NT-3-SSB-02",
    khuVuc: "Nha Trang (Đường Dương Hiến Tuyền)",
    hotel: "SeaSing Boutique Hotel",
    sao: 3,
    hangPhong: "Deluxe Ocean View",
    serviceType: "hotel",
    giaBaoKhach: 790000,
    giaVon: 620000,
    moTa: "Ban công ngắm trọn vịnh Bắc Nha Trang lãng mạn, hồ bơi tầng thượng"
  },
  {
    id: "RM-NT-3-SSB-03",
    khuVuc: "Nha Trang (Đường Dương Hiến Tuyền)",
    hotel: "SeaSing Boutique Hotel",
    sao: 3,
    hangPhong: "Grand Ocean Suite",
    serviceType: "hotel",
    giaBaoKhach: 1150000,
    giaVon: 890000,
    moTa: "Bồn tắm nằm hướng biển, phòng khách riêng, hoa quả chào đón"
  },

  // Olympic Hotel Nha Trang (3⭐ Phan Bội Châu)
  {
    id: "RM-NT-3-OLY-01",
    khuVuc: "Nha Trang (Đường Phan Bội Châu)",
    hotel: "Olympic Hotel Nha Trang",
    sao: 3,
    hangPhong: "Standard City View",
    serviceType: "hotel",
    giaBaoKhach: 550000,
    giaVon: 420000,
    moTa: "Gần chợ Đầm và khu ăn uống hải sản Tháp Bà, hồ bơi trên mái, buffet sáng"
  },
  {
    id: "RM-NT-3-OLY-02",
    khuVuc: "Nha Trang (Đường Phan Bội Châu)",
    hotel: "Olympic Hotel Nha Trang",
    sao: 3,
    hangPhong: "Superior Double",
    serviceType: "hotel",
    giaBaoKhach: 660000,
    giaVon: 520000,
    moTa: "Phòng sạch sẽ tiện nghi, ăn sáng buffet, hỗ trợ thuê xe máy giá rẻ"
  }
];

if (typeof module !== 'undefined') {
  module.exports = { MASTER_NHA_TRANG_CATALOG };
}
