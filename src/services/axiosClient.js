import axios from 'axios';

// Lấy base URL từ biến môi trường Vite (VITE_API_URL), ví dụ 'http://localhost:3000/api'
// Nếu không có, mặc định dùng '/api' để tận dụng proxy của dev server
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Development mock mode: when VITE_USE_MOCK === 'true', return mocked responses
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
if (USE_MOCK) {
  import('../mocks/mockData').then((mock) => {
    axiosClient.get = (url, config) => {
      try {
        if (url.startsWith('/hotels/rooms/')) {
          const parts = url.split('/').filter(Boolean);
          const last = parts[parts.length - 1];
          if (last && !last.includes('?')) {
            const id = last;
            const room = mock.findRoomById(id);
            return Promise.resolve(room || null);
          }
          return Promise.resolve(mock.rooms);
        }
        if (url.startsWith('/hotels/reviews')) {
          return Promise.resolve(mock.reviews);
        }
        if (url === '/hotels/bookings/' || url.startsWith('/hotels/bookings')) {
          return Promise.resolve([]);
        }
        if (url === '/accounts/profile/' || url === '/profile/') {
          return Promise.resolve(mock.user);
        }
        return Promise.resolve(null);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    axiosClient.post = (url, data, config) => {
      try {
        if (url === '/register/' || url === '/accounts/register/') {
          return Promise.resolve({ status: 201, message: 'mock created' });
        }
        if (url === '/login/' || url === '/accounts/login/') {
          return Promise.resolve({ access: mock.tokens.access, refresh: mock.tokens.refresh, user: mock.user });
        }
        if (url.startsWith('/hotels/bookings/')) {
          return Promise.resolve({ id: 123, ...data });
        }
        if (url.startsWith('/hotels/reviews/')) {
          return Promise.resolve({ id: 999, ...data });
        }
        return Promise.resolve(null);
      } catch (e) {
        return Promise.reject(e);
      }
    };

    axiosClient.patch = (url, data, config) => Promise.resolve({ ok: true });
    axiosClient.delete = (url, config) => Promise.resolve({ ok: true });
  }).catch(() => {});
}

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