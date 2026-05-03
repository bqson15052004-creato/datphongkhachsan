import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:3000/api/v1/management-hotel",
});

request.interceptors.response.use(response => {
  return response.data;
})

export const AuthApiClient = {
  login: async function(account){
    try{
        const res = await request.post("/auth/login", account);
        return res;
    }
    catch(error){
        throw new Error(error);
    }
  },
  register: async (account) => {
    try{
      const res = await request.post("/auth/register", account);
      return res;
    }
    catch(error){
      throw new Error(error);
    }
  }
  
};

export const AccountApiClient = {
  myAccount: async function(id_user) {
      try{
        const res = await request.get(`/account/my-account/${id_user}`,);
        return res;
      }
      catch(error){
          throw new Error(error);
      }
  },
  changePassword: async function(id_user,password) {
      try{
        const res = await request.post(`/account/change-password/${id_user}`,password);
        return res;
      }
      catch(error){
          throw new Error(error);
      }
  }
}
