import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  isAccessTokenInSession,
  registerStudent,
  fetchUser,
} from "@services";
import type { IAuthContext, ILoginRequest, IRegisterRequest, IUser } from "@interfaces";

type TNullableUser = IUser | null;

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<TNullableUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleFetchUser = async () => {
    try {
      const data = await fetchUser();
      const transformedUser: IUser = {
        UserId: data.userId,
        FirstName: data.firstName,
        LastName: data.lastName,
        Role: data.role,
        MiddleName: data.middleName,
        Program: data.program,
        CreatedTime: data.createdTime,
      };
      setUser(transformedUser);
      return transformedUser;
    } catch (error) {
      console.error("Failed to fetch user: ", error);
      setUser(null);
      return null;
    }
  };

  const handleLogin = async (credentials: ILoginRequest) => {
    try {
      await loginUser(credentials);
      await handleFetchUser();
    } catch (error) {
      console.error("Failed to login user: ", error);
      throw error;
    }
  };

  const handleRegister = async (credentials: IRegisterRequest) => {
    try {
      // handles registration and returns generated userId
      const data = await registerStudent(credentials);

      const { userId } = data;
      return userId;

    } catch (error: any) {
      console.error("Failed to register user:", error);
      // If backend returned an error message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Registration failed");
    }
  };


  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isToken = isAccessTokenInSession();
      if (isToken) {
        await handleFetchUser();
      } else {
        setUser(null);
      }
      setIsLoading(false)
    };

    checkAuth();
  }, []);

  const contextValue: IAuthContext = {
    handleFetchUser,
    handleLogin,
    handleLogout,
    handleRegister,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
