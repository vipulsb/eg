import axios, { AxiosInstance } from "axios";

export const apiClient: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
