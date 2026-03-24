import axios from 'axios';

const axiosClient = axios.create({
  // Đây là địa chỉ Backend, sau này nếu ông đổi cổng thì chỉ cần sửa 1 chỗ này thôi
  baseURL: 'http://localhost:5173/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mỗi khi gửi yêu cầu lên server
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Xử lý dữ liệu trả về hoặc bắt lỗi tập trung
axiosClient.interceptors.response.use((response) => {
  return response.data; // Trả về thẳng data để bên ngoài không cần .data nữa
}, (error) => {
  // Nếu lỗi 401 (Hết hạn đăng nhập) thì có thể đẩy người dùng ra trang Login
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default axiosClient;