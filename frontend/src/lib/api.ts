import axios from "axios";

const baseUrl = "http://localhost:54927"; // url sa backend
const apiUrl = `${baseUrl}/api`;


// Create a function to add interceptors to any axios instance
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Optional: Add response interceptor for token refresh or error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle auth errors globally
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
}
);

return instance;
};

export const api = addAuthInterceptor(axios.create({
  baseURL: apiUrl,
}))

export const auth = addAuthInterceptor(axios.create({
  baseURL: `${apiUrl}/auth`,
}))

export const admin = addAuthInterceptor(axios.create({
  baseURL: `${apiUrl}/admin`,
}))