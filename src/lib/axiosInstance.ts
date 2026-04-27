import axios from "axios";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗ Обрабатываем только 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ✅ если refresh уже идет — ждем его
        if (!refreshPromise) {
          refreshPromise = AuthService.refresh()
            .then((res) => {
              const { setUser } = useAuthStore.getState();

              if (res.code === 0) {
                setUser(res.data);
                return res.data;
              } else {
                throw new Error("Refresh failed");
              }
            })
            .catch((err) => {
              const { setUser } = useAuthStore.getState();
              setUser(null);

              if (typeof window !== "undefined") {
                const currentUrl = window.location.pathname + window.location.search;
                // window.location.href = `/login?redirect=${encodeURIComponent(currentUrl)}`;

                console.log('Current URL:', currentUrl);
                console.log(encodeURIComponent(currentUrl))
              }

              throw err;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        // ✅ ВСЕ ждут один и тот же promise
        await refreshPromise;

        // ✅ повторяем оригинальный запрос
        return api(originalRequest);

      } catch (err) {
        return Promise.reject(err);
      }
    }

    // ❗ 403 НЕ трогаем (важно!)
    return Promise.reject(error);
  }
);

export default api;