import axiosInstance from "./axiosInstance";

export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: httpRequest,
    url,
    data: reqBody,
    headers: reqHeader || { "Content-Type": "application/json" },
  };

  return axiosInstance(reqConfig);
};