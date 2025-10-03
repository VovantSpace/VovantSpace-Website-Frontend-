// src/utils/api.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // send cookies if refresh token is stored in HttpOnly cookie
});

// Flag to avoid multiple refresh calls
let isRefreshing = false;
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiry (401 Unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true } // so cookies are sent
                );

                const newToken = refreshResponse.data?.accessToken;

                if (newToken) {
                    localStorage.setItem("token", newToken);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    processQueue(null, newToken);

                    // retry original request with new token
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("token");
                window.location.href = "/login"; // redirect to login
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Attach token automatically if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
