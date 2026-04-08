// src/constants/mockData.js

// 1. DỮ LIỆU NGƯỜI DÙNG (ACCOUNTS)
export const MOCK_USERS = [
  { id: 1, full_name: "Hệ thống Admin", email: "admin@gmail.com", password: "123", role: "admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" },
  { id: 2, full_name: "Lê Văn Đối Tác", email: "partner@gmail.com", password: "123", role: "partner", hotel_id: 1 }, // Chủ của Vinpearl
  { id: 3, full_name: "Nguyễn Khách Hàng", email: "user@gmail.com", password: "123", role: "customer" }
];

// 2. DỮ LIỆU KHÁCH SẠN (HOTELS)
export const MOCK_HOTELS = [
  { 
    id_hotel: 1, 
    hotel_name: 'Vinpearl Luxury Nha Trang', 
    price_per_night: 2500000, 
    rate_star: 5, 
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 
    location_city: 'Nha Trang',
    description: 'Khu nghỉ dưỡng sang trọng bậc nhất bên bờ vịnh Nha Trang với các villa biệt lập.'
  },
  { 
    id_hotel: 2, 
    hotel_name: 'InterContinental Da Nang', 
    price_per_night: 4200000, 
    rate_star: 5, 
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 
    location_city: 'Đà Nẵng',
    description: 'Tuyệt tác kiến trúc của Bill Bensley tọa lạc tại bãi Bắc, bán đảo Sơn Trà.'
  },
  { 
    id_hotel: 3, 
    hotel_name: 'Sofitel Legend Metropole', 
    price_per_night: 5500000, 
    rate_star: 5, 
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 
    location_city: 'Hà Nội',
    description: 'Khách sạn mang phong cách kiến trúc Pháp cổ điển ngay giữa lòng thủ đô.'
  }
];

// 3. DỮ LIỆU PHÒNG (ROOMS) - Liên kết qua id_hotel
export const MOCK_ROOMS = [
  // --- Phòng của Vinpearl (id_hotel: 1) ---
  {
    id_room: 101,
    id_hotel: 1,
    room_type: "Deluxe Ocean View",
    price_per_night: 2500000,
    capacity: 2,
    bed_type: "King Size",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    amenities: ["Wifi", "Điều hòa", "Bồn tắm"]
  },
  {
    id_room: 102,
    id_hotel: 1,
    room_type: "Grand Suite Family",
    price_per_night: 4500000,
    capacity: 4,
    bed_type: "2 Double Beds",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
    amenities: ["Wifi", "Bếp nhỏ", "Hồ bơi riêng"]
  },

  // --- Phòng của InterContinental (id_hotel: 2) ---
  {
    id_room: 201,
    id_hotel: 2,
    room_type: "Classic Terrace Ocean",
    price_per_night: 4200000,
    capacity: 2,
    bed_type: "Queen Size",
    status: "booked", 
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
    amenities: ["Wifi", "Ban công", "Mini Bar"]
  },

  // --- Phòng của Sofitel Legend Metropole (id_hotel: 3) ---
  {
    id_room: 301,
    id_hotel: 3,
    room_type: "Luxury Room Heritage",
    price_per_night: 5500000,
    capacity: 2,
    bed_type: "King Size",
    status: "available",
    image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500",
    amenities: ["Wifi", "Sàn gỗ", "Dịch vụ quản gia"]
  }
];

// 4. DỮ LIỆU ĐƠN ĐẶT PHÒNG (BOOKINGS)
// Dùng cho cả Partner quản lý và Customer xem lịch sử
export const MOCK_BOOKINGS = [
  {
    id: "BK001", // Thống nhất dùng "id" để khớp với code Table
    id_user: 3,
    customer_name: "Nguyễn Khách Hàng",
    customer_phone: "0901234567",
    id_hotel: 1,
    hotel_name: "Vinpearl Luxury Nha Trang",
    room_number: "101",
    room_type_name: "Deluxe Ocean View",
    check_in: "2026-04-10",
    check_out: "2026-04-12",
    total_price: 5000000,
    status: "Pending" // "Pending", "Confirmed", "Cancelled", "Completed"
  },
  {
    id: "BK002",
    id_user: 3,
    customer_name: "Nguyễn Khách Hàng",
    customer_phone: "0901234567",
    id_hotel: 2,
    hotel_name: "InterContinental Da Nang",
    room_number: "201",
    room_type_name: "Classic Terrace Ocean",
    check_in: "2026-05-20",
    check_out: "2026-05-22",
    total_price: 8400000,
    status: "Confirmed"
  }
];