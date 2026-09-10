import axios from 'axios';

// Override for local/staging builds; existing production builds keep their endpoint.
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://vedik-app.onrender.com';

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