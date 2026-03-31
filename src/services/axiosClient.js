import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Gửi Token đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Nhận dữ liệu về
axiosClient.interceptors.response.use((response) => {
  return response.data; 
}, (error) => {
  // Xử lý lỗi tập trung
  if (error.response) {
    if (error.response.status === 401) {
      console.warn("Phiên đăng nhập hết hạn, đang chuyển hướng...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export default axiosClient;