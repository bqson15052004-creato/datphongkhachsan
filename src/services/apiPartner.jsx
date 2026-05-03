import axios from "axios";

const request = axios.create({
    baseURL: "http://localhost:3000/api/v1/management-hotel/partner"
})

request.interceptors.response.use((response) => {
    return response.data;
})

export const AuthApiPartner = {
    login: async (account) => {
        try{
            const res = await request.post("/auth/login",account);
            return res;
        }
        catch(error){
            throw new Error(error);
        }
    
    }
}