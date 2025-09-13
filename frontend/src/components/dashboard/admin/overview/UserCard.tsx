import React from "react";
import { User, Shield, GraduationCap } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  createdAt: string;
}

const roleColors: Record<User["role"], string> = {
  Student: "bg-green-100 text-green-600",
  Teacher: "bg-blue-100 text-blue-600",
  Admin: "bg-red-100 text-red-600",
};

const roleIcons: Record<User["role"], React.ReactNode> = {
  Student: <User className="w-5 h-5 text-green-500" />,
  Teacher: <GraduationCap className="w-5 h-5 text-blue-500" />,
  Admin: <Shield className="w-5 h-5 text-red-500" />,
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {roleIcons[user.role]}
        <div>
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[user.role]}`}
        >
          {user.role}
        </span>
        <p className="text-xs text-gray-400">
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
