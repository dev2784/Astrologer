import axios from 'axios';

// Replace the XX with your actual computer's IP address when you want to test locally
const LOCAL_URL = 'http://192.168.1.XX:8080'; 
const PROD_URL = 'https://vedik-app.onrender.com';

// We are forcing the PROD URL right now to guarantee a connection
const BASE_URL = PROD_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Detected:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);