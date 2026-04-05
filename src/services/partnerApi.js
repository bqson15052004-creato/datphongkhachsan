import axiosClient from './axiosClient';

/**
 * QUẢN LÝ CÁC API DÀNH RIÊNG CHO CHỦ KHÁCH SẠN / ĐỐI TÁC
 */
export const partnerApi = {
    // --- 1. QUẢN LÝ PHÒNG (ROOM MANAGEMENT) ---
    
    // Lấy danh sách phòng thuộc quyền quản lý của Partner này
    getMyRooms: () => {
        return axiosClient.get('/partner/rooms/');
    },

    // Thêm một phòng mới (Gửi FormData nếu có ảnh, hoặc Object JSON)
    createRoom: (roomData) => {
        return axiosClient.post('/partner/rooms/', roomData);
    },

    // Cập nhật thông tin phòng (Sửa giá, đổi mô tả, đổi trạng thái trống/hết)
    updateRoom: (id, roomData) => {
        return axiosClient.patch(`/partner/rooms/${id}/`, roomData);
    },

    // Xóa phòng khỏi hệ thống
    deleteRoom: (id) => {
        return axiosClient.delete(`/partner/rooms/${id}/`);
    },


    // --- 2. QUẢN LÝ ĐƠN ĐẶT PHÒNG (BOOKING MANAGEMENT) ---

    // Xem danh sách khách đã đặt phòng của khách sạn mình
    getIncomingBookings: (params) => {
        // params có thể là { status: 'Pending' } để lọc đơn mới
        return axiosClient.get('/partner/bookings/', { params });
    },

    // Xác nhận đơn đặt phòng của khách (Chuyển từ Pending -> Confirmed)
    confirmBooking: (bookingId) => {
        return axiosClient.post(`/partner/bookings/${bookingId}/confirm/`);
    },

    // Từ chối đơn đặt phòng (Ví dụ: do phòng gặp sự cố đột xuất)
    rejectBooking: (bookingId, reason) => {
        return axiosClient.post(`/partner/bookings/${bookingId}/reject/`, { reason });
    },


    // --- 3. THỐNG KÊ (DASHBOARD METRICS) ---

    // Lấy số liệu doanh thu, số đơn hàng trong tháng
    getStatistics: () => {
        return axiosClient.get('/partner/statistics/');
    }
};

export default partnerApi;