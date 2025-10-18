import { admin } from "../lib/api";
import type { IUser } from "@interfaces";

const roleMap: { [key: string]: number } = {
  Student: 0,
  Teacher: 1,
  Admin: 2,
};

type TUserWithOptionalPassword = IUser & {
  password?: string;
  confirmPassword?: string;
};

export const fetchAllUsersAdmin = async () => {
  const response = await admin.get("/user");
  return response.data;
};

export const createNewUserAdmin = async (newUser: IUser) => {
  const roleNumber = roleMap[newUser.Role];

  const response = await admin.post("/user/create", {
    ...newUser,
    Role: roleNumber,
  });
  return response.data;
};

export const updateUserAdmin = async (user: TUserWithOptionalPassword) => {
  const roleNumber = roleMap[user.Role];

  const response = await admin.put(`/user/update/${user.UserId}`, {
    ...user,
    Role: roleNumber,
  });
  return response.data;
};

export const deleteUserAdmin = async (userId: string) => {
  const response = await admin.delete(`/user/delete/${userId}`);
  return response.data;
};

export const getUserAdmin = async (userId: string) => {
  const response = await admin.get(`/user/${userId}`);

  return response.data;
};

export const getRecentUsers = async (userCount: number) => {
  const response = await admin.get(`/user/recent?count=${userCount}`)
  return response.data
}

export const fetchStats = async() => {
  const response = await admin.get('/dashboard-stats')
  return response.data
}