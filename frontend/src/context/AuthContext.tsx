import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  logoutUser,
  isAccessTokenInSession,
  registerStudent,
  fetchUser,
} from "@services";
import type { IAuthContext, ILoginRequest, IUser } from "@interfaces";

type TNullableUser = IUser | null;

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<TNullableUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchUser = async () => {
    try {
      const data = await fetchUser();
      const transformedUser: IUser = {
        UserId: data.userId,
        FirstName: data.firstName,
        LastName: data.lastName,
        Role: data.role,
        MiddleName: "",
        Program: "",
        CreatedTime: "",
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
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const contextValue: IAuthContext = {
    handleFetchUser,
    handleLogin,
    handleLogout,
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
