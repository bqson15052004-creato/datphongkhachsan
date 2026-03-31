import axios from 'axios';

const API_URL = 'http://localhost:8000/api/hotels/';

// Hàm lấy Token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const hotelApi = {
    // 1. Lấy danh sách phòng cho trang HotelList.jsx
    getRooms: () => axios.get(`${API_URL}rooms/`),

    // 2. Lấy chi tiết 1 phòng cho trang HotelDetail.jsx
    getRoomDetail: (id) => axios.get(`${API_URL}rooms/${id}/`),

    // 3. Đặt phòng ở trang Checkout.jsx
    createBooking: (bookingData) => 
        axios.post(`${API_URL}bookings/`, bookingData, { headers: getAuthHeader() }),

    // 4. Lấy lịch sử đặt phòng cho trang Profile.jsx
    getMyBookings: () => 
        axios.get(`${API_URL}bookings/`, { headers: getAuthHeader() }),

    // 5. Hủy đơn đặt phòng
    cancelBooking: (id) => 
        axios.patch(`${API_URL}bookings/${id}/cancel/`, {}, { headers: getAuthHeader() }),

    // 6. Gửi đánh giá
    postReview: (reviewData) => 
        axios.post(`${API_URL}reviews/`, reviewData, { headers: getAuthHeader() })
};