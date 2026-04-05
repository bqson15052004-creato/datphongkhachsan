import axiosClient from './axiosClient';

/**
 * TẬP TRUNG QUẢN LÝ TẤT CẢ ENDPOINTS CỦA DỰ ÁN ĐẶT PHÒNG
 */
export const hotelApi = {
    // 1. Lấy danh sách phòng (Có thể lọc theo location, check_in, check_out)
    // Dùng cho: HotelList.jsx
    getRooms: (params = {}) => {
        const url = '/hotels/rooms/';
        return axiosClient.get(url, { params });
    },

    // 2. Lấy thông tin chi tiết một phòng dựa trên ID
    // Dùng cho: HotelDetail.jsx
    getRoomDetail: (id) => {
        const url = `/hotels/rooms/${id}/`;
        return axiosClient.get(url);
    },

    // 3. Tạo đơn đặt phòng mới (Gửi object: room_id, check_in, check_out, total_price...)
    // Dùng cho: Checkout.jsx
    createBooking: (bookingData) => {
        const url = '/hotels/bookings/';
        return axiosClient.post(url, bookingData);
    },

    // 4. Lấy toàn bộ danh sách đơn đặt phòng của người dùng đang đăng nhập
    // Dùng cho: Profile.jsx (Tab Lịch sử)
    getMyBookings: () => {
        const url = '/hotels/bookings/';
        return axiosClient.get(url);
    },

    // 5. Cập nhật trạng thái đơn hàng thành "Đã hủy"
    // Sử dụng PATCH để cập nhật một phần dữ liệu
    cancelBooking: (id) => {
        const url = `/hotels/bookings/${id}/cancel/`; 
        // Thường Backend sẽ xử lý logic đổi status bên trong endpoint này
        return axiosClient.patch(url, {}); 
    },

    // 6. Gửi đánh giá và số sao cho một phòng đã trải nghiệm
    // Dùng cho: Profile.jsx (Modal Đánh giá)
    postReview: (reviewData) => {
        const url = '/hotels/reviews/';
        return axiosClient.post(url, reviewData);
    },

    // 7. (Gợi ý thêm) Lấy danh sách đánh giá của một phòng cụ thể
    getRoomReviews: (roomId) => {
        const url = '/hotels/reviews/';
        return axiosClient.get(url, { params: { room_id: roomId } });
    }
};

export default hotelApi;