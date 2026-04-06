import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
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
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("auth-storage")
        window.location.href = "/login"
      }
    }

    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export default api;