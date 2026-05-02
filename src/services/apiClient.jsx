import { API_CLIENT } from "../constants/api";
import axios from "axios";

export const AuthApiClient = {
  login: async function(account){
    try{
        const res = await axios.post(API_CLIENT + "/auth/login", account);
        return res;
    }
    catch(error){
        throw new Error(error);
    }
  },
  
};

export const AccountApiClient = {
  myAccount: async function(id_user) {
      try{
        const res = await axios.get(API_CLIENT + `/account/my-account/${id_user}`,);
        return res;
      }
      catch(error){
          throw new Error(error);
      }
  },
  changePassword: async function(id_user,password) {
      try{
        const res = await axios.post(API_CLIENT + `/account/change-password/${id_user}`,password);
        return res;
      }
      catch(error){
          throw new Error(error);
      }
  }
}
