import axiosClient from './axiosClient';

/**
 * QUẢN LÝ CÁC API DÀNH RIÊNG CHO CHỦ KHÁCH SẠN / ĐỐI TÁC (PARTNER)
 */
export const partnerApi = {
    // --- 1. QUẢN LÝ KHÁCH SẠN (HOTEL MANAGEMENT) ---
    
    // Lấy danh sách các khách sạn mà đối tác này sở hữu
    getMyHotels: () => {
        return axiosClient.get('/partner/hotels/');
    },

    // --- 2. QUẢN LÝ LOẠI PHÒNG (ROOM TYPES) ---
    // Ví dụ: Phòng Deluxe, Phòng Suite... (Dùng cho PartnerRooms.jsx)
    
    getRoomTypes: (hotelId) => {
        return axiosClient.get('/partner/room-types/', { params: { hotel_id: hotelId } });
    },

    createRoomType: (data) => {
        return axiosClient.post('/partner/room-types/', data);
    },

    // --- 3. QUẢN LÝ SỐ PHÒNG CHI TIẾT (ROOM INSTANCES / ROOM NUMBERS) ---
    // Đây là phần dùng cho file RoomNumber.jsx ông vừa tạo
    
    // Lấy danh sách các số phòng cụ thể (101, 102...) theo khách sạn
    getRoomNumbers: (hotelId) => {
        return axiosClient.get('/partner/room-numbers/', { params: { hotel_id: hotelId } });
    },

    // Thêm một số phòng mới (Gán vào một loại phòng cụ thể)
    createRoomNumber: (roomData) => {
        return axiosClient.post('/partner/room-numbers/', roomData);
    },

    // Cập nhật trạng thái phòng (Trống / Đang ở / Bảo trì)
    updateRoomNumber: (id, roomData) => {
        return axiosClient.patch(`/partner/room-numbers/${id}/`, roomData);
    },

    // Xóa số phòng
    deleteRoomNumber: (id) => {
        return axiosClient.delete(`/partner/room-numbers/${id}/`);
    },

    // --- 4. QUẢN LÝ ĐƠN ĐẶT PHÒNG (BOOKING MANAGEMENT) ---

    // Xem danh sách đơn đặt phòng của các khách sạn thuộc sở hữu
    getIncomingBookings: (params) => {
        return axiosClient.get('/partner/bookings/', { params });
    },

    // Cập nhật trạng thái đơn hàng (Xác nhận/Từ chối/Check-in/Check-out)
    updateBookingStatus: (bookingId, status) => {
        return axiosClient.patch(`/partner/bookings/${bookingId}/status/`, { status });
    },

    // --- 5. THỐNG KÊ & BÁO CÁO (DASHBOARD METRICS) ---

    // Dữ liệu cho biểu đồ và các ô Statistic ở Dashboard
    getStatistics: (params) => {
        // params có thể là { hotel_id: 101, year: 2026 }
        return axiosClient.get('/partner/statistics/', { params });
    }
};

export default partnerApi;