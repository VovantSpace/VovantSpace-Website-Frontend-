// src/utils/api.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
    failedQueue = [];
};

// Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
                    .then((token) => {
                        if (token) originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // ✅ use the SAME instance + baseURL (/api already included)
                const refreshResponse = await api.post("/auth/refresh");

                // align name with your backend: accessToken OR token
                const newToken =
                    refreshResponse.data?.accessToken ??
                    refreshResponse.data?.token ??
                    refreshResponse.data?.access_token;

                if (!newToken) throw new Error("Refresh succeeded but no access token returned");

                localStorage.setItem("token", newToken);
                api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("token");
                // don't hard redirect here; let auth layer decide
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
