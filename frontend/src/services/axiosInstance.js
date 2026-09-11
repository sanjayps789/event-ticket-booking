import axios from "axios";
import SERVER_URL from "./baseUrl";
import { store } from "../redux/store";

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;