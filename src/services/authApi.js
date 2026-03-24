import axiosClient from './axiosClient';

const authApi = {
  register: (data) => {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },
  // Sau này thêm login ở đây...
};

export default authApi;