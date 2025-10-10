import React from "react";
import { User, Shield, GraduationCap } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  createdAt: string;
}

const roleConfig: Record<User["role"], { color: string; icon: React.ReactNode }> = {
  Student: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: <User className="w-4 h-4 text-green-600" />
  },
  Teacher: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <GraduationCap className="w-4 h-4 text-blue-600" />
  },
  Admin: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <Shield className="w-4 h-4 text-red-600" />
  },
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const { color, icon } = roleConfig[user.role];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-3 sm:gap-0">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-md">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role & Date */}
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${color} whitespace-nowrap`}>
          {user.role}
        </span>
        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default UserCard;