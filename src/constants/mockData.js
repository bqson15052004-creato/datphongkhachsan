// 1. DỮ LIỆU NGƯỜI DÙNG (ACCOUNTS)
export const MOCK_USERS = [
  { 
    id: 1, 
    full_name: "Admin", 
    email: "admin@gmail.com", 
    password: "123", 
    role: "admin", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
  },
  { 
    id: 2, 
    full_name: "Đối Tác 1", 
    email: "partner@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 1,
    phone: "0901 234 567",
    tax_id: "0101234567",
    status: "active",
    created_at: "10/01/2026",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner"
  },
  { 
    id: 4, 
    full_name: "Đối Tác 2", 
    email: "partner_2@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 2,
    phone: "0905 555 666",
    tax_id: "0202234567",
    status: "active",
    created_at: "15/02/2026",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner2"
  },
  { 
    id: 5, 
    full_name: "Đối Tác 3", 
    email: "partner_3@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 3,
    phone: "0904 111 222",
    tax_id: "0303234567",
    status: "active",
    created_at: "20/03/2026",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner3"
  },
  { 
    id: 3, 
    full_name: "Khách Hàng", 
    email: "user@gmail.com", 
    password: "123", 
    role: "customer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer" 
  }
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
    address: 'Đảo Hòn Tre, Vĩnh Nguyên, Nha Trang, Khánh Hòa',
    description: 'Khu nghỉ dưỡng sang trọng bậc nhất bên bờ vịnh Nha Trang với các villa biệt lập.'
  },
  { 
    id_hotel: 2, 
    hotel_name: 'InterContinental Da Nang', 
    price_per_night: 4200000, 
    rate_star: 5, 
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 
    location_city: 'Đà Nẵng',
    address: 'Bán đảo Sơn Trà, Đà Nẵng',
    description: 'Tuyệt tác kiến trúc của Bill Bensley tọa lạc tại bãi Bắc, bán đảo Sơn Trà.'
  },
  { 
    id_hotel: 3, 
    hotel_name: 'Sofitel Legend Metropole', 
    price_per_night: 5500000, 
    rate_star: 5, 
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 
    location_city: 'Hà Nội',
    address: '15 Ngô Quyền, Hoàn Kiếm, Hà Nội',
    description: 'Khách sạn mang phong cách kiến trúc Pháp cổ điển ngay giữa lòng thủ đô.'
  }
];

// 3. DỮ LIỆU PHÒNG (ROOMS)
export const MOCK_ROOMS = [
  // --- HOTEL 1: Vinpearl Luxury Nha Trang (id_hotel: 1) ---
  { id_room: 101, id_hotel: 1, room_type: "Deluxe Ocean View", price_per_night: 2500000, capacity: 2, bed_type: "King Size", status: "available", image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500", amenities: ["Wifi", "Điều hòa", "Bồn tắm"] },
  { id_room: 102, id_hotel: 1, room_type: "Grand Suite Family", price_per_night: 4500000, capacity: 4, bed_type: "2 Double Beds", status: "available", image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500", amenities: ["Hồ bơi riêng", "Smart TV"] },
  { id_room: 104, id_hotel: 1, room_type: "Presidential Villa", price_per_night: 12000000, capacity: 6, bed_type: "3 King Size", status: "available", image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500", amenities: ["Quản gia riêng", "Xe đưa đón"] },

  // --- HOTEL 2: InterContinental Da Nang (id_hotel: 2) ---
  { id_room: 201, id_hotel: 2, room_type: "Classic Terrace Ocean", price_per_night: 4200000, capacity: 2, bed_type: "Queen Size", status: "booked", image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500", amenities: ["Wifi", "Ban công", "Mini Bar"] },
  { id_room: 202, id_hotel: 2, room_type: "Club InterContinental Suite", price_per_night: 6800000, capacity: 2, bed_type: "King Size", status: "available", image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500", amenities: ["Quyền lợi Club Lounge", "Trà chiều"] },

  // --- HOTEL 3: Sofitel Legend Metropole (id_hotel: 3) ---
  { id_room: 301, id_hotel: 3, room_type: "Luxury Room Heritage", price_per_night: 5500000, capacity: 2, bed_type: "King Size", status: "available", image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500", amenities: ["Dịch vụ quản gia", "Loa Bluetooth"] },
  { id_room: 302, id_hotel: 3, room_type: "Opera Wing Suite", price_per_night: 7200000, capacity: 3, bed_type: "King Size + Sofa Bed", status: "booked", image_url: "https://images.unsplash.com/photo-1591088398332-8a77d399a80d?w=500", amenities: ["Ban công hướng phố", "Phòng khách riêng"] }
];

// 4. DỮ LIỆU ĐƠN ĐẶT PHÒNG (BOOKINGS)
export const MOCK_BOOKINGS = [
  { id: "BK001", id_user: 3, customer_name: "Nguyễn Khách Hàng", customer_phone: "0901234567", id_hotel: 1, hotel_name: "Vinpearl Luxury Nha Trang", room_number: "101", room_type_name: "Deluxe Ocean View", check_in: "2026-04-10", check_out: "2026-04-12", total_price: 5000000, status: "Pending" },
  { id: "BK002", id_user: 3, customer_name: "Nguyễn Khách Hàng", customer_phone: "0901234567", id_hotel: 2, hotel_name: "InterContinental Da Nang", room_number: "201", room_type_name: "Classic Terrace Ocean", check_in: "2026-05-20", check_out: "2026-05-22", total_price: 8400000, status: "Confirmed" },
  { id: "BK003", id_user: 3, customer_name: "Nguyễn Khách Hàng", customer_phone: "0901234567", id_hotel: 3, hotel_name: "Sofitel Legend Metropole", room_number: "302", room_type_name: "Opera Wing Suite", check_in: "2026-04-15", check_out: "2026-04-17", total_price: 14400000, status: "Confirmed" }
];

// 5. DOANH THU & CHIẾT KHẤU MẶC ĐỊNH
export const DEFAULT_COMMISSION_RATE = 15;
export const RAW_REVENUE_DATA = [
  { m: '01/2026', rev: 190000000 }, 
  { m: '02/2026', rev: 230000000 }, 
  { m: '03/2026', rev: 210000000 }, 
  { m: '04/2026', rev: 260000000 }
];

// 6. DỮ LIỆU CHIẾT KHẤU CHI TIẾT (COMMISSIONS) - Dành riêng cho trang AdminDiscounts
export const MOCK_COMMISSIONS = [
  { 
    id_discount: 'COMM_01', 
    id_hotel: 1, 
    hotel_name: 'Vinpearl Luxury Nha Trang', 
    partner_name: 'Đối Tác Nha Trang', 
    commission: 15, 
    status: 'active' 
  },
  { 
    id_discount: 'COMM_02', 
    id_hotel: 2, 
    hotel_name: 'InterContinental Da Nang', 
    partner_name: 'Đối Tác Đà Nẵng', 
    commission: 12, 
    status: 'active' 
  },
  { 
    id_discount: 'COMM_03', 
    id_hotel: 3, 
    hotel_name: 'Sofitel Legend Metropole', 
    partner_name: 'Đối Tác Hà Nội', 
    commission: 20, 
    status: 'active' 
  }
];

// 7. MÃ GIẢM GIÁ (PROMOTIONS)
export const MOCK_DISCOUNTS = [
  { id_discount: 'D1', code: 'SUMMER2026', id_hotels: [1, 2], percentage: 10, start_date: '2026-06-01', end_date: '2026-08-31' },
  { id_discount: 'D3', code: 'WELCOME2026', id_hotels: [1, 2, 3], percentage: 5, start_date: '2026-01-01', end_date: '2026-12-31' }
];