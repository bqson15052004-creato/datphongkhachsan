import { API_CLIENT } from "../../constants/api";
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
  }
    
};
