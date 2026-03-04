import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const tokenService = {
  getAcess: () => localStorage.getItem('access_token') ?? '',
  setToken: (access: string) => {
    localStorage.setItem('access_token', access);
  },
  clear: () => {
    localStorage.removeItem('access_token');
  },
};
const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,
});
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access_token = tokenService.getAcess();
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((error) => {
            Promise.reject(error);
          });
      }
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`, // ← Full URL
          {},
          { withCredentials: true }
        );
        tokenService.setToken(data.data);
        processQueue(null, data.data);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clear();
        window.location.href = '/loign';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
