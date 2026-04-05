import axios from 'axios';

// Ưu tiên biến môi trường, mặc định là API cục bộ nếu không có
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Thêm timeout 10s để tránh treo request lâu quá
});

// --- CHIỀU ĐI: TỰ ĐỘNG GẮN TOKEN ---
axiosClient.interceptors.request.use(
  (config) => {
    // Đảm bảo lấy đúng key ông đã lưu lúc Login
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    if (token && !token.startsWith('mock_')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- CHIỀU VỀ: XỬ LÝ DỮ LIỆU & LỖI TẬP TRUNG ---
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data để bên ngoài không cần .data nữa
    return response.data; 
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;

      // 1. Xử lý lỗi 401: Hết hạn hoặc sai Token
      if (status === 401) {
        //console.warn("Phiên đăng nhập hết hạn hoặc không có quyền truy cập.");
        
        // Clear sạch các thông tin liên quan đến session
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        // Nếu không phải đang ở trang login thì mới chuyển hướng để tránh loop
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      // 2. Xử lý lỗi 403: Có login nhưng không có quyền vào vùng này (ví dụ User đòi vào Admin)
      if (status === 403) {
        console.error("Bạn không có quyền thực hiện hành động này.");
      }

      // 3. Xử lý lỗi 500: Lỗi Server
      if (status >= 500) {
        console.error("Hệ thống Server đang gặp sự cố.");
      }
    } else if (error.request) {
      // Lỗi mạng, server không phản hồi
      console.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra internet.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;