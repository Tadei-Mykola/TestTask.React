import axios from 'axios';
import { LocalStorageService } from './services/index';

const axiosInstance = axios.create();


axiosInstance.interceptors.request.use(
  function (config) {
    const localStorageService = new LocalStorageService()
    const token = localStorageService.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


export default axiosInstance;
