import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL, // TODO AFTER GOT DOMAIN

  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem("auth-storage");

  if (authStorage) {
    try {
      const parsedStorage = JSON.parse(authStorage);

      const token = parsedStorage?.state?.user?.token;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Ошибка парсинга auth-storage:", error);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
export default api;