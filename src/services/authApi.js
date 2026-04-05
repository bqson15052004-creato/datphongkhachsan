import axiosClient from './axiosClient';

const authApi = {
  // 1. Đăng ký tài khoản mới
  register: (data) => {
    const url = '/register/';
    return axiosClient.post(url, data);
  },

  // 2. Đăng nhập hệ thống
  login: (data) => {
    const url = '/login/';
    return axiosClient.post(url, data);
  },

  // 3. Lấy thông tin người dùng hiện tại dựa trên Token
  // Dùng khi: User F5 trang web, cần lấy lại thông tin để hiển thị ở Navbar/Profile
  getProfile: () => {
    const url = '/profile/';
    return axiosClient.get(url);
  },

  // 4. Đăng xuất
  logout: () => {
    const url = '/logout/';
    return axiosClient.post(url);
  }
};

export default authApi;