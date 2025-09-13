import React from "react";
import UserCard from "./UserCard";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  createdAt: string;
}

const RecentUsers: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700">Recent Users</h3>
      <p className="text-xs text-gray-500 mb-4">
        Latest users who joined the system
      </p>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
