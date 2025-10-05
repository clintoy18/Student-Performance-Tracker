import axios from 'axios'

const baseUrl = 'http://localhost:54927' // url sa backend
const apiUrl = `${baseUrl}/api`

export const api = axios.create({
    baseURL: apiUrl  
})

export const auth = axios.create({
    baseURL: `${apiUrl}/auth`
})

auth.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});