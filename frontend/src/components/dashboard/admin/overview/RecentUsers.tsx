import React from "react";
import UserCard from "./UserCard";
import type { IUser } from "@interfaces";

const RecentUsers: React.FC<{ users: IUser[] }> = ({ users }) => {

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Users</h3>
        <p className="text-sm text-gray-500 mt-1">Latest registered users</p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <UserCard key={user.UserId} user={user} />
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;