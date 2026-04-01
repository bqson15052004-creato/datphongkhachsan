import axiosClient from './axiosClient';

export const hotelApi = {
    // 1. Lấy danh sách phòng cho trang HotelList.jsx
    getRooms: (params) => axiosClient.get('/hotels/rooms/', { params }),

    // 2. Lấy chi tiết 1 phòng cho trang HotelDetail.jsx
    getRoomDetail: (id) => axiosClient.get(`/hotels/rooms/${id}/`),

    // 3. Đặt phòng ở trang Checkout.jsx
    createBooking: (bookingData) => axiosClient.post('/hotels/bookings/', bookingData),

    // 4. Lấy lịch sử đặt phòng cho trang Profile.jsx
    getMyBookings: () => axiosClient.get('/hotels/bookings/'),

    // 5. Hủy đơn đặt phòng
    cancelBooking: (id) => axiosClient.patch(`/hotels/bookings/${id}/cancel/`, {}),

    // 6. Gửi đánh giá
    postReview: (reviewData) => axiosClient.post('/hotels/reviews/', reviewData),
};