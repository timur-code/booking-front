import axios from 'axios';

const uAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_SERVICE, 
});

// Request interceptor to add Authorization token to all requests, if available
uAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export default uAxios;