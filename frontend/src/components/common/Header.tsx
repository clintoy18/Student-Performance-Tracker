import { GraduationCap, User, LogOut } from "lucide-react";
import Button from "./Button";

const Header = () => {
  const name = "James Walker";
  const role = "Teacher";

  const handleLogout = () => {
    // TODO: Hook into your auth/logout logic
    console.log("Logging out...");
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 border-b bg-white">
      {/* Left: App Name */}
      <div className="flex items-center gap-2">
        <GraduationCap className="w-6 h-6" />
        <h1 className="font-heading text-lg font-semibold tracking-tight">
          Student Progress Tracker
        </h1>
      </div>

      {/* Right: User Section */}
      <div className="flex items-center gap-5">
        {/* Avatar + Info */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 border">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-medium text-gray-800 leading-tight">
              {name}
            </span>
            <span className="font-sans text-xs text-gray-500 leading-tight">
              {role}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          onClick={handleLogout}
          label="Sign out"
          icon={<LogOut className="w-4 h-4" />}
          iconPosition="right"
          className="px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
        />
      </div>
    </header>
  );
};

export default Header;
