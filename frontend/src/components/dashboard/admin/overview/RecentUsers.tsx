import React from "react";
import UserCard from "./UserCard";
import type { IUser } from "@interfaces";

const RecentUsers: React.FC<{ users: IUser[] }> = ({ users }) => {

  return (
      <>
        {users.map((user) => (
          <UserCard key={user.UserId} user={user} />
        ))}
      </>
  );
};

export default RecentUsers;