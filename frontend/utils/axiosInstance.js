import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://sih-mind-mate-o7ed.vercel.app/api',
  withCredentials: true, // Include credentials for CORS requests
});

export default axiosInstance;
