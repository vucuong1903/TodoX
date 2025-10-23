import useAuthStore from "@/stores/useAuthStore";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const api = axios.create({
   baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
   const { accessToken } = useAuthStore.getState();
   if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
   }
   return config;
});

api.interceptors.response.use(
   (res) => res,
   async (error) => {
      const originalRequest = error.config;

      // Don't retry auth endpoints
      if (
         originalRequest.url.includes("/auth/signin") ||
         originalRequest.url.includes("/auth/signup") ||
         originalRequest.url.includes("/auth/refresh")
      ) {
         return Promise.reject(error);
      }

      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (error.response?.status === 403 && originalRequest._retryCount < 4) {
         originalRequest._retryCount += 1;
         console.log("refresh", originalRequest._retryCount);

         try {
            const res = await api.post("/auth/refresh", {}, { withCredentials: true });
            const newAccessToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
         } catch (refreshError) {
            // Only clear state, don't show toast here as it will be handled by the calling function
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError);
         }
      }

      return Promise.reject(error);
   }
);

export default api;
