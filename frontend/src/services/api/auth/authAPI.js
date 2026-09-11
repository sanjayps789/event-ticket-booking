import SERVER_URL from "../../baseUrl.js";
import { commonAPI } from "../../commonAPI.js";

export const registerAPI = async(user) =>{
return await commonAPI("POST",`${SERVER_URL}/auth/register`,user,"")
}

export const loginAPI = async(user) =>{
return await commonAPI("POST",`${SERVER_URL}/auth/login`,user,"")
}