import axios from 'axios'

const baseUrl = 'https://localhost:54926/api'

export const api = axios.create({
    baseURL: baseUrl   // url sa backend
})

export const auth = axios.create({
    baseURL: `${baseUrl}/auth/`
})

auth.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});