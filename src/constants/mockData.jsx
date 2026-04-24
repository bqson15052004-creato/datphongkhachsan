import React from 'react';

// 1. DỮ LIỆU NGƯỜI DÙNG (ACCOUNTS)
export const MOCK_USERS = [
  { 
    id: 1, 
    full_name: "Quản Trị Viên", 
    user_name: "admin", 
    email: "admin@gmail.com", 
    password: "123", 
    role: "admin", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
  },
  { 
    id: 2, 
    full_name: "Nguyễn Văn Đối Tác", 
    user_name: "partner", 
    email: "partner@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 1, 
    phone: "0901234567",
    business_name: "Vinpearl Luxury System",
    business_address: "Đảo Hòn Tre, Nha Trang, Khánh Hòa",
    tax_code: "0101234567",
    status: "active", 
    created_at: "10/01/2026", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner1" 
  },
  { 
    id: 4, 
    full_name: "Trần Thị Chủ Thầu", 
    user_name: "partner2", 
    email: "partner_2@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 2, 
    phone: "0905555666", 
    business_name: "InterContinental Group VN",
    business_address: "Bán đảo Sơn Trà, Đà Nẵng",
    tax_code: "0202234567",
    status: "active", 
    created_at: "15/02/2026", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner2" 
  },
  { 
    id: 5, 
    full_name: "Lê Minh Partner", 
    user_name: "partner3", 
    email: "partner_3@gmail.com", 
    password: "123", 
    role: "partner", 
    hotel_id: 3, 
    phone: "0904111222", 
    business_name: "Metropole Hanoi Co., Ltd",
    business_address: "15 Ngô Quyền, Hoàn Kiếm, Hà Nội",
    tax_code: "0303234567",
    status: "active", 
    created_at: "20/03/2026", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Partner3" 
  },
  { 
    id: 3, 
    full_name: "Nguyễn Hoàng Khách", 
    user_name: "user", 
    email: "user@gmail.com", 
    password: "123", 
    role: "customer", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer1" 
  },
  { 
    id: 6, 
    full_name: "Minh Anh", 
    user_name: "minhanh", 
    email: "minhanh@gmail.com", 
    password: "123", 
    role: "customer", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer2" 
  }
];

// 2. DỮ LIỆU KHÁCH SẠN (HOTELS)
export const MOCK_HOTELS = [
  { 
    id_hotel: 1, owner_id: 2, hotel_name: 'Vinpearl Luxury Nha Trang', price_per_night: 2500000, 
    rate_star: 5, type: 'resort', status: 'active', discount: 15, 
    location_city: 'Nha Trang', address: 'Đảo Hòn Tre, Nha Trang', 
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
  },
  { 
    id_hotel: 2, owner_id: 4, hotel_name: 'InterContinental Da Nang', price_per_night: 4200000, 
    rate_star: 5, type: 'resort', status: 'active', discount: 12, 
    location_city: 'Đà Nẵng', address: 'Bán đảo Sơn Trà, Đà Nẵng', 
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
  },
  { 
    id_hotel: 3, owner_id: 5, hotel_name: 'Sofitel Legend Metropole', price_per_night: 5500000, 
    rate_star: 5, type: 'hotel', status: 'active', discount: 20, 
    location_city: 'Hà Nội', address: '15 Ngô Quyền, Hoàn Kiếm', 
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
  },
  { 
    id_hotel: 4, owner_id: 2, hotel_name: 'Mường Thanh Luxury Phú Quốc', price_per_night: 1800000, 
    rate_star: 4, type: 'hotel', status: 'active', discount: 10, 
    location_city: 'Phú Quốc', address: 'Bãi Trường, Dương Tơ', 
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
  }
];

// 3. DỮ LIỆU PHÒNG (ROOMS) - Chi tiết cho từng khách sạn
export const MOCK_ROOMS = [
  { 
    id_room: 1, 
    id_hotel: 1, 
    room_number: "V01", 
    room_type: "Deluxe Ocean View", 
    price_per_night: 2500000, 
    capacity: 2, 
    status: "available", 
    image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    amenities: ["wifi", "breakfast", "pool", "bathtub"] // Thêm tiện ích
  },
  { 
    id_room: 2, 
    id_hotel: 1, 
    room_number: "V02", 
    room_type: "Grand Suite Family", 
    price_per_night: 4500000, 
    capacity: 4, 
    status: "available", 
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
    amenities: ["wifi", "breakfast", "pool", "bathtub", "minibar", "gym"]
  },
  { 
    id_room: 3, 
    id_hotel: 2, 
    room_number: "IC-101", 
    room_type: "Classic Terrace Ocean", 
    price_per_night: 4200000, 
    capacity: 2, 
    status: "booked", 
    image_url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
    amenities: ["wifi", "breakfast", "bar", "spa"]
  },
  { 
    id_room: 4, 
    id_hotel: 2, 
    room_number: "IC-202", 
    room_type: "Club InterContinental Suite", 
    price_per_night: 6800000, 
    capacity: 2, 
    status: "available", 
    image_url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500",
    amenities: ["wifi", "breakfast", "pool", "spa", "bar", "bathtub", "minibar"]
  },
  { 
    id_room: 5, 
    id_hotel: 3, 
    room_number: "MET-01", 
    room_type: "Luxury Room Heritage", 
    price_per_night: 5500000, 
    capacity: 2, 
    status: "available", 
    image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500",
    amenities: ["wifi", "breakfast", "bar", "bathtub", "gym"]
  },
  { 
    id_room: 6, 
    id_hotel: 4, 
    room_number: "MT-301", 
    room_type: "Standard Twin Room", 
    price_per_night: 1800000, 
    capacity: 2, 
    status: "available", 
    image_url: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=500",
    amenities: ["wifi", "parking"]
  }
];

// 4. DANH MỤC
export const HOTEL_TYPES = [
  { key: '1', category_name: 'Khách sạn 5 sao', description: 'Đầy đủ tiện nghi cao cấp', status: 'active' },
  { key: '2', category_name: 'Resort', description: 'Khu nghỉ dưỡng sinh thái', status: 'active' },
  { key: '3', category_name: 'Homestay', description: 'Gần gũi với thiên nhiên địa phương', status: 'active' },
  { key: '4', category_name: 'Villa', description: 'Biệt thự riêng tư cho gia đình', status: 'active' },
  { key: '5', category_name: 'Boutique Hotel', description: 'Phong cách thiết kế độc bản', status: 'active' }
];

export const ROOM_TYPES = [
  { key: 'RT1', type_name: 'Phòng Đơn (Single)', capacity: 1, description: 'Dành cho khách đi một mình' },
  { key: 'RT2', type_name: 'Phòng Đôi (Double)', capacity: 2, description: 'Dành cho cặp đôi' },
  { key: 'RT3', type_name: 'Phòng Gia Đình (Family)', capacity: 4, description: 'Không gian rộng cho cả nhà' },
  { key: 'RT4', type_name: 'Phòng Suite', capacity: 2, description: 'Phòng cao cấp nhất khách sạn' },
  { key: 'RT5', type_name: 'Phòng Tổng Thống', capacity: 6, description: 'Đẳng cấp thượng lưu' }
];

export const ALL_AMENITIES = [
  { id: 'wifi', name: 'Wi-Fi miễn phí' },
  { id: 'pool', name: 'Hồ bơi vô cực' },
  { id: 'spa', name: 'Dịch vụ Spa' },
  { id: 'gym', name: 'Phòng Gym 24/7' },
  { id: 'breakfast', name: 'Bữa sáng buffet' },
  { id: 'parking', name: 'Bãi đỗ xe an toàn' },
  { id: 'bar', name: 'Quầy Bar sân thượng' }
];

// 5. MÃ GIẢM GIÁ / KHUYẾN MÃI (DISCOUNTS)
export const DEFAULT_COMMISSION_RATE = 15;
export const MOCK_DISCOUNTS = [
  { 
    id_discount: 'D001', 
    code: 'SUMMER2026', 
    description: 'Khuyến mãi chào hè 2026 (Nha Trang & Đà Nẵng)',
    id_hotels: [1, 2],
    percentage: 15, 
    start_date: '2026-06-01', 
    end_date: '2026-08-31',
    status: 'active'
  },
  { 
    id_discount: 'D002', 
    code: 'WELCOME2026', 
    description: 'Giảm giá thành viên mới toàn hệ thống',
    id_hotels: 'all',
    percentage: 10, 
    start_date: '2026-01-01', 
    end_date: '2026-12-31',
    status: 'active'
  },
  { 
    id_discount: 'D003', 
    code: 'FLASH_SALE', 
    description: 'Flash sale cuối tuần tại Hà Nội',
    id_hotels: [3],
    percentage: 25, 
    start_date: '2026-04-10', 
    end_date: '2026-04-12',
    status: 'expired'
  },
  { 
    id_discount: 'D004', 
    code: 'PHUQUOC_50', 
    description: 'Kích cầu du lịch đảo ngọc Phú Quốc',
    id_hotels: [4],
    percentage: 50, 
    start_date: '2026-05-01', 
    end_date: '2026-05-31',
    status: 'active'
  }
];

// 6. GIAO DỊCH & LOGIC DOANH THU
export const TRANSACTION_LIST_MOCK = [
  { key: '1', transaction_id: 'HD1001', hotel_name: 'Vinpearl Luxury Nha Trang', total_amount: 5000000, commission_rate: 0.15, transaction_date: '2026-01-10', payment_status: 'success' },
  { key: '2', transaction_id: 'HD1002', hotel_name: 'InterContinental Da Nang', total_amount: 3200000, commission_rate: 0.10, transaction_date: '2026-02-15', payment_status: 'success' },
  { key: '3', transaction_id: 'HD1003', hotel_name: 'Pullman Vũng Tàu', total_amount: 4500000, commission_rate: 0.12, transaction_date: '2026-03-23', payment_status: 'success' },
  { key: '4', transaction_id: 'HD1004', hotel_name: 'Vinpearl Luxury Nha Trang', total_amount: 8000000, commission_rate: 0.15, transaction_date: '2026-04-05', payment_status: 'success' },
  { key: '5', transaction_id: 'HD1005', hotel_name: 'InterContinental Da Nang', total_amount: 15000000, commission_rate: 0.10, transaction_date: '2026-04-10', payment_status: 'success' },
  { key: '6', transaction_id: 'HD1006', hotel_name: 'Mường Thanh Luxury Phú Quốc', total_amount: 7200000, commission_rate: 0.12, transaction_date: '2026-04-15', payment_status: 'success' },
];

export const TOP_HOTELS_MOCK = [
  { hotel_name: 'Vinpearl Luxury Nha Trang', total_sales: 45, revenue_value: 120000000, occupancy_rate: 85 },
  { hotel_name: 'InterContinental Da Nang', total_sales: 32, revenue_value: 95000000, occupancy_rate: 78 }
];

const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const RAW_REVENUE_DATA = ['01/2026', '02/2026', '03/2026', '04/2026'].map(m => {
  const revInMonth = TRANSACTION_LIST_MOCK
    .filter(t => getMonthYear(t.transaction_date) === m && t.payment_status === 'success')
    .reduce((sum, t) => sum + t.total_amount, 0);
  return { m, rev: revInMonth };
});

export const REVENUE_MOCK = RAW_REVENUE_DATA.map((data, index) => ({
  key: String(index + 1),
  month_label: `Tháng ${data.m.split('/')[0]}`,
  total_revenue: data.rev,
  booking_count: TRANSACTION_LIST_MOCK.filter(t => getMonthYear(t.transaction_date) === data.m).length,
  trend_status: data.rev > (RAW_REVENUE_DATA[index - 1]?.rev || 0) ? 'up' : 'down'
}));

export const REPORT_SUMMARY_MOCK = {
  monthly_revenue: RAW_REVENUE_DATA[RAW_REVENUE_DATA.length - 1].rev,
  revenue_growth: 12.5,
  total_bookings: TRANSACTION_LIST_MOCK.length,
  booking_growth: 5.2,
  new_members: MOCK_USERS.filter(u => u.role === 'customer').length,
  active_partners: [...new Set(TRANSACTION_LIST_MOCK.map(t => t.hotel_name))].length
};

export const MOCK_BOOKINGS = [
  { id: "BK001", customer_name: "Nguyễn Văn Khách", hotel_name: "Vinpearl Luxury Nha Trang", room_number: "V01", check_in: "2026-04-10", check_out: "2026-04-12", total_price: 5000000, status: "Pending" }
];