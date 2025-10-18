import { auth } from "../lib/api";
import type { ILoginRequest, IRegisterRequest, IUser } from "@interfaces";

export const loginUser = async (credentials: ILoginRequest) => {
    const response = await auth.post('/login', credentials);
    
    const { token } = response.data;
    if (token) {
      sessionStorage.setItem('accessToken', token);
    }
  
    return response.data;
  };

export const logoutUser = async () => {
  sessionStorage.removeItem('accessToken')
}

export const registerStudent = async(userData: IRegisterRequest) => {
    const response = await auth.post('/register', userData);
    return response.data;
}

export const fetchUser = async() => {
    const response = await auth.get('/me')
    return response.data
}

export const isAccessTokenInSession = () => {
  const token = sessionStorage.getItem('accessToken') 
  if (token) return true
  else return false
}

export const updateSelf = async(userData: IUser, password: string, confirmPassword: string) => {
  const updatedData = {
    ...userData,
    Password: password ?? null,
    ConfirmPassword: confirmPassword ?? null
  }
  const response = await auth.put('/me/update/', updatedData)
  return response.data
}