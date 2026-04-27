import axios from 'axios';

//const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_BASE = 'https://jsonplaceholder.typicode.com';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 100, 
});

// --- CHIỀU ĐI: TỰ ĐỘNG GẮN TOKEN TỪ SESSION ---
axiosClient.interceptors.request.use(
  (config) => {
    // SỬA TẠI ĐÂY: Chuyển từ localStorage sang sessionStorage
    const token = sessionStorage.getItem('access_token') || sessionStorage.getItem('token');
    
    if (token && !token.startsWith('mock_')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- CHIỀU VỀ: XỬ LÝ LỖI ---
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // 1. Xử lý lỗi 401: Hết hạn hoặc sai Token
      if (status === 401) {
        // SỬA TẠI ĐÂY: Xóa sạch ở sessionStorage để các tab không ảnh hưởng nhau
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('role');

        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      if (status === 403) {
        console.error("Bạn không có quyền thực hiện hành động này.");
      }

      if (status >= 500) {
        console.error("Hệ thống Server đang gặp sự cố.");
      }
    } else if (error.request) {
      console.error("Không thể kết nối đến máy chủ. Kiểm tra lại Backend!");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;