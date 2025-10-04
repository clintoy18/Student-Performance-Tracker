import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerStudent, fetchUser } from "@services";
import type { IAuthContext, ILoginRequest, IUser } from "@interfaces";

type TNullableUser = IUser | null;

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<TNullableUser>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchUser = async () => {
    try {
      const response = await fetchUser();
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Failed to fetch user: ", error);
      setUser(null);
      throw error;
    }
  };

  const handleLogin = async (credentials: ILoginRequest) => {
    try {
      await loginUser(credentials);
    } catch (error) {
      console.error("Failed to login user: ", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await handleFetchUser();
      } catch (err) {
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const contextValue: IAuthContext = {
    handleFetchUser,
    handleLogin,
    user,
    isLoading
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
