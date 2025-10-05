import type { IUser, ILoginRequest, IRegisterRequest } from "@interfaces";

export interface IAuthContext {
  handleFetchUser: () => Promise<IUser | null>;
  handleLogin: (credentials: ILoginRequest) => Promise<void>;
  handleLogout: () => void;
  handleRegister: (credentials: IRegisterRequest) => Promise<void>;
  user: IUser | null;
  isLoading: boolean;
}