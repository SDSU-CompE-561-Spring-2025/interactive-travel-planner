import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Any status codes outside the range of 2xx cause this function to trigger
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config
        });
        return Promise.reject(error);
    }
);

// Add a request interceptor to add the token
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Ensure headers object exists
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance; 