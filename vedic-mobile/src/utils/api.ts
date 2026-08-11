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
    // 1. If it's a 404 (Not Found), let the component handle the empty state silently
    if (error.response && error.response.status === 404) {
      return Promise.reject(error); 
    }

    // 2. Stop showing raw JSON. Extract the actual message cleanly.
    const errorMessage = error.response?.data?.error || "Network Error";
    
    // Only show the alert if it's not a background fetch (optional)
    // Alert.alert("Error", errorMessage); 

    return Promise.reject(error);
  }
);