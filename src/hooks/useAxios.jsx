import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
  baseURL: "https://contest-hub-server-blond.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
